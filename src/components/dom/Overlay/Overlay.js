import { useRef, useEffect } from 'react'
import gsap from "gsap"
import styles from './Overlay.module.scss'
import { useStore } from '@/Store'
const Overlay = () => {
  const bgRef = useRef()
  const { overlayState, preloadState, initPreloadRoute } = useStore((state) => ({ overlayState: state.overlayState, preloadState: state.Loading.preloadState, initPreloadRoute: state.Actions.initPreloadRoute }))
  const { percent } = preloadState

  useEffect(() => {

    if (bgRef.current && overlayState === 1) {

      gsap.to(bgRef.current, {
        duration: 1, opacity: 0,
        onComplete: () => initPreloadRoute()
      })
    }


  }, [bgRef, overlayState, initPreloadRoute])

  return (
    <div className={styles.overlay}>
      <div className={styles.loadBar}>
        <div className={styles.loadBarProgress} style={{ transform: `scaleX(${percent}%)`, transition: 'all 2s linear' }}></div>
      </div>

      <div className={styles.background} ref={bgRef}></div>
      <div className={styles.content}></div>


    </div>
  )
}

export default Overlay
