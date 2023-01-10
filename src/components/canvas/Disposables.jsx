import React from 'react'
import { Materials } from './Materials'
import { useStore } from "@/Store"
// add components what need to be created for retrieve objets cant be created in threejs 
export const Disposables = () => {

  const dispose = useStore((state) => state.disposables)
  console.log(dispose)

  return (

    dispose.materials ? undefined : <Materials></Materials>

  )
}


