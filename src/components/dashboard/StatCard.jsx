import styles from './StatCard.module.css'

export function StatCard({ value, label, sub, accentColor = 'var(--accent)' }) {
  return (
    <div className={styles.card} style={{ '--card-color': accentColor }}>
      <div className={styles.topLine} />
      <div className={styles.value}>{value}</div>
      <div className={styles.label}>{label}</div>
      {sub && <div className={styles.sub}>{sub}</div>}
    </div>
  )
}
