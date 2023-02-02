import { useRef, useEffect } from 'react'
import gsap from "gsap"
import styles from './Overlay.module.scss'
import { useStore } from '@/Store'
const Overlay = () => {
  const bgRef = useRef()
  const { overlayState, initPreload } = useStore((state) => ({ overlayState: state.preloadState.overlayState, initPreload: state.Actions.initPreload }))
  useEffect(() => {
    if (bgRef.current && overlayState === 1) {

      gsap.to(bgRef.current, {
        duration: 1, opacity: 0,
        onComplete: () => initPreload()
      })
    }

    s
  }, [bgRef, overlayState, initPreload])

  return (
    <div className={styles.overlay}>


      <div className={styles.background} ref={bgRef}></div>
      <div className={styles.content}></div>


    </div>
  )
}

export default Overlay
