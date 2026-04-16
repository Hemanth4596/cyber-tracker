import { useState } from 'react'
import { Button } from '../shared/Button.jsx'
import { Modal, ModalActions } from '../shared/Modal.jsx'
import { SCORE_RULES } from '../../utils/scoreEngine.js'
import styles from './Topbar.module.css'

export function Topbar({ currentDay, dayData, streak, totalScore, dayScore, completedTasks, onCompleteDay, onMissDay }) {
  const [showComplete, setShowComplete] = useState(false)
  const [showMiss,     setShowMiss]     = useState(false)

  const tasks      = dayData?.tasks || []
  const tasksDone  = completedTasks.length
  const tasksTotal = tasks.length
  const isSunday   = dayData?.isSunday
  const phaseName  = dayData?.phaseLabel || ''

  const handleComplete = () => {
    setShowComplete(false)
    onCompleteDay()
  }

  const handleMiss = () => {
    setShowMiss(false)
    onMissDay()
  }

  return (
    <>
      <header className={styles.topbar}>
        <div className={styles.left}>
          <div className={styles.dayBadge}>
            DAY {currentDay}
            <span className={styles.dayOf}> / 800</span>
          </div>
          <div className={styles.meta}>
            <span className={styles.phase}>{phaseName}</span>
            {isSunday && <span className={styles.sunday}>☀ Sunday +1.5×</span>}
          </div>
        </div>

        <div className={styles.right}>
          <div className={styles.todayScore}>
            <span className={dayScore >= 0 ? styles.pos : styles.neg}>
              {dayScore >= 0 ? '+' : ''}{dayScore}
            </span>
            <span className={styles.scoreLab}>pts today</span>
          </div>
          <div className={styles.taskPill}>{tasksDone}/{tasksTotal} tasks</div>
          <Button variant="ghost" small onClick={() => setShowMiss(true)}>Miss Day</Button>
          <Button variant="accent" small onClick={() => setShowComplete(true)}>Complete Day ✓</Button>
        </div>
      </header>

      {/* Complete day modal */}
      <Modal open={showComplete} onClose={() => setShowComplete(false)} title="Complete Day?" subtitle={`Finalise Day ${currentDay} and update your streak.`}>
        <div className={styles.modalInfo}>
          <Row label="Tasks completed"    value={`${tasksDone} / ${tasksTotal}`} color="var(--green)" />
          <Row label="Day score"          value={`+${dayScore} pts`}              color="var(--green)" />
          <Row label="Streak"             value={`${streak} → ${streak + 1} days 🔥`} color="var(--orange)" />
          <Row label="Running total"      value={`${totalScore.toLocaleString()} pts`} color="var(--accent)" />
          {isSunday && <Row label="Sunday bonus"  value="×1.5 multiplier applied"      color="var(--yellow)" />}
        </div>
        <ModalActions>
          <Button variant="ghost" onClick={() => setShowComplete(false)}>Cancel</Button>
          <Button variant="green" onClick={handleComplete}>Confirm Complete</Button>
        </ModalActions>
      </Modal>

      {/* Miss day modal */}
      <Modal open={showMiss} onClose={() => setShowMiss(false)} title="Mark as Missed?" danger>
        <div className={styles.modalDanger}>
          <Row label="Score penalty"  value={`${SCORE_RULES.MISSED_DAY} pts`}                                color="var(--red)" />
          <Row label="Streak penalty" value={streak > 0 ? `${SCORE_RULES.STREAK_BREAK} pts` : 'n/a'}        color="var(--red)" />
          <Row label="Streak reset"   value={streak > 0 ? `${streak} → 0 days` : 'Already at 0'}            color="var(--red)" />
          <div className={styles.recoveryNote}>Recovery: complete 100% of tasks tomorrow for +{SCORE_RULES.RECOVERY_BONUS} bonus pts.</div>
        </div>
        <ModalActions>
          <Button variant="ghost"  onClick={() => setShowMiss(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleMiss}>Mark as Missed</Button>
        </ModalActions>
      </Modal>
    </>
  )
}

function Row({ label, value, color }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border)', fontSize: 12 }}>
      <span style={{ color: 'var(--muted)' }}>{label}</span>
      <span style={{ color, fontWeight: 700 }}>{value}</span>
    </div>
  )
}
