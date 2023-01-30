import { useRef, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Perf } from 'r3f-perf'
import { GridFloor } from './GridFloor'
import { Camera } from './Camera'
import { Lights } from './Lights'
import { GetScene } from './GetScene'
import { Stages } from './Stages'

export default function Scene({ children, ...props }) {
  const canvasRef = useRef()

  return (
    <>

      <Canvas {...props} style={{ position: "fixed", top: 0, left: 0, width: "100%", }} shadows>
        <color attach="background" args={['#d0d0d0']} />
        <Camera />
        <Lights></Lights>
        <Stages></Stages>
        <GridFloor />
        <Perf overClock />

        <GetScene />
        <mesh castShadow position={[0, 0, 0]}

        >
          <boxGeometry args={[.2, .2, .2]} />
          <meshStandardMaterial
            opacity={1} //
            roughness={0.1}
            color={0x030303}
            metalness={1}
          />

        </mesh>

      </Canvas>
    </>

  )
}
