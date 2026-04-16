/**
 * dates.js
 * Date utility functions for CyberTrack.
 */

/**
 * Calculate the current day number (1–800) based on start date.
 * @param {string} startDateStr - ISO date string e.g. "2026-04-14"
 * @returns {number} day number, clamped to 1–800
 */
export function getDayNumber(startDateStr) {
  if (!startDateStr) return 1;
  const start = new Date(startDateStr);
  start.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.floor((today - start) / (1000 * 60 * 60 * 24));
  return Math.max(1, Math.min(800, diff + 1));
}

/**
 * Get the ISO date string for a given day number.
 * @param {string} startDateStr
 * @param {number} dayNum
 * @returns {string} ISO date string
 */
export function getDateForDay(startDateStr, dayNum) {
  const start = new Date(startDateStr);
  start.setDate(start.getDate() + dayNum - 1);
  return start.toISOString().split('T')[0];
}

/**
 * Format a date string to a readable label.
 * @param {string} dateStr
 * @returns {string}
 */
export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
}

/**
 * Format date short.
 * @param {string} dateStr
 * @returns {string}
 */
export function formatDateShort(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric',
  });
}

/**
 * Is a day number a Sunday (6h study day)?
 * Day 1 = whatever start date was. Sunday = index % 7 === 6.
 * @param {number} dayNum
 * @returns {boolean}
 */
export function isDaySunday(dayNum) {
  return (dayNum - 1) % 7 === 6;
}

/**
 * Get the estimated completion date.
 * @param {string} startDateStr
 * @returns {string} formatted date
 */
export function getEstimatedCompletion(startDateStr) {
  const start = new Date(startDateStr);
  start.setDate(start.getDate() + 799); // 800 days total
  return start.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
}

/**
 * Get today's date as ISO string.
 * @returns {string}
 */
export function todayISO() {
  return new Date().toISOString().split('T')[0];
}

/**
 * Get days in a week block for the weekly calendar display.
 * Returns the Mon–Sun block containing today.
 * @param {string} startDateStr
 * @param {number} currentDay
 * @returns {Array} array of { dayNum, date, label, isToday }
 */
export function getCurrentWeekDays(startDateStr, currentDay) {
  const todayDay = currentDay;
  // Find Monday of the current week (7-day block)
  const blockStart = Math.max(1, todayDay - ((todayDay - 1) % 7));
  const result = [];
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  for (let i = 0; i < 7; i++) {
    const d = blockStart + i;
    if (d > 800) break;
    result.push({
      dayNum: d,
      date: getDateForDay(startDateStr, d),
      label: dayNames[i],
      isToday: d === todayDay,
      isSunday: i === 6,
    });
  }
  return result;
}
