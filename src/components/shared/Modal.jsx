import { useEffect } from 'react'
import styles from './Modal.module.css'

export function Modal({ open, onClose, title, subtitle, children, danger = false }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    if (open) document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className={styles.overlay} onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className={`${styles.modal} ${danger ? styles.danger : ''}`}>
        <div className={styles.header}>
          <div className={`${styles.title} ${danger ? styles.dangerTitle : ''}`}>{title}</div>
          {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
        </div>
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  )
}

export function ModalActions({ children }) {
  return <div className={styles.actions}>{children}</div>
}
