/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export default function Model(props) {
  const group = useRef()
  const { nodes, materials } = useGLTF('/Macbookpro.glb')
  return (
    <group ref={group} {...props} dispose={null}>
      <group position={[0, 0, 1.03]}>
        <mesh geometry={nodes.Body.geometry} material={nodes.Body.material} />
        <mesh geometry={nodes.innerPorts.geometry} material={materials['innerPortsMaterial.001']} />
        <mesh geometry={nodes.Keys.geometry} material={materials['keysMaterial.001']} />
        <mesh geometry={nodes.KeysBackPlate.geometry} material={materials['keysBackMaterial.001']} />
        <mesh geometry={nodes.Legs.geometry} material={materials['legsMaterial.001']} />
        <mesh geometry={nodes.PinPorts.geometry} material={materials['pinPortsMaterial.001']} />
        <mesh geometry={nodes['Ref-keyText'].geometry} material={materials['keysTextMaterial.001']} />
        <mesh geometry={nodes.SidePorts.geometry} material={materials['sidePortsMaterial.001']} />
      </group>
      <group position={[0, 0.1, 0.02]}>
        <mesh geometry={nodes.BackScreen.geometry} material={nodes.BackScreen.material} />
        <mesh geometry={nodes.HinchScreen.geometry} material={materials['screen.HinchMaterial.001']} />
        <mesh geometry={nodes.LowerScreen.geometry} material={materials['lowerScreenMaterial.001']} />
        <mesh geometry={nodes['Ref-glassFull'].geometry} material={materials['glassScreen.001']} />
        <mesh geometry={nodes['Ref-glassScreen'].geometry} material={materials['glassMaterial.001']} />
        <mesh geometry={nodes['ref-logo'].geometry} material={materials['logoMaterial.001']} />
      </group>
    </group>
  )
}

useGLTF.preload('/Macbookpro.glb')
