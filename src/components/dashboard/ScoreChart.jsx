import { useMemo } from 'react'
import styles from './ScoreChart.module.css'

export function ScoreChart({ scoreHistory }) {
  const bars = useMemo(() => {
    const last30 = scoreHistory.slice(-30)
    if (last30.length === 0) {
      // Demo data when no history
      return Array.from({ length: 30 }, (_, i) => ({
        pts: [5, 5, -8, 5, 5, 5, 5, -8, 5, 5,
              5, 5, 5,  5, 5, 5, 5, -8, 5, 5,
              5, 5, 5,  5, 5, 5, 5,  5, 5, 0][i] || 0,
        day: i + 1,
        isDemo: true,
      }))
    }
    return last30
  }, [scoreHistory])

  const maxAbs = Math.max(...bars.map(b => Math.abs(b.pts)), 10)

  return (
    <div className={styles.wrap}>
      <div className={styles.chart}>
        {bars.map((bar, i) => {
          const heightPct = (Math.abs(bar.pts) / maxAbs) * 100
          const color = bar.pts > 0
            ? 'var(--green)'
            : bar.pts < 0
            ? 'var(--red)'
            : 'var(--orange)'

          return (
            <div key={i} className={styles.barCol}>
              <div className={styles.barWrap}>
                <div
                  className={styles.bar}
                  style={{ height: `${Math.max(heightPct, 4)}%`, background: color }}
                  title={`Day ${bar.day || i + 1}: ${bar.pts > 0 ? '+' : ''}${bar.pts} pts`}
                />
              </div>
            </div>
          )
        })}
      </div>
      <div className={styles.legend}>
        <span><span className={styles.dot} style={{ background: 'var(--green)' }} /> Completed</span>
        <span><span className={styles.dot} style={{ background: 'var(--red)' }} /> Missed</span>
        <span><span className={styles.dot} style={{ background: 'var(--orange)' }} /> Partial</span>
      </div>
    </div>
  )
}
