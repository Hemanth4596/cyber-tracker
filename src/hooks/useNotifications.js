/**
 * useNotifications.js
 * Browser Web Notifications API for daily study reminders.
 */

import { useEffect, useCallback } from 'react'
import storage from '../utils/storage.js'

export function useNotifications() {
  const isSupported = typeof window !== 'undefined' && 'Notification' in window

  const requestPermission = useCallback(async () => {
    if (!isSupported) return false
    const perm = await Notification.requestPermission()
    storage.setNotifEnabled(perm === 'granted')
    return perm === 'granted'
  }, [isSupported])

  const scheduleReminder = useCallback((hour, minute, currentDay, streak) => {
    if (!isSupported || Notification.permission !== 'granted') return

    const now = new Date()
    const target = new Date()
    target.setHours(hour, minute, 0, 0)
    if (target <= now) target.setDate(target.getDate() + 1)

    const delay = target - now

    const timer = setTimeout(() => {
      new Notification('CyberTrack — Study Time 🔥', {
        body: `Day ${currentDay}: your tasks are waiting. Streak: ${streak} days. Don't break it.`,
        icon: '/cyber-tracker/icons/icon-192.png',
        badge: '/cyber-tracker/icons/icon-192.png',
        tag: 'cybertrack-daily',
        renotify: true,
      })
    }, delay)

    return () => clearTimeout(timer)
  }, [isSupported])

  useEffect(() => {
    const enabled = storage.getNotifEnabled()
    if (!enabled) return
    const { hour, minute } = storage.getNotifTime()
    const day = storage.getCurrentDay()
    const streak = storage.getStreak()
    const cleanup = scheduleReminder(hour, minute, day, streak)
    return cleanup
  }, [scheduleReminder])

  return { isSupported, requestPermission }
}
