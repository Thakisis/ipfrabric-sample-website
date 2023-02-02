import React, { useEffect, useLayoutEffect, useRef } from 'react'
import styles from './Preloader.module.scss'
import { useControls } from 'leva'
import { useStore } from '@/Store'
import gsap from 'gsap'
export function Preloader({ viewport }) {
  const { setOverlay, preloadState, compileModels } = useStore(state => ({ setOverlay: state.Actions.setOverlay, compileModels: state.Actions.compileModels, preloadState: state.preloadState }))
  const { percentLoaded, overlayState, filesTotal, filesLoaded } = preloadState
  const pulseRef = useRef()
  useEffect(() => {

    setOverlay(1)
  }, [setOverlay])


  useLayoutEffect(() => {
    if (overlayState === 3 && pulseRef.current)
      gsap.to(pulseRef.current, {
        duration: 1, transform: "scale(2)", opacity: 0,
        onComplete: () => {

          compileModels()
        }
      })

  }, [overlayState, pulseRef, compileModels])
  const { width, height } = viewport
  const dashtotal = 311


  //const preloadState = useStore(state => state.preloadState)
  //const calc = (loaderDashoffsetTotal / 100)
  const percent = overlayState >= 2 ? Math.round(percentLoaded) : 0



  const preloaderContent = overlayState === 2 ? `${percent}` : overlayState === 3 ? "Compiling" : overlayState === 4 ? "Complete " : "Creating Scene"

  return (
    <div className={styles.studioScreen}>
      <div className={styles.container} style={{ width: `${width}px`, height: `${height}px` }}>
        <div className={styles.Loader}>
          <div className={styles.progress}>
            {preloaderContent}
          </div>
          <svg className={styles.percent} viewBox="0  0  100 100">

            <circle className={styles.background} cx="50" cy="50" r="50" transform="rotate(-90, 50, 50)" />
            <circle className={styles.outer} cx="50" cy="50" r="50" transform="rotate(-90, 50, 50)"

              style={{
                strokeDasharray: dashtotal, strokeDashoffset: dashtotal - dashtotal * percent / 100
              }}
            />

          </svg>
          <div className={styles.pulse} ref={pulseRef}></div>
        </div>
      </div>

    </div>
  )
}
//style={{ strokeDashoffset: `${offset}px`, opacity: overlayState !== 1 ? 1 : 0 }}
//<circle className={styles.outer} cx="90" cy="90" r="50" transform="rotate(-90, 100, 90)" style={{ strokeDashoffset: `${offset}px`, opacity: overlayState !== 1 ? 1 : 0 }} />
