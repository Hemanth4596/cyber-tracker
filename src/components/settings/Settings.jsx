import { useState } from 'react'
import { Card }   from '../shared/Card.jsx'
import { Button } from '../shared/Button.jsx'
import storage    from '../../utils/storage.js'
import { useNotifications } from '../../hooks/useNotifications.js'
import styles from './Settings.module.css'

export function Settings({ onReset }) {
  const { isSupported, requestPermission } = useNotifications()

  const [notifEnabled, setNotifEnabled] = useState(() => storage.getNotifEnabled())
  const [notifHour,    setNotifHour]    = useState(() => storage.getNotifTime().hour)
  const [notifMin,     setNotifMin]     = useState(() => storage.getNotifTime().minute)
  const [showReset,    setShowReset]    = useState(false)
  const [saved,        setSaved]        = useState(false)

  const handleNotifToggle = async () => {
    if (!notifEnabled) {
      const granted = await requestPermission()
      if (granted) {
        setNotifEnabled(true)
        storage.setNotifEnabled(true)
      }
    } else {
      setNotifEnabled(false)
      storage.setNotifEnabled(false)
    }
  }

  const handleSaveNotif = () => {
    storage.setNotifTime({ hour: notifHour, minute: notifMin })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleReset = () => {
    if (showReset) {
      storage.storageClear?.()
      localStorage.clear()
      window.location.reload()
    } else {
      setShowReset(true)
      setTimeout(() => setShowReset(false), 5000)
    }
  }

  const HOURS = Array.from({ length: 24 }, (_, i) => i)
  const MINS  = [0, 15, 30, 45]

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Settings <span>&</span> Preferences</h1>
        <p className={styles.sub}>Notifications, display, and account controls</p>
      </div>

      {/* Notifications */}
      <Card title="Daily Reminder" className={styles.card}>
        <div className={styles.row}>
          <div className={styles.rowInfo}>
            <div className={styles.rowTitle}>Browser Notifications</div>
            <div className={styles.rowDesc}>Get a daily reminder to study at your chosen time</div>
          </div>
          <div
            className={`${styles.toggle} ${notifEnabled ? styles.toggleOn : ''}`}
            onClick={handleNotifToggle}
          >
            <div className={styles.toggleKnob} />
          </div>
        </div>

        {notifEnabled && (
          <div className={styles.timeRow}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Hour</label>
              <select
                className={styles.select}
                value={notifHour}
                onChange={e => setNotifHour(Number(e.target.value))}
              >
                {HOURS.map(h => (
                  <option key={h} value={h}>
                    {String(h).padStart(2, '0')}:00
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Minute</label>
              <select
                className={styles.select}
                value={notifMin}
                onChange={e => setNotifMin(Number(e.target.value))}
              >
                {MINS.map(m => (
                  <option key={m} value={m}>:{String(m).padStart(2, '0')}</option>
                ))}
              </select>
            </div>
            <div style={{ alignSelf: 'flex-end' }}>
              <Button variant="ghost" onClick={handleSaveNotif} small>
                {saved ? '✓ Saved' : 'Save Time'}
              </Button>
            </div>
          </div>
        )}

        {!isSupported && (
          <div className={styles.notSupported}>
            Browser notifications are not supported in this environment.
          </div>
        )}
      </Card>

      {/* Score rules reference */}
      <Card title="Score Rules" className={styles.card}>
        <div className={styles.scoreTable}>
          {[
            { label: 'Task completed',           pts: '+5',   col: 'var(--green)' },
            { label: 'All tasks done (bonus)',    pts: '+5',   col: 'var(--green)' },
            { label: 'Daily report submitted',    pts: '+3',   col: 'var(--green)' },
            { label: 'Per habit checked',         pts: '+1',   col: 'var(--green)' },
            { label: 'GitHub commit today',       pts: '+2',   col: 'var(--green)' },
            { label: '7-day streak maintained',   pts: '+10',  col: 'var(--accent)' },
            { label: '30-day streak milestone',   pts: '+25',  col: 'var(--accent)' },
            { label: '100-day streak milestone',  pts: '+100', col: 'var(--accent)' },
            { label: 'Sunday multiplier',         pts: '×1.5', col: 'var(--yellow)' },
            { label: 'Recovery day (full tasks)', pts: '+5',   col: 'var(--orange)' },
            { label: 'Missed day penalty',        pts: '−8',   col: 'var(--red)' },
            { label: 'Streak break penalty',      pts: '−5',   col: 'var(--red)' },
          ].map(r => (
            <div key={r.label} className={styles.scoreRow}>
              <span className={styles.scoreLabel}>{r.label}</span>
              <span className={styles.scoreVal} style={{ color: r.col }}>{r.pts}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Danger zone */}
      <Card title="Danger Zone" className={styles.dangerCard}>
        <div className={styles.dangerRow}>
          <div className={styles.rowInfo}>
            <div className={styles.rowTitle} style={{ color: 'var(--red)' }}>Reset All Progress</div>
            <div className={styles.rowDesc}>
              Permanently deletes all tracked data, scores, reports, and badges.
              This cannot be undone. Export a backup first.
            </div>
          </div>
          <Button
            variant={showReset ? 'danger' : 'ghost'}
            onClick={handleReset}
            small
          >
            {showReset ? '⚠ CONFIRM RESET' : 'Reset Data'}
          </Button>
        </div>
      </Card>
    </div>
  )
}
