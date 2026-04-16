/**
 * useTracker.js
 * Core state management hook for CyberTrack.
 * All tracker state is read from localStorage and persisted on every change.
 */

import { useState, useEffect, useCallback } from 'react';
import storage from '../utils/storage.js';
import { calculateDayScore, getStreakMilestoneBonus, SCORE_RULES } from '../utils/scoreEngine.js';
import { getDayNumber, todayISO, isDaySunday } from '../utils/dates.js';
import roadmapData from '../data/roadmap.json';

export function useTracker() {
  const startDate = storage.getStartDate();

  const [currentDay, setCurrentDay]   = useState(() => storage.getCurrentDay());
  const [totalScore, setTotalScore]   = useState(() => storage.getTotalScore());
  const [streak, setStreak]           = useState(() => storage.getStreak());
  const [bestStreak, setBestStreak]   = useState(() => storage.getBestStreak());
  const [completedDays, setCompletedDays] = useState(() => storage.getCompletedDays());
  const [missedDays, setMissedDays]   = useState(() => storage.getMissedDays());
  const [completedTasks, setCompletedTasks] = useState(() => storage.getDayTasks(storage.getCurrentDay()));
  const [dayScore, setDayScore]       = useState(0);
  const [scoreLog, setScoreLog]       = useState([]);
  const [badges, setBadges]           = useState(() => storage.getBadges());
  const [recoveryFlag, setRecoveryFlag] = useState(() => storage.getRecoveryFlag());

  // Sync current day from start date on mount
  useEffect(() => {
    if (startDate) {
      const computed = getDayNumber(startDate);
      if (computed !== currentDay) {
        setCurrentDay(computed);
        storage.setCurrentDay(computed);
        // Load tasks for computed day
        setCompletedTasks(storage.getDayTasks(computed));
      }
    }
  }, [startDate]);

  // Get roadmap data for current day
  const dayData = roadmapData.days[currentDay - 1] || null;

  /**
   * Toggle a task completion.
   * @param {string} taskId
   */
  const toggleTask = useCallback((taskId) => {
    setCompletedTasks(prev => {
      const isCompleting = !prev.includes(taskId);
      const updated = isCompleting
        ? [...prev, taskId]
        : prev.filter(id => id !== taskId);

      storage.setDayTasks(currentDay, updated);

      const pts = isCompleting ? SCORE_RULES.TASK_COMPLETE : -SCORE_RULES.TASK_COMPLETE;
      const newTotal = storage.addToScore(pts);
      setTotalScore(newTotal);
      setDayScore(d => d + pts);

      setScoreLog(log => [{
        pts,
        desc: isCompleting ? 'Task completed' : 'Task unchecked',
        time: new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' }),
      }, ...log]);

      return updated;
    });
  }, [currentDay]);

  /**
   * Complete the day — finalize score, update streak.
   */
  const completeDay = useCallback(() => {
    const today = todayISO();
    const isSunday = isDaySunday(currentDay);
    const tasks = dayData?.tasks || [];
    const report = storage.getDayReport(currentDay);
    const habits = storage.getDayHabits(currentDay);
    const habitsChecked = Object.values(habits).filter(Boolean).length;
    const isRecovery = recoveryFlag;

    const pts = calculateDayScore({
      tasksCompleted: completedTasks.length,
      tasksTotal: tasks.length,
      reportSubmitted: !!report,
      habitsChecked,
      isSunday,
      githubCommit: false,
      isRecovery,
    });

    // Streak increment
    const newStreak = streak + 1;
    const milestoneBonus = getStreakMilestoneBonus(newStreak);
    const finalPts = pts + milestoneBonus;

    const newTotal = storage.addToScore(finalPts - dayScore); // adjust for already-added task pts
    setTotalScore(newTotal);

    storage.setStreak(newStreak);
    setStreak(newStreak);

    if (newStreak > bestStreak) {
      storage.setBestStreak(newStreak);
      setBestStreak(newStreak);
    }

    storage.addCompletedDay(currentDay);
    setCompletedDays(prev => [...prev, currentDay]);
    storage.setLastActiveDate(today);

    if (isRecovery) {
      storage.setRecoveryFlag(false);
      setRecoveryFlag(false);
    }

    storage.addScoreEntry({ day: currentDay, pts: finalPts, cumulative: newTotal, date: today });
  }, [currentDay, completedTasks, streak, bestStreak, dayScore, dayData, recoveryFlag]);

  /**
   * Mark the day as missed.
   */
  const missDay = useCallback(() => {
    const penalty = SCORE_RULES.MISSED_DAY + (streak > 0 ? SCORE_RULES.STREAK_BREAK : 0);
    const newTotal = storage.addToScore(penalty);
    setTotalScore(newTotal);

    storage.setStreak(0);
    setStreak(0);

    storage.addMissedDay(currentDay);
    setMissedDays(prev => [...prev, currentDay]);

    storage.setRecoveryFlag(true);
    setRecoveryFlag(true);

    storage.addScoreEntry({ day: currentDay, pts: penalty, cumulative: newTotal, date: todayISO() });

    setScoreLog(log => [{
      pts: penalty,
      desc: 'Day missed — streak reset',
      time: new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' }),
    }, ...log]);
  }, [currentDay, streak]);

  const isDayCompleted = (day) => completedDays.includes(day);
  const isDayMissed    = (day) => missedDays.includes(day);

  return {
    currentDay,
    totalScore,
    streak,
    bestStreak,
    completedDays,
    missedDays,
    completedTasks,
    dayScore,
    scoreLog,
    badges,
    recoveryFlag,
    dayData,
    toggleTask,
    completeDay,
    missDay,
    isDayCompleted,
    isDayMissed,
  };
}
