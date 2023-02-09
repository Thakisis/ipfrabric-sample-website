import React from 'react'
import { useStore } from '@/Store'
import MacBookM1 from './Objects3D/MacBookM1'
//import IPFabric from './Objects3D/IPFabric'



export function StagePreload(props) {
  ///const { Models, animations, Instances, customTextures } = useStore((state) => ({ Models: state.Models, Instances: state.Instances, animations: state.animations, customTextures: state.customTextures }))

  return (
    <>
      <MacBookM1 />
    </>
  )
}

export default StagePreload
