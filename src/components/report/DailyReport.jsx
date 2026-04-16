import { useState, useEffect } from 'react'
import { Card }   from '../shared/Card.jsx'
import { Button } from '../shared/Button.jsx'
import storage    from '../../utils/storage.js'
import habitsData from '../../data/habits.json'
import { generateDayMarkdown } from '../../utils/export.js'
import { copyToClipboard }     from '../../utils/export.js'
import styles from './DailyReport.module.css'

export function DailyReport({ tracker, onSave }) {
  const { currentDay, dayData, completedTasks, dayScore } = tracker

  const existing = storage.getDayReport(currentDay)
  const savedHabits = storage.getDayHabits(currentDay)

  const [learned,     setLearned]     = useState(existing?.learned     || '')
  const [wasted,      setWasted]      = useState(existing?.wasted      || '')
  const [notes,       setNotes]       = useState(existing?.notes       || '')
  const [tomorrow,    setTomorrow]    = useState(existing?.tomorrow    || '')
  const [frustration, setFrustration] = useState(existing?.frustration || 0)
  const [habits,      setHabits]      = useState(() => {
    const base = {}
    habitsData.forEach(h => { base[h.id] = savedHabits[h.id] || false })
    return base
  })
  const [saved,       setSaved]       = useState(false)

  // Persist habits on change
  useEffect(() => {
    storage.setDayHabits(currentDay, habits)
  }, [habits, currentDay])

  const toggleHabit = (id) => setHabits(prev => ({ ...prev, [id]: !prev[id] }))
  const habitsChecked = Object.values(habits).filter(Boolean).length

  const handleSave = () => {
    storage.setDayReport(currentDay, { learned, wasted, notes, tomorrow, frustration, habits })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    onSave?.()
  }

  const handleExportMD = async () => {
    const report  = { learned, wasted, notes, tomorrow, frustration }
    const md      = generateDayMarkdown(currentDay, dayData, report, completedTasks, habits, dayScore)
    await copyToClipboard(md)
    alert('Markdown copied to clipboard!')
  }

  const frustColors = [
    'var(--green)', 'var(--green)', 'var(--green)',
    'var(--yellow)', 'var(--yellow)', 'var(--yellow)',
    'var(--orange)', 'var(--orange)',
    'var(--red)', 'var(--red)',
  ]

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Daily <span>Report</span></h1>
        <p className={styles.sub}>Day {currentDay} · {dayData?.topic || 'Study Session'} · Auto-saved to localStorage</p>
      </div>

      {/* Report fields */}
      <div className={styles.grid}>
        <ReportField icon="💡" label="What I Learned Today">
          <textarea
            className={styles.textarea}
            value={learned}
            onChange={e => setLearned(e.target.value)}
            placeholder="What was the key technical insight today? Be specific — 'learned about AD attacks' is useless. 'Kerberoasting works because any domain user can request TGS tickets for any SPN' is useful."
            rows={5}
          />
        </ReportField>

        <ReportField icon="⏳" label="What I Wasted Time On">
          <textarea
            className={styles.textarea}
            value={wasted}
            onChange={e => setWasted(e.target.value)}
            placeholder="Be honest. 30 mins debugging a VM issue? Phone distractions? Unfocused browsing? Write it down so you can fix it tomorrow."
            rows={5}
          />
        </ReportField>

        <ReportField icon="📝" label="Notes & Reflections" full>
          <textarea
            className={styles.textarea}
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Anything else — questions that came up, resources to follow up on, connections made to other topics, things that surprised you..."
            rows={4}
          />
        </ReportField>

        <ReportField icon="🎯" label="Tomorrow's Focus">
          <textarea
            className={styles.textarea}
            value={tomorrow}
            onChange={e => setTomorrow(e.target.value)}
            placeholder="What is the ONE most important thing to do tomorrow? Write it now while it's fresh."
            rows={3}
          />
        </ReportField>

        {/* Frustration meter */}
        <ReportField icon="😤" label="Frustration Level">
          <div className={styles.frustWrap}>
            {Array.from({ length: 10 }, (_, i) => {
              const n = i + 1
              const col = frustColors[i]
              const active = frustration === n
              return (
                <button
                  key={n}
                  className={`${styles.frustBtn} ${active ? styles.frustActive : ''}`}
                  style={active ? { background: col + '33', borderColor: col, color: col } : {}}
                  onClick={() => setFrustration(n)}
                >
                  {n}
                </button>
              )
            })}
            {frustration > 0 && (
              <span className={styles.frustLabel} style={{ color: frustColors[frustration - 1] }}>
                {['Smooth', 'Good', 'Solid', 'Okay', 'Meh', 'Rough', 'Hard', 'Brutal', 'Terrible', '🔥 MAX'][frustration - 1]}
              </span>
            )}
          </div>
        </ReportField>
      </div>

      {/* Habits */}
      <Card title={`Habit Tracker — ${habitsChecked} / ${habitsData.length} checked (+${habitsChecked} pts)`} className={styles.habitsCard}>
        <div className={styles.habitsGrid}>
          {habitsData.map(h => {
            const checked = habits[h.id]
            return (
              <div
                key={h.id}
                className={`${styles.habitItem} ${checked ? styles.habitDone : ''}`}
                onClick={() => toggleHabit(h.id)}
              >
                <div className={`${styles.habitCheck} ${checked ? styles.habitCheckDone : ''}`}>
                  {checked && '✓'}
                </div>
                <span className={styles.habitIcon}>{h.icon}</span>
                <span className={styles.habitLabel}>{h.label}</span>
                <span className={styles.habitPts}>+{h.points}</span>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Actions */}
      <div className={styles.actions}>
        <Button variant="accent" onClick={handleSave}>
          {saved ? '✓ Saved!' : 'Save Report'}
        </Button>
        <Button variant="ghost" onClick={handleExportMD}>Export Markdown</Button>
      </div>
    </div>
  )
}

function ReportField({ icon, label, children, full = false }) {
  return (
    <div className={`${styles.field} ${full ? styles.fullWidth : ''}`}>
      <div className={styles.fieldLabel}>
        <span>{icon}</span> {label}
      </div>
      {children}
    </div>
  )
}
