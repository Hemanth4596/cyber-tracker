import styles from './Button.module.css'

export function Button({ children, variant = 'ghost', onClick, disabled = false, type = 'button', small = false }) {
  return (
    <button
      type={type}
      className={`${styles.btn} ${styles[variant]} ${small ? styles.small : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
