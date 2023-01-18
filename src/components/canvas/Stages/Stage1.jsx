import React from 'react'
import ComputerNetwork from './Objects3D/ComputerNetwork'
import { useStore } from '@/Store'
export function Stage1(props) {
  const { Models, animations, Instances } = useStore((state) => ({ Models: state.Models, Instances: state.Instances, animations: state.animations, }))

  return (
    <ComputerNetwork sceneData={Instances['Network']} />
  )
}

export default Stage1
