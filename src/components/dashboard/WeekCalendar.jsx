import { getCurrentWeekDays } from '../../utils/dates.js'
import storage from '../../utils/storage.js'
import styles from './WeekCalendar.module.css'

export function WeekCalendar({ currentDay, completedDays, missedDays }) {
  const startDate  = storage.getStartDate()
  const days       = getCurrentWeekDays(startDate || new Date().toISOString().split('T')[0], currentDay)
  const completedSet = new Set(completedDays)
  const missedSet    = new Set(missedDays)

  const totalPts  = days.reduce((sum, d) => {
    if (completedSet.has(d.dayNum)) return sum + 20
    if (missedSet.has(d.dayNum))    return sum - 8
    return sum
  }, 0)

  const doneCount = days.filter(d => completedSet.has(d.dayNum)).length

  return (
    <div>
      <div className={styles.week}>
        {days.map(d => {
          const done   = completedSet.has(d.dayNum)
          const missed = missedSet.has(d.dayNum) && d.dayNum < currentDay
          const today  = d.isToday
          const future = d.dayNum > currentDay

          return (
            <div key={d.dayNum} className={styles.dayCol}>
              <div className={styles.dayName}>{d.label}</div>
              <div
                className={`
                  ${styles.dayNum}
                  ${done   ? styles.done   : ''}
                  ${missed ? styles.missed : ''}
                  ${today  ? styles.today  : ''}
                  ${future ? styles.future : ''}
                `}
              >
                {d.dayNum}
                {done && <span className={styles.check}>✓</span>}
              </div>
              {d.isSunday && <div className={styles.sunBadge}>6h</div>}
            </div>
          )
        })}
      </div>
      <div className={styles.summary}>
        <span>
          Week score:&nbsp;
          <span style={{ color: totalPts >= 0 ? 'var(--green)' : 'var(--red)', fontWeight: 700 }}>
            {totalPts >= 0 ? '+' : ''}{totalPts} pts
          </span>
        </span>
        <span>{doneCount}/{days.length} days done</span>
      </div>
    </div>
  )
}
