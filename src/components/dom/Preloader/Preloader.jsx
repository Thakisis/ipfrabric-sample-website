import React, { useEffect, useState } from 'react'
import styles from './Preloader.module.scss'
import { useStore } from '@/Store'
import { Text3D } from '@react-three/drei'
export function Preloader({ viewport }) {


  const { width, height } = viewport
  const loaderDashoffsetTotal = 502
  const { percentLoaded, overlayState, filesTotal, filesLoaded } = useStore(state => state.preloadState)
  const preloadState = useStore(state => state.preloadState)
  const calc = (loaderDashoffsetTotal / 100)
  const percent = Math.round(calc * percentLoaded)
  const offset = loaderDashoffsetTotal - percent
  const logoContent = overlayState === 0 ? "Initializing" : overlayState === 2 ? "Compiling" : overlayState === 3 ? "Complete " : `${percent}`

  return (
    <div className={styles.preloader}>
      <div className={styles.container} style={{ width: `${width}px`, height: `${height}px` }}>
        aaa
      </div>

    </div>
  )
}
