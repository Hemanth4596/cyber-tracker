import { useState }   from 'react'
import { Card }        from '../shared/Card.jsx'
import { Button }      from '../shared/Button.jsx'
import storage         from '../../utils/storage.js'
import { generateDayMarkdown, generateWeeklySummary, exportJSONBackup, exportScoreCSV, copyToClipboard } from '../../utils/export.js'
import styles from './Export.module.css'

export function Export({ tracker }) {
  const { currentDay, dayData, completedTasks, dayScore } = tracker
  const [status, setStatus] = useState({})

  const flash = (key, msg) => {
    setStatus(s => ({ ...s, [key]: msg }))
    setTimeout(() => setStatus(s => ({ ...s, [key]: null })), 2500)
  }

  const handleDayMD = async () => {
    const report = storage.getDayReport(currentDay)
    const habits = storage.getDayHabits(currentDay)
    const md = generateDayMarkdown(currentDay, dayData, report, completedTasks, habits, dayScore)
    await copyToClipboard(md)
    flash('daymd', '✓ Copied!')
  }

  const handleWeekMD = async () => {
    const completedDays = storage.getCompletedDays()
    const missedDays    = storage.getMissedDays()
    const weekStart     = Math.max(1, currentDay - 6)
    const days          = Array.from({ length: 7 }, (_, i) => {
      const d = weekStart + i
      return {
        dayNum: d,
        topic:  'Study Session',
        status: completedDays.includes(d) ? 'completed' : missedDays.includes(d) ? 'missed' : 'pending',
        score:  completedDays.includes(d) ? 20 : missedDays.includes(d) ? -8 : 0,
      }
    })
    const weekNum = Math.ceil(currentDay / 7)
    const md = generateWeeklySummary(weekNum, days)
    await copyToClipboard(md)
    flash('weekmd', '✓ Copied!')
  }

  const handleJSON = () => {
    exportJSONBackup()
    flash('json', '✓ Downloaded!')
  }

  const handleCSV = () => {
    exportScoreCSV()
    flash('csv', '✓ Downloaded!')
  }

  const totalReports = Object.keys(storage.getDailyReports()).length
  const totalDays    = storage.getCompletedDays().length

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Export & <span>Reports</span></h1>
        <p className={styles.sub}>Generate reports from your tracked data · {totalDays} days tracked · {totalReports} reports filed</p>
      </div>

      <Card title="Export Options" className={styles.exportCard}>
        <div className={styles.exportList}>
          <ExportItem
            icon="📄"
            title="Daily Report — Markdown"
            desc={`Today's Day ${currentDay} report as .md — copy to clipboard`}
            btnLabel={status.daymd || 'Copy MD'}
            onClick={handleDayMD}
          />
          <ExportItem
            icon="📋"
            title="Weekly Summary — Markdown"
            desc="Last 7 days: tasks, score, habits, notes compiled"
            btnLabel={status.weekmd || 'Copy MD'}
            onClick={handleWeekMD}
          />
          <ExportItem
            icon="💾"
            title="Full Data Backup — JSON"
            desc="Complete localStorage export for migration or backup"
            btnLabel={status.json || 'Download JSON'}
            onClick={handleJSON}
          />
          <ExportItem
            icon="📊"
            title="Score History — CSV"
            desc="Day-by-day score log for external analysis in Excel / Sheets"
            btnLabel={status.csv || 'Download CSV'}
            onClick={handleCSV}
          />
        </div>
      </Card>

      <Card title="Data Import" className={styles.importCard}>
        <p className={styles.importNote}>
          To import a backup JSON, paste the file contents below and click Import.
          This will overwrite your current data.
        </p>
        <textarea
          className={styles.importArea}
          placeholder='Paste backup JSON here…'
          id="importJson"
          rows={5}
        />
        <div style={{ marginTop: 10 }}>
          <Button variant="ghost" onClick={() => {
            try {
              const raw = document.getElementById('importJson').value
              const data = JSON.parse(raw)
              storage.importAll(data)
              alert('Import successful! Refresh the page.')
            } catch {
              alert('Invalid JSON. Check the format and try again.')
            }
          }}>
            Import Backup
          </Button>
        </div>
      </Card>

      <Card title="Storage Info">
        <div className={styles.storageGrid}>
          <StorageRow label="Days Tracked"  value={totalDays} />
          <StorageRow label="Reports Filed" value={totalReports} />
          <StorageRow label="Score History" value={`${storage.getScoreHistory().length} entries`} />
          <StorageRow label="Badges Earned" value={storage.getBadges().length} />
          <StorageRow label="Total Score"   value={`${storage.getTotalScore().toLocaleString()} XP`} />
          <StorageRow label="Storage Used"  value={`~${(JSON.stringify(localStorage).length / 1024).toFixed(1)} KB`} />
        </div>
      </Card>
    </div>
  )
}

function ExportItem({ icon, title, desc, btnLabel, onClick }) {
  return (
    <div className={styles.exportItem} onClick={onClick}>
      <span className={styles.exportIcon}>{icon}</span>
      <div className={styles.exportInfo}>
        <div className={styles.exportTitle}>{title}</div>
        <div className={styles.exportDesc}>{desc}</div>
      </div>
      <span className={styles.exportBtn}>{btnLabel} →</span>
    </div>
  )
}

function StorageRow({ label, value }) {
  return (
    <div className={styles.storageRow}>
      <span className={styles.storageLabel}>{label}</span>
      <span className={styles.storageValue}>{value}</span>
    </div>
  )
}
