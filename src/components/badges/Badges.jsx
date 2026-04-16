import { Card }       from '../shared/Card.jsx'
import { getRank, getRankProgress, SCORE_RULES } from '../../utils/scoreEngine.js'
import badgesData      from '../../data/badges.json'
import storage         from '../../utils/storage.js'
import styles from './Badges.module.css'

const RARITY_ORDER = ['legendary', 'epic', 'rare', 'common']
const RARITY_COLOR = {
  legendary: '#fbbf24',
  epic:      '#c084fc',
  rare:      '#60a5fa',
  common:    'var(--muted)',
}

export function Badges({ tracker }) {
  const { totalScore } = tracker
  const earned = new Set(storage.getBadges())
  const rank   = getRank(totalScore)
  const rankPct = getRankProgress(totalScore)

  const sorted = [...badgesData].sort((a, b) => {
    const aE = earned.has(a.id) ? 0 : 1
    const bE = earned.has(b.id) ? 0 : 1
    if (aE !== bE) return aE - bE
    return RARITY_ORDER.indexOf(a.rarity) - RARITY_ORDER.indexOf(b.rarity)
  })

  const earnedCount = sorted.filter(b => earned.has(b.id)).length

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Badges & <span>Ranks</span></h1>
        <p className={styles.sub}>{earnedCount} earned · {badgesData.length - earnedCount} locked</p>
      </div>

      {/* Current rank */}
      <div className={styles.rankHero} style={{ borderColor: 'rgba(0,229,255,0.2)' }}>
        <div className={styles.rankLeft}>
          <div className={styles.rankName}>{rank.label}</div>
          <div className={styles.rankScore}>{totalScore.toLocaleString()} XP</div>
          {rank.max && (
            <div className={styles.rankRange}>
              {rank.min.toLocaleString()} — {rank.max.toLocaleString()} XP
            </div>
          )}
        </div>
        <div className={styles.rankRight}>
          <div className={styles.rankBarWrap}>
            <div className={styles.rankBar} style={{ width: `${rankPct}%` }} />
          </div>
          <div className={styles.rankPct}>{rankPct}% to next rank</div>
        </div>
      </div>

      {/* Rank ladder */}
      <Card title="Rank Progression" className={styles.rankCard}>
        <div className={styles.rankList}>
          {SCORE_RULES.RANKS.map(r => {
            const isCurrentRank = r.id === rank.id
            const isPast   = totalScore >= (r.max || Infinity)
            const pct      = r.max
              ? Math.min(100, Math.max(0, Math.round(((totalScore - r.min) / (r.max - r.min)) * 100)))
              : 100
            const col = ['initiate','analyst','operator','specialist','expert','elite','purple-lead']
              .indexOf(r.id) >= 0
              ? ['var(--muted)','var(--phase1)','var(--phase3)','var(--phase4)','var(--phase5)','var(--phase6)','var(--accent)']
                [['initiate','analyst','operator','specialist','expert','elite','purple-lead'].indexOf(r.id)]
              : 'var(--muted)'

            return (
              <div
                key={r.id}
                className={`${styles.rankRow} ${isCurrentRank ? styles.currentRankRow : ''}`}
                style={isCurrentRank ? { borderColor: col + '44', boxShadow: `0 0 12px ${col}18` } : {}}
              >
                <div className={styles.rankRowDot} style={{ background: totalScore >= r.min ? col : 'var(--surface3)' }} />
                <div className={styles.rankRowInfo}>
                  <div className={styles.rankRowName} style={{ color: isCurrentRank ? col : totalScore >= r.min ? 'var(--text)' : 'var(--muted2)' }}>
                    {r.label}
                    {isCurrentRank && <span className={styles.currentTag}>← CURRENT</span>}
                  </div>
                  <div className={styles.rankRowRange}>{r.min.toLocaleString()} — {r.max ? r.max.toLocaleString() : '∞'} XP</div>
                </div>
                <div className={styles.rankMiniBar}>
                  <div className={styles.rankMiniBarFill} style={{ width: `${pct}%`, background: col }} />
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Badge grid */}
      <Card title={`All Badges (${earnedCount} / ${badgesData.length})`}>
        <div className={styles.badgeGrid}>
          {sorted.map(badge => {
            const isEarned = earned.has(badge.id)
            return (
              <div
                key={badge.id}
                className={`${styles.badge} ${isEarned ? styles.badgeEarned : styles.badgeLocked}`}
                title={badge.description}
              >
                <div
                  className={styles.badgeIcon}
                  style={isEarned ? {
                    background: badge.glow + '22',
                    border: `1px solid ${badge.glow}44`,
                  } : {}}
                >
                  <span>{badge.icon}</span>
                </div>
                <div className={styles.badgeName}>{badge.name}</div>
                <div
                  className={styles.badgeRarity}
                  style={{ color: isEarned ? RARITY_COLOR[badge.rarity] : 'var(--muted2)' }}
                >
                  {badge.rarity}
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
