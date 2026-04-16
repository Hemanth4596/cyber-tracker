import phasesData from '../../data/phases.json'
import { Card }   from '../shared/Card.jsx'
import styles from './Phases.module.css'

export function Phases({ tracker }) {
  const { currentDay, completedDays } = tracker
  const completedSet = new Set(completedDays)

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Phases & <span>Timeline</span></h1>
        <p className={styles.sub}>800-day breakdown across 6 phases — Day {currentDay} active</p>
      </div>

      <Card title="Full Roadmap" className={styles.timelineCard}>
        <div className={styles.timeline}>
          {phasesData.map((phase, idx) => {
            const total       = phase.totalDays
            const done        = Array.from({ length: total }, (_, i) => phase.startDay + i)
              .filter(d => completedSet.has(d)).length
            const pct         = Math.round((done / total) * 100)
            const isComplete  = done === total
            const isActive    = currentDay >= phase.startDay && currentDay <= phase.endDay
            const isLocked    = currentDay < phase.startDay

            return (
              <div key={phase.id} className={styles.phaseRow}>
                {/* Timeline spine */}
                <div className={styles.spineWrap}>
                  <div
                    className={styles.spineDot}
                    style={{
                      background:   isLocked ? 'var(--surface3)' : phase.color,
                      borderColor:  isLocked ? 'var(--border2)' : phase.color,
                      boxShadow:    isActive ? `0 0 12px ${phase.color}66` : 'none',
                    }}
                  >
                    {isComplete && <span className={styles.checkMark}>✓</span>}
                    {!isComplete && <span className={styles.phaseNum}>{phase.id}</span>}
                  </div>
                  {idx < phasesData.length - 1 && (
                    <div
                      className={styles.spineLine}
                      style={{ background: done > 0 ? phase.color + '44' : 'var(--border)' }}
                    />
                  )}
                </div>

                {/* Content */}
                <div className={`${styles.phaseContent} ${isLocked ? styles.locked : ''}`}>
                  <div className={styles.phaseHeader}>
                    <div>
                      <div className={styles.phaseName} style={{ color: isLocked ? 'var(--muted)' : phase.color }}>
                        {phase.code} — {phase.title}
                      </div>
                      <div className={styles.phaseRange}>
                        Days {phase.startDay}–{phase.endDay} · {phase.totalDays} days · {phase.totalHours}h
                      </div>
                    </div>
                    <div className={styles.phasePct} style={{ color: isLocked ? 'var(--muted2)' : phase.color }}>
                      {pct}%
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className={styles.phaseBarWrap}>
                    <div
                      className={styles.phaseBar}
                      style={{ width: `${pct}%`, background: phase.color }}
                    />
                  </div>

                  {/* Status */}
                  <div className={styles.phaseStatus}>
                    {isComplete && <span className={styles.statusDone}>✓ COMPLETE</span>}
                    {isActive   && <span className={styles.statusActive} style={{ color: phase.color }}>● IN PROGRESS — Day {currentDay}</span>}
                    {isLocked   && <span className={styles.statusLocked}>◉ LOCKED — Starts Day {phase.startDay}</span>}
                  </div>

                  {/* Topic pills */}
                  <div className={styles.topicList}>
                    {phase.topics.slice(0, 6).map((t, i) => (
                      <span key={i} className={styles.topicPill} style={{ borderColor: phase.color + '33', color: isLocked ? 'var(--muted2)' : 'var(--text3)' }}>
                        {t}
                      </span>
                    ))}
                    {phase.topics.length > 6 && (
                      <span className={styles.topicMore}>+{phase.topics.length - 6} more</span>
                    )}
                  </div>

                  {/* Certs */}
                  {phase.certifications.length > 0 && (
                    <div className={styles.certRow}>
                      <span className={styles.certLabel}>Certs:</span>
                      {phase.certifications.map(c => (
                        <span
                          key={c.name}
                          className={styles.certBadge}
                          style={{ color: c.color, borderColor: c.color + '44', background: c.color + '11' }}
                        >
                          {c.verdict} · {c.name}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Milestone */}
                  <div className={styles.phaseMilestone}>
                    <span className={styles.milestoneLabel}>Milestone:</span> {phase.milestone}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
