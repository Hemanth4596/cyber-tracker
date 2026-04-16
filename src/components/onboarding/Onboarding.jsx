import { useState } from 'react'
import { Button }   from '../shared/Button.jsx'
import storage      from '../../utils/storage.js'
import styles from './Onboarding.module.css'

export function Onboarding({ onComplete }) {
  const [step,      setStep]      = useState(0)
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0])
  const [name,      setName]      = useState('')

  const handleFinish = () => {
    storage.setStartDate(startDate)
    storage.setCurrentDay(1)
    storage.setTotalScore(0)
    storage.setStreak(0)
    storage.setBestStreak(0)
    storage.setLastActiveDate(new Date().toISOString().split('T')[0])
    if (name) storage.setSetting('name', name)
    onComplete()
  }

  const steps = [
    {
      title:  'Welcome to CyberTrack',
      sub:    '800 days. 4 hours/day. One goal: Purple Team professional.',
      content: (
        <div className={styles.welcomeContent}>
          <div className={styles.welcomeStats}>
            {[
              { val: '800', lab: 'Days' },
              { val: '3,300h', lab: 'Total Hours' },
              { val: '6', lab: 'Phases' },
              { val: '2028', lab: 'Target Year' },
            ].map(s => (
              <div key={s.lab} className={styles.welcomeStat}>
                <div className={styles.welcomeStatVal}>{s.val}</div>
                <div className={styles.welcomeStatLab}>{s.lab}</div>
              </div>
            ))}
          </div>
          <p className={styles.welcomeNote}>
            This tracker holds you accountable daily. No coach, no class — just you,
            the tasks, and the streak counter. Show up every day.
          </p>
        </div>
      ),
    },
    {
      title: 'Set Your Start Date',
      sub:   'This locks Day 1. The tracker will auto-calculate your current day from this date.',
      content: (
        <div className={styles.formContent}>
          <label className={styles.label}>Start Date</label>
          <input
            type="date"
            className={styles.input}
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
          />
          <p className={styles.formNote}>
            If you've already been studying, set this to the actual day you started.
            The tracker will catch up to today automatically.
          </p>
        </div>
      ),
    },
    {
      title: 'Your Name (Optional)',
      sub:   'Used to personalise your dashboard header.',
      content: (
        <div className={styles.formContent}>
          <label className={styles.label}>Your Name</label>
          <input
            type="text"
            className={styles.input}
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Sai"
          />
          <p className={styles.formNote}>
            Stored locally only. Leave blank to skip.
          </p>
        </div>
      ),
    },
    {
      title: 'How It Works',
      sub:   'The scoring system keeps you honest.',
      content: (
        <div className={styles.rulesContent}>
          {[
            { icon: '✅', text: '+5 pts per completed task' },
            { icon: '📝', text: '+3 pts for submitting your daily report' },
            { icon: '💪', text: '+1 pt per habit checked' },
            { icon: '🔥', text: '+10 pts bonus at 7-day streak' },
            { icon: '☀️', text: '×1.5 multiplier on Sundays (6h days)' },
            { icon: '❌', text: '-8 pts for a missed day' },
            { icon: '💔', text: '-5 pts when a streak breaks' },
            { icon: '⚡', text: '+5 recovery bonus next day after a miss' },
          ].map(r => (
            <div key={r.text} className={styles.ruleRow}>
              <span className={styles.ruleIcon}>{r.icon}</span>
              <span className={styles.ruleText}>{r.text}</span>
            </div>
          ))}
        </div>
      ),
    },
  ]

  const current = steps[step]
  const isLast  = step === steps.length - 1

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* Top accent line */}
        <div className={styles.accentLine} />

        {/* Step indicator */}
        <div className={styles.stepDots}>
          {steps.map((_, i) => (
            <div
              key={i}
              className={`${styles.dot} ${i === step ? styles.dotActive : i < step ? styles.dotDone : ''}`}
            />
          ))}
        </div>

        {/* Content */}
        <div className={styles.titleBlock}>
          <h1 className={styles.title}>{current.title}</h1>
          <p className={styles.sub}>{current.sub}</p>
        </div>

        <div className={styles.body}>{current.content}</div>

        {/* Actions */}
        <div className={styles.actions}>
          {step > 0 && (
            <Button variant="ghost" onClick={() => setStep(s => s - 1)}>← Back</Button>
          )}
          <div style={{ flex: 1 }} />
          {isLast
            ? <Button variant="accent" onClick={handleFinish}>Start Tracking →</Button>
            : <Button variant="accent" onClick={() => setStep(s => s + 1)}>Next →</Button>
          }
        </div>
      </div>
    </div>
  )
}
