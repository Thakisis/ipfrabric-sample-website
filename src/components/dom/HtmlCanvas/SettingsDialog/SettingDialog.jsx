import styles from './SettingsDialog.module.scss'

export function SettingDialog() {
  return (
    <div style={{ pointerEvents: 'all' }}>
      <button className={[styles.btn, styles.btnSecondary].join(" ")}>Decline</button>
      <button className={[styles.btn, styles.btnPrimary].join(" ")}>Accept</button>
    </div>
  )
}


