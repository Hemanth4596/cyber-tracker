import { useEffect, useState } from 'react'
import styles from './Toast.module.css'

export function ToastContainer({ toasts, onDismiss }) {
  return (
    <div className={styles.container}>
      {toasts.map(t => (
        <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  )
}

function ToastItem({ toast, onDismiss }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10)
    return () => clearTimeout(t)
  }, [])

  const borderColor = {
    success: 'var(--green)',
    error:   'var(--red)',
    warning: 'var(--orange)',
    badge:   'var(--accent2)',
    default: 'var(--accent)',
  }[toast.type] || 'var(--accent)'

  return (
    <div
      className={`${styles.toast} ${visible ? styles.visible : ''}`}
      style={{ borderLeftColor: borderColor }}
      onClick={() => onDismiss(toast.id)}
    >
      <span className={styles.icon}>{toast.icon}</span>
      <div className={styles.body}>
        <div className={styles.title}>{toast.title}</div>
        {toast.body && <div className={styles.text}>{toast.body}</div>}
      </div>
    </div>
  )
}
