/**
 * scoreEngine.js
 * Centralised score rule definitions and calculation logic.
 * All point values live here. Change here → changes everywhere.
 */

export const SCORE_RULES = {
  // ── Positive ──
  TASK_COMPLETE:        5,   // per task completed
  ALL_TASKS_BONUS:      5,   // bonus when 100% of tasks done
  DAILY_REPORT:         3,   // submitted daily report
  HABIT_BONUS:          1,   // per habit checked
  STREAK_7:            10,   // 7-day streak maintained daily bonus
  STREAK_30:           25,   // 30-day milestone (one-time)
  STREAK_50:           50,   // 50-day milestone (one-time)
  STREAK_100:         100,   // 100-day milestone (one-time)
  STREAK_200:         200,   // 200-day milestone (one-time)
  GITHUB_COMMIT:        2,   // GitHub API verified commit today
  RECOVERY_BONUS:       5,   // next day after a miss, full completion
  BADGE_UNLOCK:        10,   // unlocking any badge

  // ── Negative ──
  MISSED_DAY:          -8,   // missed day penalty
  STREAK_BREAK:        -5,   // additional streak break penalty

  // ── Multipliers ──
  SUNDAY_MULTIPLIER:  1.5,   // 6h Sunday — multiply earned pts by 1.5

  // ── Rank thresholds ──
  RANKS: [
    { id: 'initiate',       label: 'INITIATE',         min: 0,     max: 500 },
    { id: 'analyst',        label: 'ANALYST',           min: 500,   max: 1500 },
    { id: 'operator',       label: 'OPERATOR',          min: 1500,  max: 3000 },
    { id: 'specialist',     label: 'SPECIALIST',        min: 3000,  max: 6000 },
    { id: 'expert',         label: 'EXPERT',            min: 6000,  max: 12000 },
    { id: 'elite',          label: 'ELITE',             min: 12000, max: 25000 },
    { id: 'purple-lead',    label: 'PURPLE TEAM LEAD',  min: 25000, max: null },
  ],
};

/**
 * Get current rank for a given score.
 * @param {number} score
 * @returns {object} rank definition
 */
export function getRank(score) {
  const ranks = SCORE_RULES.RANKS;
  for (let i = ranks.length - 1; i >= 0; i--) {
    if (score >= ranks[i].min) return ranks[i];
  }
  return ranks[0];
}

/**
 * Get progress percentage within current rank.
 * @param {number} score
 * @returns {number} 0–100
 */
export function getRankProgress(score) {
  const rank = getRank(score);
  if (!rank.max) return 100;
  return Math.min(100, Math.round(((score - rank.min) / (rank.max - rank.min)) * 100));
}

/**
 * Calculate score for completing a day.
 * @param {object} params
 * @param {number} params.tasksCompleted
 * @param {number} params.tasksTotal
 * @param {boolean} params.reportSubmitted
 * @param {number} params.habitsChecked
 * @param {boolean} params.isSunday
 * @param {boolean} params.githubCommit
 * @param {boolean} params.isRecovery
 * @returns {number} points earned
 */
export function calculateDayScore({ tasksCompleted, tasksTotal, reportSubmitted, habitsChecked, isSunday, githubCommit, isRecovery }) {
  let pts = 0;

  // Task points
  pts += tasksCompleted * SCORE_RULES.TASK_COMPLETE;

  // All tasks bonus
  if (tasksCompleted === tasksTotal && tasksTotal > 0) {
    pts += SCORE_RULES.ALL_TASKS_BONUS;
  }

  // Report bonus
  if (reportSubmitted) pts += SCORE_RULES.DAILY_REPORT;

  // Habit bonus
  pts += habitsChecked * SCORE_RULES.HABIT_BONUS;

  // GitHub commit
  if (githubCommit) pts += SCORE_RULES.GITHUB_COMMIT;

  // Recovery bonus
  if (isRecovery && tasksCompleted === tasksTotal && tasksTotal > 0) {
    pts += SCORE_RULES.RECOVERY_BONUS;
  }

  // Sunday multiplier (floor to avoid decimal scores)
  if (isSunday) pts = Math.floor(pts * SCORE_RULES.SUNDAY_MULTIPLIER);

  return pts;
}

/**
 * Calculate points to earn next rank.
 * @param {number} score
 * @returns {number}
 */
export function ptsToNextRank(score) {
  const rank = getRank(score);
  if (!rank.max) return 0;
  return rank.max - score;
}

/**
 * Get streak milestone bonus if applicable.
 * @param {number} streak
 * @returns {number} bonus points (0 if no milestone)
 */
export function getStreakMilestoneBonus(streak) {
  const milestones = { 7: SCORE_RULES.STREAK_7, 30: SCORE_RULES.STREAK_30, 50: SCORE_RULES.STREAK_50, 100: SCORE_RULES.STREAK_100, 200: SCORE_RULES.STREAK_200 };
  return milestones[streak] || 0;
}
