import styles from './Card.module.css'

export function Card({ title, children, className = '', accent }) {
  return (
    <div className={`${styles.card} ${className}`} style={accent ? { '--card-accent': accent } : {}}>
      {title && (
        <div className={styles.title}>
          <span>{title}</span>
        </div>
      )}
      {children}
    </div>
  )
}
