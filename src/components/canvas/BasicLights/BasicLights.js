import { useState, useTransition } from 'react'
import { Environment, ContactShadows, Lightformer, CameraControls } from "@react-three/drei"
import { useControls } from 'leva'
export const Lights = () => {

  return (
    <>

      <ContactShadows resolution={1024} position={[0, -0.002, 0]} far={7.5} blur={.61} smooth opacity={.6} />
      <Env />

    </>
  )
}
//<ContactShadows />

function Env() {


  return (<Environment resolution={1024}>

    <group rotation={[-Math.PI / 3, 0, 0]}>
      <Lightformer intensity={4} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={[10, 10, 1]} />
      {[2, 0, 2, 0, 2, 0, 2, 0].map((x, i) => (
        <Lightformer key={i} form="circle" intensity={4} rotation={[Math.PI / 2, 0, 0]} position={[x, 4, i * 4]} scale={[4, 1, 1]} />
      ))}
      <Lightformer intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={[50, 2, 1]} />
      <Lightformer intensity={2} rotation-y={Math.PI / 2} position={[-5, -1, -1]} scale={[50, 2, 1]} />
      <Lightformer intensity={2} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={[50, 2, 1]} />
    </group>
  </Environment>)
}
