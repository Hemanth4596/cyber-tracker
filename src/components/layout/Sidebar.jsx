import { NavLink } from 'react-router-dom'
import { getRank, ptsToNextRank } from '../../utils/scoreEngine.js'
import styles from './Sidebar.module.css'

const NAV = [
  { to: '/',        label: 'Dashboard',        icon: '◈' },
  { to: '/today',   label: "Today's Tasks",     icon: '⚔' },
  { to: '/report',  label: 'Daily Report',      icon: '📝' },
  { to: '/phases',  label: 'Phases & Timeline', icon: '◎' },
  { to: '/badges',  label: 'Badges & Ranks',    icon: '★' },
]

const TOOLS = [
  { to: '/github',  label: 'GitHub Sync',       icon: '⬡' },
  { to: '/export',  label: 'Export & Reports',  icon: '↗' },
  { to: '/settings',label: 'Settings',          icon: '⚙' },
]

export function Sidebar({ totalScore, streak, bestStreak }) {
  const rank     = getRank(totalScore)
  const nextPts  = ptsToNextRank(totalScore)
  const allRanks = ['initiate','analyst','operator','specialist','expert','elite','purple-lead']
  const rankIdx  = allRanks.indexOf(rank.id)
  const xpPct    = rank.max
    ? Math.round(((totalScore - rank.min) / (rank.max - rank.min)) * 100)
    : 100

  return (
    <aside className={styles.sidebar}>
      {/* Logo */}
      <div className={styles.logo}>
        <div className={styles.logoMark}>⬡ Cyber<span>Track</span></div>
        <div className={styles.logoSub}>800-Day Purple Team</div>
      </div>

      {/* XP block */}
      <div className={styles.xpBlock}>
        <div className={styles.xpLabel}>Total XP Score</div>
        <div className={styles.xpVal}>{totalScore.toLocaleString()}</div>
        <div className={styles.xpBarWrap}>
          <div className={styles.xpBar} style={{ width: `${xpPct}%` }} />
        </div>
        <div className={styles.xpNext}>
          {rank.max
            ? <>{nextPts.toLocaleString()} pts → <span>{allRanks[rankIdx + 1]?.toUpperCase()}</span></>
            : <span>MAX RANK ACHIEVED</span>
          }
        </div>
      </div>

      {/* Streak */}
      <div className={styles.streakBox}>
        <span className={styles.streakFlame}>🔥</span>
        <div>
          <div className={styles.streakNum}>{streak}</div>
          <div className={styles.streakLabel}>Day Streak</div>
        </div>
        <div className={styles.streakBest}>
          <div className={styles.streakBestNum}>{bestStreak}</div>
          <div className={styles.streakLabel}>Best</div>
        </div>
      </div>

      {/* Rank badge */}
      <div className={styles.rankBadge}>
        <span className={styles.rankDot} />
        <span className={styles.rankLabel}>{rank.label}</span>
      </div>

      {/* Nav */}
      <nav className={styles.nav}>
        <div className={styles.navSection}>Navigation</div>
        {NAV.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
          >
            <span className={styles.navIcon}>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}

        <div className={styles.navSection}>Tools</div>
        {TOOLS.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
          >
            <span className={styles.navIcon}>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className={styles.footer}>v1.0 · GitHub Pages</div>
    </aside>
  )
}
