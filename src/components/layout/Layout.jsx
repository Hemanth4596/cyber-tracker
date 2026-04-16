import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar.jsx'
import { Topbar }  from './Topbar.jsx'
import { ToastContainer } from '../shared/Toast.jsx'
import styles from './Layout.module.css'

export function Layout({ tracker, toasts, onDismissToast }) {
  const {
    currentDay, totalScore, streak, bestStreak,
    dayData, dayScore, completedTasks,
    completeDay, missDay,
  } = tracker

  return (
    <div className={styles.app}>
      <Sidebar totalScore={totalScore} streak={streak} bestStreak={bestStreak} />

      <div className={styles.main}>
        <Topbar
          currentDay={currentDay}
          dayData={dayData}
          streak={streak}
          totalScore={totalScore}
          dayScore={dayScore}
          completedTasks={completedTasks}
          onCompleteDay={completeDay}
          onMissDay={missDay}
        />
        <div className={styles.content}>
          <Outlet />
        </div>
      </div>

      <ToastContainer toasts={toasts} onDismiss={onDismissToast} />
    </div>
  )
}
