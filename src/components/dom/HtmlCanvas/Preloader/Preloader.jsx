import React, { useEffect, useLayoutEffect, useRef } from 'react'
import styles from './Preloader.module.scss'
import { useControls } from 'leva'
import { useStore } from '@/Store'
import { InitPreload } from '@/components/dom/InitPreload'
import gsap from 'gsap'
export function Preloader({ viewport }) {
  const { overlayState, percent, compileObjects } = useStore(state => (
    {
      overlayState: state.overlayState,
      percent: state.Loading.preloadState.percentLoaded,
      compileObjects: state.Actions.compileObjects
    }
  ))
  const pulseRef = useRef()
  useLayoutEffect(() => {
    if (overlayState === 3 && pulseRef.current)
      gsap.to(pulseRef.current, {
        duration: 1, transform: "scale(2)", opacity: 0,
        onComplete: () => {
          compileObjects()
        }
      })

  }, [overlayState, pulseRef, compileObjects])
  const { width, height } = viewport
  const dashtotal = 311
  const preloaderContent = overlayState === 2 ? `${percent}` : overlayState === 3 ? "Compiling" : overlayState === 4 ? "Complete " : "Creating Scene"

  return (
    <div className={styles.screen}>
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
      <InitPreload />
    </div>
  )
}
//style={{ strokeDashoffset: `${offset}px`, opacity: overlayState !== 1 ? 1 : 0 }}
//<circle className={styles.outer} cx="90" cy="90" r="50" transform="rotate(-90, 100, 90)" style={{ strokeDashoffset: `${offset}px`, opacity: overlayState !== 1 ? 1 : 0 }} />
