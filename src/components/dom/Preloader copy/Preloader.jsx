import React, { useEffect, useState } from 'react'
import styles from './Preloader.module.scss'
import { useStore } from '@/Store'
import { Text3D } from '@react-three/drei'
export function Preloader() {

  const loaderDashoffsetTotal = 502
  const { percentLoaded, overlayState, filesTotal, filesLoaded } = useStore(state => state.preloadState)
  const preloadState = useStore(state => state.preloadState)
  const calc = (loaderDashoffsetTotal / 100)
  const percent = Math.round(calc * percentLoaded)
  const offset = loaderDashoffsetTotal - percent
  const logoContent = overlayState === 0 ? "Initializing" : overlayState === 2 ? "Compiling" : overlayState === 3 ? "Complete " : `${percent}`

  return (
    <div className={[styles.overlay, styles.flex, styles.cac, styles.vac, overlayState === 3 ? styles.overlayOut : ""].join(" ")}>
      <div>
        <div className={[styles.loader, styles.preloader, styles.flex, styles.vac, overlayState === 3 ? styles.out : styles.preloaderIn].join(" ")} >
          <svg width="200" height="200" >
            <circle className={styles.background} cx="90" cy="90" r="80" transform="rotate(-90, 50, 50)" />
            <circle className={styles.outer} cx="90" cy="90" r="80" transform="rotate(-90, 50, 50)" />

          </svg>
          <span className={styles.circleBackground}></span>
          <span className={[styles.logo, styles.animated, overlayState === 3 ? styles.fadeOut : styles.fadeIn].join(" ")} >

            {logoContent}
          </span>
        </div>
        <div className={styles.tipContainer}> {overlayState === 1 ? "Loading Models" : ""}</div>
      </div>
    </div>
  )
}
//style={{ strokeDashoffset: `${offset}px`, opacity: overlayState !== 1 ? 1 : 0 }}
