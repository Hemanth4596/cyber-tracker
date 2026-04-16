import { useMemo } from 'react'
import { StatCard }       from './StatCard.jsx'
import { CircleProgress } from './CircleProgress.jsx'
import { PhaseBreakdown } from './PhaseBreakdown.jsx'
import { ScoreChart }     from './ScoreChart.jsx'
import { Heatmap }        from './Heatmap.jsx'
import { WeekCalendar }   from './WeekCalendar.jsx'
import { Card }           from '../shared/Card.jsx'
import storage            from '../../utils/storage.js'
import { getEstimatedCompletion } from '../../utils/dates.js'
import styles from './Dashboard.module.css'

export function Dashboard({ tracker }) {
  const {
    currentDay, totalScore, streak, bestStreak,
    completedDays, missedDays,
  } = tracker

  const startDate   = storage.getStartDate()
  const scoreHistory = storage.getScoreHistory()

  const overallPct  = Math.round((completedDays.length / 800) * 100)
  const completion  = startDate ? getEstimatedCompletion(startDate) : 'Dec 2028'
  const hoursIn     = completedDays.length * 4 + Math.floor(completedDays.length / 7) * 2
  const missedCount = missedDays.length
  const compRate    = completedDays.length > 0
    ? Math.round((completedDays.length / (completedDays.length + missedCount)) * 100)
    : 100

  const badgeCount  = storage.getBadges().length

  // Milestone banner logic
  const milestone = useMemo(() => {
    if (completedDays.includes(800)) return { msg: '🏆 COMPLETE — You did all 800 days. Elite.', show: true }
    if (completedDays.includes(400)) return { msg: '⚡ Day 400 reached — halfway through. Most people quit long before here.', show: true }
    if (completedDays.includes(100)) return { msg: '🏅 100-Day Survivor — You crossed the first major filter. +500 XP.', show: true }
    return { show: false }
  }, [completedDays])

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Progress <span>Overview</span></h1>
        <p className={styles.sub}>Day {currentDay} of 800 · Est. completion: {completion}</p>
      </div>

      {milestone.show && (
        <div className={styles.milestoneBanner}>
          <span className={styles.milestoneIcon}>★</span>
          <div>
            <div className={styles.milestoneTitle}>Milestone Reached</div>
            <div className={styles.milestoneMsg}>{milestone.msg}</div>
          </div>
        </div>
      )}

      {/* Stat grid */}
      <div className={styles.statGrid}>
        <StatCard
          value={`${overallPct}%`}
          label="Overall Progress"
          sub={`${currentDay} of 800 days`}
          accentColor="var(--accent)"
        />
        <StatCard
          value={`🔥 ${streak}`}
          label="Current Streak"
          sub={`Best: ${bestStreak} days`}
          accentColor="var(--orange)"
        />
        <StatCard
          value={`+${totalScore.toLocaleString()}`}
          label="Total Score"
          sub={`${compRate}% completion rate`}
          accentColor="var(--green)"
        />
        <StatCard
          value={`${hoursIn.toLocaleString()}h`}
          label="Hours Invested"
          sub="~4h avg/day"
          accentColor="var(--phase3)"
        />
        <StatCard
          value={badgeCount}
          label="Badges Earned"
          sub="Tap to view all"
          accentColor="var(--phase5)"
        />
        <StatCard
          value={missedCount}
          label="Missed Days"
          sub={missedCount === 0 ? 'Perfect record 🔥' : `${missedCount} day${missedCount !== 1 ? 's' : ''} lost`}
          accentColor={missedCount === 0 ? 'var(--green)' : 'var(--red)'}
        />
      </div>

      {/* Overview grid */}
      <div className={styles.overviewGrid}>
        {/* Circle */}
        <Card title="Journey Progress">
          <div className={styles.circleWrap}>
            <CircleProgress pct={overallPct} label="Complete" />
          </div>
          <div className={styles.circleFooter}>
            {800 - currentDay} days remaining · Est. {completion}
          </div>
        </Card>

        {/* Phase breakdown */}
        <Card title="Phase Breakdown">
          <PhaseBreakdown completedDays={completedDays} />
        </Card>

        {/* Score chart */}
        <Card title="Score Trend — Last 30 Days">
          <ScoreChart scoreHistory={scoreHistory} />
        </Card>

        {/* Week calendar */}
        <Card title="This Week">
          <WeekCalendar
            currentDay={currentDay}
            completedDays={completedDays}
            missedDays={missedDays}
          />
        </Card>
      </div>

      {/* Heatmap */}
      <Card title="800-Day Activity Map" className={styles.heatmapCard}>
        <Heatmap
          completedDays={completedDays}
          missedDays={missedDays}
          currentDay={currentDay}
        />
      </Card>
    </div>
  )
}
