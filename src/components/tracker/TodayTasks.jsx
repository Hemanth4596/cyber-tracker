import { Card }    from '../shared/Card.jsx'
import { Button }  from '../shared/Button.jsx'
import styles from './TodayTasks.module.css'

export function TodayTasks({ tracker }) {
  const { currentDay, dayData, completedTasks, dayScore, scoreLog, toggleTask, recoveryFlag } = tracker

  const tasks   = dayData?.tasks    || []
  const topic   = dayData?.topic    || 'Study Session'
  const phase   = dayData?.phaseLabel || ''
  const hours   = dayData?.isSunday  ? '6h (Sunday × 1.5)' : '4h'
  const pColor  = dayData?.phaseColor || 'var(--accent)'
  const done    = completedTasks.length
  const total   = tasks.length
  const allDone = done === total && total > 0
  const pct     = total ? Math.round((done / total) * 100) : 0

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Day <span>{currentDay}</span> — Today</h1>
        <p className={styles.sub}>{phase} · {topic}</p>
      </div>

      {recoveryFlag && (
        <div className={styles.recoveryBanner}>
          <span>⚡</span>
          <div>
            <strong>Recovery Day</strong> — Yesterday was missed. Complete all {total} tasks today for +5 bonus recovery points.
          </div>
        </div>
      )}

      {/* Day header card */}
      <div className={styles.dayCard} style={{ borderLeftColor: pColor }}>
        <div className={styles.dayCardLeft}>
          <div className={styles.dayNum}>
            Day <span style={{ color: pColor }}>{currentDay}</span>
            <span className={styles.dayOf}> / 800</span>
          </div>
          <div className={styles.dayMeta} style={{ color: pColor }}>● {phase}</div>
          <div className={styles.dayTopic}>{topic}</div>
        </div>
        <div className={styles.dayCardRight}>
          <div className={styles.scoreDisplay} style={{ color: dayScore >= 0 ? 'var(--green)' : 'var(--red)' }}>
            {dayScore >= 0 ? '+' : ''}{dayScore}
          </div>
          <div className={styles.scoreLabel}>pts today</div>
          <div className={styles.hoursLabel}>{hours}</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className={styles.progressWrap}>
        <div className={styles.progressBar} style={{ width: `${pct}%`, background: pColor }} />
      </div>
      <div className={styles.progressLabel}>
        <span>{done} of {total} tasks complete</span>
        {allDone && <span className={styles.allDone}>✓ All done!</span>}
      </div>

      {/* Task list */}
      <Card title={`Tasks — ${done} / ${total} complete`} className={styles.taskCard}>
        {tasks.length === 0 && (
          <div className={styles.empty}>No tasks defined for this day yet.</div>
        )}
        {tasks.map((task, i) => {
          const isDone = completedTasks.includes(task.id)
          return (
            <div
              key={task.id}
              className={`${styles.taskItem} ${isDone ? styles.done : ''}`}
              onClick={() => toggleTask(task.id)}
            >
              <div className={styles.checkbox}>
                <svg viewBox="0 0 12 10" fill="none" className={styles.checkSvg}>
                  <path
                    d="M1 5l3.5 3.5L11 1"
                    stroke="#000"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`${styles.checkPath} ${isDone ? styles.checkVisible : ''}`}
                  />
                </svg>
              </div>
              <div className={styles.taskBody}>
                <div className={styles.taskText}>{task.text}</div>
                <div className={styles.taskMeta}>
                  <span className={styles.taskNum}>#{String(i + 1).padStart(2, '0')}</span>
                  <span className={`${styles.tag} ${styles.tagPhase}`} style={{ color: pColor, borderColor: pColor + '33', background: pColor + '11' }}>
                    {phase}
                  </span>
                  <span className={styles.taskPts}>+{task.points} pts</span>
                </div>
              </div>
            </div>
          )
        })}
      </Card>

      {/* Score log */}
      {scoreLog.length > 0 && (
        <Card title="Score Log — Today">
          <div className={styles.logList}>
            {scoreLog.slice(0, 12).map((entry, i) => (
              <div key={i} className={styles.logItem}>
                <span className={`${styles.logPts} ${entry.pts > 0 ? styles.logPos : styles.logNeg}`}>
                  {entry.pts > 0 ? '+' : ''}{entry.pts}
                </span>
                <span className={styles.logDesc}>{entry.desc}</span>
                <span className={styles.logTime}>{entry.time}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
