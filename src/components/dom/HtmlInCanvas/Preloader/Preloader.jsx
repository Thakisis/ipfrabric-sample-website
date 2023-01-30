import React, { useEffect, useState } from 'react'
import styles from './Preloader.module.scss'
import { useControls } from 'leva'
import { useStore } from '@/Store'

export function Preloader({ viewport }) {


  const { width, height } = viewport
  const dashtotal = 302

  const { percentLoaded, overlayState, filesTotal, filesLoaded } = useStore(state => state.preloadState)
  //const preloadState = useStore(state => state.preloadState)
  //const calc = (loaderDashoffsetTotal / 100)
  const percent = Math.round(percentLoaded)



  //const logoContent = overlayState === 0 ? "Initializing" : overlayState === 2 ? "Compiling" : overlayState === 3 ? "Complete " : `${percent}`

  return (
    <div className={styles.studioScreen}>
      <div className={styles.container} style={{ width: `${width}px`, height: `${height}px` }}>
        <div className={styles.Loader}>
          <div className={styles.progress}>
            {percent}%
          </div>
          <svg className={styles.percent} viewBox="0  0  100 100">

            <circle className={styles.background} cx="50" cy="50" r="50" transform="rotate(-90, 50, 50)" />
            <circle className={styles.outer} cx="50" cy="50" r="50" transform="rotate(-90, 50, 50)"

              style={{
                strokeDasharray: dashtotal, strokeDashoffset: dashtotal - dashtotal * percent / 100
              }}
            />

          </svg>
          <div className={styles.pulse}></div>
        </div>
      </div>

    </div>
  )
}
//style={{ strokeDashoffset: `${offset}px`, opacity: overlayState !== 1 ? 1 : 0 }}
//<circle className={styles.outer} cx="90" cy="90" r="50" transform="rotate(-90, 100, 90)" style={{ strokeDashoffset: `${offset}px`, opacity: overlayState !== 1 ? 1 : 0 }} />
