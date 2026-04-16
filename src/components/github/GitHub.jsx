import { useState, useEffect } from 'react'
import { Card }   from '../shared/Card.jsx'
import { Button } from '../shared/Button.jsx'
import storage    from '../../utils/storage.js'
import { fetchGitHubContributions, calcGitHubStreak, flattenContributions } from '../../utils/github.js'
import styles from './GitHub.module.css'

export function GitHub({ tracker }) {
  const { streak } = tracker

  const [username,   setUsername]   = useState(() => storage.getGithubUsername())
  const [token,      setToken]      = useState(() => storage.getGithubToken())
  const [contribs,   setContribs]   = useState(null)
  const [ghStreak,   setGhStreak]   = useState(0)
  const [loading,    setLoading]    = useState(false)
  const [error,      setError]      = useState('')
  const [saved,      setSaved]      = useState(false)

  const handleSave = () => {
    storage.setGithubUsername(username)
    storage.setGithubToken(token)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleFetch = async () => {
    if (!username || !token) { setError('Enter your GitHub username and token first.'); return }
    setLoading(true)
    setError('')
    try {
      const data = await fetchGitHubContributions(username, token)
      if (!data) throw new Error('No data returned — check your token permissions.')
      setContribs(flattenContributions(data))
      setGhStreak(calcGitHubStreak(data))
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const streakSynced = ghStreak > 0 && ghStreak >= streak

  const REPOS = [
    { name: 'purple-team-roadmap',  desc: 'Your main learning notes repo', icon: '📘' },
    { name: 'offensive-tools',      desc: 'Custom Python + C tools',        icon: '🛠️' },
    { name: 'ctf-writeups',         desc: 'HTB / CTF write-ups',            icon: '📝' },
    { name: 'sigma-rules',          desc: 'Detection engineering rules',    icon: '🔬' },
    { name: 'c2-research',          desc: 'C2 development + BOF research',  icon: '⚡' },
  ]

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>GitHub <span>Integration</span></h1>
        <p className={styles.sub}>Connect your learning streak to your contribution graph</p>
      </div>

      {/* Config */}
      <Card title="Configuration" className={styles.configCard}>
        <div className={styles.fieldRow}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>GitHub Username</label>
            <input
              className={styles.input}
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="your-github-username"
            />
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Personal Access Token <span className={styles.scope}>(read:user scope)</span></label>
            <input
              className={styles.input}
              type="password"
              value={token}
              onChange={e => setToken(e.target.value)}
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
            />
          </div>
        </div>
        <div className={styles.tokenNote}>
          Token stored in localStorage only — never sent anywhere except GitHub's API.
          Generate at: github.com → Settings → Developer Settings → Personal Access Tokens
        </div>
        {error && <div className={styles.errorMsg}>{error}</div>}
        <div className={styles.configActions}>
          <Button variant="ghost" onClick={handleSave}>{saved ? '✓ Saved' : 'Save Config'}</Button>
          <Button variant="accent" onClick={handleFetch} disabled={loading}>
            {loading ? 'Fetching…' : 'Sync Now'}
          </Button>
        </div>
      </Card>

      {/* Streak comparison */}
      <Card title="Streak Sync" className={styles.streakCard}>
        <div className={styles.streakCompare}>
          <div className={styles.streakCol}>
            <div className={styles.streakNum} style={{ color: 'var(--orange)' }}>{streak}</div>
            <div className={styles.streakLabel}>CyberTrack Streak</div>
          </div>
          <div className={styles.streakDivider}>
            {streakSynced
              ? <span className={styles.syncGood}>✓ SYNCED</span>
              : <span className={styles.syncBad}>⚠ GAP</span>}
          </div>
          <div className={styles.streakCol}>
            <div className={styles.streakNum} style={{ color: ghStreak > 0 ? 'var(--green)' : 'var(--muted)' }}>
              {ghStreak > 0 ? ghStreak : '—'}
            </div>
            <div className={styles.streakLabel}>GitHub Streak</div>
          </div>
        </div>
        {!streakSynced && ghStreak > 0 && (
          <div className={styles.syncWarning}>
            Your GitHub streak ({ghStreak}d) is behind your CyberTrack streak ({streak}d).
            Commit something to GitHub today to keep them aligned.
          </div>
        )}
        {contribs && (
          <div className={styles.syncNote}>
            Contribution data loaded. Commit today to earn +2 bonus pts.
          </div>
        )}
      </Card>

      {/* Suggested repos */}
      <Card title="Suggested Portfolio Repositories">
        <p className={styles.repoNote}>
          These are the repos you should be building alongside this roadmap.
          Each one becomes evidence of your skills.
        </p>
        <div className={styles.repoList}>
          {REPOS.map(r => (
            <div key={r.name} className={styles.repoItem}>
              <span className={styles.repoIcon}>{r.icon}</span>
              <div className={styles.repoInfo}>
                <div className={styles.repoName}>{username || 'your-username'}/{r.name}</div>
                <div className={styles.repoDesc}>{r.desc}</div>
              </div>
              {username && (
                <a
                  href={`https://github.com/${username}/${r.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.repoLink}
                >
                  View →
                </a>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* GitHub Actions tip */}
      <Card title="Auto-Commit with GitHub Actions">
        <p className={styles.repoNote}>
          Add this workflow to your roadmap repo to auto-commit your daily tracker JSON
          and keep your contribution graph active even on pure study days.
        </p>
        <pre className={styles.codeBlock}>{`# .github/workflows/daily-commit.yml
name: Daily Tracker Commit
on:
  schedule:
    - cron: '0 20 * * *'  # 8pm UTC daily
  workflow_dispatch:
jobs:
  commit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Update tracker timestamp
        run: |
          echo "$(date -u)" > .last-study
          git config user.name "CyberTrack"
          git config user.email "tracker@local"
          git add .last-study
          git diff --staged --quiet || git commit -m "study: day update $(date +%Y-%m-%d)"
          git push`}
        </pre>
      </Card>
    </div>
  )
}
