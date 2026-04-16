import styles from './CircleProgress.module.css'

const RADIUS  = 60
const CIRC    = 2 * Math.PI * RADIUS   // ≈ 376.99

export function CircleProgress({ pct = 0, label = 'Complete', size = 150 }) {
  const offset = CIRC - (pct / 100) * CIRC

  return (
    <div className={styles.wrap} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 150 150" className={styles.svg}>
        <defs>
          <linearGradient id="cpGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="var(--accent)" />
            <stop offset="100%" stopColor="var(--accent2)" />
          </linearGradient>
        </defs>
        {/* Track */}
        <circle
          className={styles.track}
          cx="75" cy="75" r={RADIUS}
          fill="none"
          stroke="var(--surface3)"
          strokeWidth="8"
        />
        {/* Fill */}
        <circle
          className={styles.fill}
          cx="75" cy="75" r={RADIUS}
          fill="none"
          stroke="url(#cpGrad)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={CIRC}
          strokeDashoffset={offset}
          transform="rotate(-90 75 75)"
        />
      </svg>

      <div className={styles.inner}>
        <div className={styles.pct}>{Math.round(pct)}%</div>
        <div className={styles.label}>{label}</div>
      </div>
    </div>
  )
}
