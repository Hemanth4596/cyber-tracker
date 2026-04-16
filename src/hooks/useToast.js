/**
 * useToast.js
 * Manages toast notification queue state.
 */

import { useState, useCallback, useRef } from 'react'

let toastId = 0

export function useToast() {
  const [toasts, setToasts] = useState([])
  const timers = useRef({})

  const showToast = useCallback(({ icon = '💡', title, body, duration = 3500, type = 'default' }) => {
    const id = ++toastId
    setToasts(prev => [...prev, { id, icon, title, body, type }])

    timers.current[id] = setTimeout(() => {
      dismissToast(id)
    }, duration)

    return id
  }, [])

  const dismissToast = useCallback((id) => {
    clearTimeout(timers.current[id])
    delete timers.current[id]
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return { toasts, showToast, dismissToast }
}
