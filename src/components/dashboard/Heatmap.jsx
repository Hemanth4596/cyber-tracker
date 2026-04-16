import { useMemo } from 'react'
import { getDateForDay } from '../../utils/dates.js'
import storage from '../../utils/storage.js'
import styles from './Heatmap.module.css'

export function Heatmap({ completedDays, missedDays, currentDay }) {
  const startDate = storage.getStartDate()
  const completedSet = new Set(completedDays)
  const missedSet    = new Set(missedDays)

  const weeks = useMemo(() => {
    const result = []
    let week = []
    for (let day = 1; day <= 800; day++) {
      const isPast      = day < currentDay
      const isToday     = day === currentDay
      const isCompleted = completedSet.has(day)
      const isMissed    = missedSet.has(day)
      const isFuture    = day > currentDay

      let level = 0
      if (isCompleted) level = 4
      else if (isMissed && isPast) level = -1
      else if (isToday) level = 2
      else if (isFuture) level = 0

      const dateStr = startDate ? getDateForDay(startDate, day) : ''

      week.push({ day, level, isToday, isFuture, dateStr })

      if (week.length === 7) {
        result.push(week)
        week = []
      }
    }
    if (week.length) result.push(week)
    return result
  }, [completedDays, missedDays, currentDay, startDate])

  return (
    <div className={styles.outer}>
      <div className={styles.grid}>
        {weeks.map((week, wi) => (
          <div key={wi} className={styles.week}>
            {week.map(cell => (
              <div
                key={cell.day}
                className={`
                  ${styles.cell}
                  ${cell.level === 4  ? styles.done    : ''}
                  ${cell.level === -1 ? styles.missed  : ''}
                  ${cell.isToday      ? styles.today   : ''}
                  ${cell.isFuture     ? styles.future  : ''}
                `}
                title={`Day ${cell.day}${cell.dateStr ? ' · ' + cell.dateStr : ''}`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className={styles.legend}>
        <span>Day 1</span>
        <div className={styles.legendDots}>
          <div className={`${styles.cell} ${styles.future}`} />
          <div className={`${styles.cell} ${styles.done}`} />
          <div className={`${styles.cell} ${styles.missed}`} />
          <div className={`${styles.cell} ${styles.today}`} />
        </div>
        <span>Future / Done / Missed / Today</span>
        <span style={{ marginLeft: 'auto' }}>Day 800</span>
      </div>
    </div>
  )
}
