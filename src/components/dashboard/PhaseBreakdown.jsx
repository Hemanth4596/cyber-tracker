import phasesData from '../../data/phases.json'
import styles from './PhaseBreakdown.module.css'

export function PhaseBreakdown({ completedDays }) {
  const completed = new Set(completedDays)

  return (
    <div className={styles.list}>
      {phasesData.map(phase => {
        const total = phase.totalDays
        const done  = Array.from({ length: total }, (_, i) => phase.startDay + i)
          .filter(d => completed.has(d)).length
        const pct   = Math.round((done / total) * 100)
        const isActive  = completedDays.length >= phase.startDay - 1 &&
                          completedDays.length <  phase.endDay
        const isComplete = done === total

        return (
          <div key={phase.id} className={styles.row}>
            <div className={styles.dot} style={{ background: phase.color }} />
            <div className={styles.info}>
              <div className={styles.name}>{phase.code} {phase.title}</div>
              <div className={styles.barWrap}>
                <div
                  className={styles.bar}
                  style={{ width: `${pct}%`, background: phase.color }}
                />
              </div>
            </div>
            <div
              className={styles.pct}
              style={{ color: isComplete ? phase.color : isActive ? phase.color : 'var(--muted2)' }}
            >
              {pct}%
            </div>
            {isActive && <span className={styles.activePill}>ACTIVE</span>}
          </div>
        )
      })}
    </div>
  )
}
