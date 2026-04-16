/**
 * github.js
 * GitHub API integration for contribution streak syncing.
 */

/**
 * Fetch contribution data for a GitHub user.
 * Requires a personal access token with read:user scope.
 * @param {string} username
 * @param {string} token
 * @returns {Promise<object>} contribution calendar data
 */
export async function fetchGitHubContributions(username, token) {
  if (!username || !token) return null;

  const query = `{
    user(login: "${username}") {
      name
      contributionsCollection {
        totalCommitContributions
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
              color
            }
          }
        }
      }
    }
  }`;

  try {
    const res = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
    const data = await res.json();
    return data?.data?.user?.contributionsCollection?.contributionCalendar || null;
  } catch (e) {
    console.error('GitHub API fetch failed:', e);
    return null;
  }
}

/**
 * Check if a GitHub user made a commit on a specific date.
 * @param {object} calendar - GitHub contribution calendar data
 * @param {string} dateStr - ISO date string e.g. "2026-04-14"
 * @returns {boolean}
 */
export function hasCommitOnDate(calendar, dateStr) {
  if (!calendar?.weeks) return false;
  for (const week of calendar.weeks) {
    for (const day of week.contributionDays) {
      if (day.date === dateStr && day.contributionCount > 0) return true;
    }
  }
  return false;
}

/**
 * Calculate GitHub contribution streak ending on today.
 * @param {object} calendar
 * @returns {number} streak length
 */
export function calcGitHubStreak(calendar) {
  if (!calendar?.weeks) return 0;
  const days = calendar.weeks.flatMap(w => w.contributionDays)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  let streak = 0;
  let expectedDate = new Date();
  expectedDate.setHours(0, 0, 0, 0);

  for (const day of days) {
    const d = new Date(day.date);
    d.setHours(0, 0, 0, 0);
    if (d.getTime() === expectedDate.getTime()) {
      if (day.contributionCount > 0) {
        streak++;
        expectedDate.setDate(expectedDate.getDate() - 1);
      } else {
        break;
      }
    }
  }
  return streak;
}

/**
 * Flatten contribution calendar into a map of date → count.
 * @param {object} calendar
 * @returns {object} { "2026-04-14": 3, ... }
 */
export function flattenContributions(calendar) {
  if (!calendar?.weeks) return {};
  const map = {};
  for (const week of calendar.weeks) {
    for (const day of week.contributionDays) {
      map[day.date] = day.contributionCount;
    }
  }
  return map;
}
