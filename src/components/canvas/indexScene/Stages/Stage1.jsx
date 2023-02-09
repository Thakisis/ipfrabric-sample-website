import React from 'react'
import { useStore } from '@/Store'
import MicrosoftStudio from './Objects3D/MicrosoftStudio'
//import IPFabric from './Objects3D/IPFabric'



export function Stage1(props) {
  const { Models, animations, Instances, customTextures } = useStore((state) => ({ Models: state.Models, Instances: state.Instances, animations: state.animations, customTextures: state.customTextures }))

  return (
    <>

    </>
  )
}

export default Stage1
