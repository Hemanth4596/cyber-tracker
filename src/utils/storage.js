/**
 * storage.js
 * All localStorage read/write operations for CyberTrack.
 * Every key is prefixed with 'ct_' to avoid collisions.
 */

const PREFIX = 'ct_';

const KEYS = {
  START_DATE:       'startDate',
  CURRENT_DAY:      'currentDay',
  TOTAL_SCORE:      'totalScore',
  STREAK:           'streak',
  BEST_STREAK:      'bestStreak',
  COMPLETED_DAYS:   'completedDays',
  MISSED_DAYS:      'missedDays',
  COMPLETED_TASKS:  'completedTasks',
  DAILY_REPORTS:    'dailyReports',
  SCORE_HISTORY:    'scoreHistory',
  BADGES:           'badges',
  GITHUB_TOKEN:     'githubToken',
  GITHUB_USERNAME:  'githubUsername',
  NOTIF_TIME:       'notifTime',
  NOTIF_ENABLED:    'notifEnabled',
  HABITS:           'habits',
  RECOVERY_FLAG:    'recoveryFlag',
  LAST_ACTIVE_DATE: 'lastActiveDate',
  SETTINGS:         'settings',
};

// ── Core get/set/remove ──────────────────────────────────────────────────────

export function storageGet(key, defaultValue = null) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (raw === null) return defaultValue;
    return JSON.parse(raw);
  } catch {
    return defaultValue;
  }
}

export function storageSet(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.error('Storage write failed:', e);
    return false;
  }
}

export function storageRemove(key) {
  localStorage.removeItem(PREFIX + key);
}

export function storageClear() {
  Object.values(KEYS).forEach(k => storageRemove(k));
}

// ── Typed accessors ──────────────────────────────────────────────────────────

export const storage = {
  // Startup
  getStartDate:       () => storageGet(KEYS.START_DATE, null),
  setStartDate:       (d) => storageSet(KEYS.START_DATE, d),

  getCurrentDay:      () => storageGet(KEYS.CURRENT_DAY, 1),
  setCurrentDay:      (d) => storageSet(KEYS.CURRENT_DAY, d),

  // Scores
  getTotalScore:      () => storageGet(KEYS.TOTAL_SCORE, 0),
  setTotalScore:      (s) => storageSet(KEYS.TOTAL_SCORE, s),
  addToScore:         (pts) => {
    const current = storageGet(KEYS.TOTAL_SCORE, 0);
    storageSet(KEYS.TOTAL_SCORE, current + pts);
    return current + pts;
  },

  // Streaks
  getStreak:          () => storageGet(KEYS.STREAK, 0),
  setStreak:          (s) => storageSet(KEYS.STREAK, s),
  getBestStreak:      () => storageGet(KEYS.BEST_STREAK, 0),
  setBestStreak:      (s) => storageSet(KEYS.BEST_STREAK, s),

  // Day tracking
  getCompletedDays:   () => storageGet(KEYS.COMPLETED_DAYS, []),
  addCompletedDay:    (day) => {
    const days = storageGet(KEYS.COMPLETED_DAYS, []);
    if (!days.includes(day)) {
      days.push(day);
      storageSet(KEYS.COMPLETED_DAYS, days);
    }
  },

  getMissedDays:      () => storageGet(KEYS.MISSED_DAYS, []),
  addMissedDay:       (day) => {
    const days = storageGet(KEYS.MISSED_DAYS, []);
    if (!days.includes(day)) {
      days.push(day);
      storageSet(KEYS.MISSED_DAYS, days);
    }
  },

  // Tasks
  getCompletedTasks:  () => storageGet(KEYS.COMPLETED_TASKS, {}),
  setDayTasks:        (day, taskIds) => {
    const all = storageGet(KEYS.COMPLETED_TASKS, {});
    all[`d${day}`] = taskIds;
    storageSet(KEYS.COMPLETED_TASKS, all);
  },
  getDayTasks:        (day) => {
    const all = storageGet(KEYS.COMPLETED_TASKS, {});
    return all[`d${day}`] || [];
  },

  // Reports
  getDailyReports:    () => storageGet(KEYS.DAILY_REPORTS, {}),
  setDayReport:       (day, report) => {
    const all = storageGet(KEYS.DAILY_REPORTS, {});
    all[`d${day}`] = { ...report, submittedAt: new Date().toISOString() };
    storageSet(KEYS.DAILY_REPORTS, all);
  },
  getDayReport:       (day) => {
    const all = storageGet(KEYS.DAILY_REPORTS, {});
    return all[`d${day}`] || null;
  },

  // Score history
  getScoreHistory:    () => storageGet(KEYS.SCORE_HISTORY, []),
  addScoreEntry:      (entry) => {
    const history = storageGet(KEYS.SCORE_HISTORY, []);
    history.push(entry);
    storageSet(KEYS.SCORE_HISTORY, history);
  },

  // Badges
  getBadges:          () => storageGet(KEYS.BADGES, []),
  addBadge:           (badgeId) => {
    const badges = storageGet(KEYS.BADGES, []);
    if (!badges.includes(badgeId)) {
      badges.push(badgeId);
      storageSet(KEYS.BADGES, badges);
    }
    return badges;
  },
  hasBadge:           (badgeId) => storageGet(KEYS.BADGES, []).includes(badgeId),

  // GitHub
  getGithubToken:     () => storageGet(KEYS.GITHUB_TOKEN, ''),
  setGithubToken:     (t) => storageSet(KEYS.GITHUB_TOKEN, t),
  getGithubUsername:  () => storageGet(KEYS.GITHUB_USERNAME, ''),
  setGithubUsername:  (u) => storageSet(KEYS.GITHUB_USERNAME, u),

  // Notifications
  getNotifEnabled:    () => storageGet(KEYS.NOTIF_ENABLED, false),
  setNotifEnabled:    (b) => storageSet(KEYS.NOTIF_ENABLED, b),
  getNotifTime:       () => storageGet(KEYS.NOTIF_TIME, { hour: 19, minute: 0 }),
  setNotifTime:       (t) => storageSet(KEYS.NOTIF_TIME, t),

  // Habits
  getHabits:          () => storageGet(KEYS.HABITS, {}),
  setDayHabits:       (day, habits) => {
    const all = storageGet(KEYS.HABITS, {});
    all[`d${day}`] = habits;
    storageSet(KEYS.HABITS, all);
  },
  getDayHabits:       (day) => {
    const all = storageGet(KEYS.HABITS, {});
    return all[`d${day}`] || {};
  },

  // Recovery
  getRecoveryFlag:    () => storageGet(KEYS.RECOVERY_FLAG, false),
  setRecoveryFlag:    (b) => storageSet(KEYS.RECOVERY_FLAG, b),

  // Last active
  getLastActiveDate:  () => storageGet(KEYS.LAST_ACTIVE_DATE, null),
  setLastActiveDate:  (d) => storageSet(KEYS.LAST_ACTIVE_DATE, d),

  // Settings
  getSettings:        () => storageGet(KEYS.SETTINGS, {}),
  setSetting:         (key, value) => {
    const s = storageGet(KEYS.SETTINGS, {});
    s[key] = value;
    storageSet(KEYS.SETTINGS, s);
  },

  // Full export
  exportAll: () => {
    const data = {};
    Object.entries(KEYS).forEach(([, k]) => {
      const val = localStorage.getItem(PREFIX + k);
      if (val !== null) data[PREFIX + k] = JSON.parse(val);
    });
    return data;
  },

  // Full import
  importAll: (data) => {
    Object.entries(data).forEach(([key, value]) => {
      localStorage.setItem(key, JSON.stringify(value));
    });
  },
};

export default storage;
