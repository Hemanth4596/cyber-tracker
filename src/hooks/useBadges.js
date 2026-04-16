/**
 * useBadges.js
 * Hook that watches tracker state and unlocks badges when conditions are met.
 */

import { useEffect, useCallback } from 'react';
import storage from '../utils/storage.js';
import badgeDefinitions from '../data/badges.json';

export function useBadges({ streak, totalScore, currentDay, completedDays, onBadgeUnlock }) {
  const checkBadges = useCallback(() => {
    const earned = storage.getBadges();
    const newBadges = [];

    for (const badge of badgeDefinitions) {
      if (earned.includes(badge.id)) continue;

      let unlocked = false;

      switch (badge.conditionType) {
        case 'day_completed':
          unlocked = completedDays.includes(badge.conditionValue);
          break;
        case 'streak':
          unlocked = streak >= badge.conditionValue;
          break;
        case 'streak_no_miss': {
          const missed = storage.getMissedDays();
          const recent = completedDays.slice(-badge.conditionValue);
          unlocked = recent.length >= badge.conditionValue &&
            !missed.some(d => recent.includes(d));
          break;
        }
        case 'score':
          unlocked = totalScore >= badge.conditionValue;
          break;
        case 'phase_complete': {
          const phases = JSON.parse(localStorage.getItem('ct_phases') || '{}');
          unlocked = !!phases[badge.conditionValue];
          break;
        }
        case 'reports': {
          const reports = storage.getDailyReports();
          unlocked = Object.keys(reports).length >= badge.conditionValue;
          break;
        }
        default:
          break;
      }

      if (unlocked) {
        storage.addBadge(badge.id);
        newBadges.push(badge);
      }
    }

    if (newBadges.length > 0 && onBadgeUnlock) {
      newBadges.forEach(b => onBadgeUnlock(b));
    }
  }, [streak, totalScore, currentDay, completedDays, onBadgeUnlock]);

  useEffect(() => {
    checkBadges();
  }, [checkBadges]);
}
