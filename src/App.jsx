import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useCallback, useContext, createContext } from 'react'

import { useTracker }       from './hooks/useTracker.js'
import { useToast }         from './hooks/useToast.js'
import { useBadges }        from './hooks/useBadges.js'
import { useNotifications } from './hooks/useNotifications.js'
import storage              from './utils/storage.js'

import { Layout }     from './components/layout/Layout.jsx'
import { Onboarding } from './components/onboarding/Onboarding.jsx'
import { Dashboard }  from './components/dashboard/Dashboard.jsx'
import { TodayTasks } from './components/tracker/TodayTasks.jsx'
import { DailyReport } from './components/report/DailyReport.jsx'
import { Phases }     from './components/phases/Phases.jsx'
import { Badges }     from './components/badges/Badges.jsx'
import { GitHub }     from './components/github/GitHub.jsx'
import { Export }     from './components/export/Export.jsx'
import { Settings }   from './components/settings/Settings.jsx'

// ── Context ─────────────────────────────────────────────────────────────────
export const TrackerContext = createContext(null)
export const useTrackerCtx  = () => useContext(TrackerContext)

// ── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const tracker = useTracker()
  const { toasts, showToast, dismissToast } = useToast()

  // Notifications (fires on mount)
  useNotifications()

  // Badge unlock handler — shows a toast
  const handleBadgeUnlock = useCallback((badge) => {
    showToast({
      icon:  badge.icon,
      title: `Badge Unlocked: ${badge.name}`,
      body:  badge.description,
      type:  'badge',
      duration: 5000,
    })
  }, [showToast])

  // Watch for badge unlocks
  useBadges({
    streak:        tracker.streak,
    totalScore:    tracker.totalScore,
    currentDay:    tracker.currentDay,
    completedDays: tracker.completedDays,
    onBadgeUnlock: handleBadgeUnlock,
  })

  // Report save toast
  const handleReportSave = useCallback(() => {
    showToast({ icon: '💾', title: 'Report Saved', body: '+3 pts added.', type: 'success' })
  }, [showToast])

  // Complete / miss toasts (wrap tracker methods)
  const handleCompleteDay = useCallback(() => {
    tracker.completeDay()
    showToast({
      icon:  '🔥',
      title: `Day ${tracker.currentDay} Complete!`,
      body:  `Streak: ${tracker.streak + 1} days. Keep going.`,
      type:  'success',
    })
  }, [tracker, showToast])

  const handleMissDay = useCallback(() => {
    tracker.missDay()
    showToast({
      icon:  '😤',
      title: 'Day Missed',
      body:  '-8 pts. Streak reset. Come back tomorrow.',
      type:  'error',
    })
  }, [tracker, showToast])

  // Merge overridden handlers back into tracker object passed to children
  const trackerWithToasts = {
    ...tracker,
    completeDay: handleCompleteDay,
    missDay:     handleMissDay,
  }

  // Onboarding — show if no start date set
  const hasStartDate = !!storage.getStartDate()
  if (!hasStartDate) {
    return (
      <Onboarding onComplete={() => window.location.reload()} />
    )
  }

  return (
    <TrackerContext.Provider value={trackerWithToasts}>
      <HashRouter>
        <Routes>
          <Route
            element={
              <Layout
                tracker={trackerWithToasts}
                toasts={toasts}
                onDismissToast={dismissToast}
              />
            }
          >
            <Route index element={<Dashboard tracker={trackerWithToasts} />} />
            <Route path="today"    element={<TodayTasks  tracker={trackerWithToasts} />} />
            <Route path="report"   element={<DailyReport tracker={trackerWithToasts} onSave={handleReportSave} />} />
            <Route path="phases"   element={<Phases   tracker={trackerWithToasts} />} />
            <Route path="badges"   element={<Badges   tracker={trackerWithToasts} />} />
            <Route path="github"   element={<GitHub   tracker={trackerWithToasts} />} />
            <Route path="export"   element={<Export   tracker={trackerWithToasts} />} />
            <Route path="settings" element={<Settings onReset={() => window.location.reload()} />} />
            <Route path="*"        element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </HashRouter>
    </TrackerContext.Provider>
  )
}
