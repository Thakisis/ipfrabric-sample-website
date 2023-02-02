import { useRef, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Camera } from './Camera'
import { GetScene } from './GetScene'
import { GetMaterials } from './GetMaterials'
import { Stages } from './Stages'
import { PerspectiveCamera } from '@react-three/drei'
import { Perf } from 'r3f-perf'
import { Lights } from './Lights'
export default function Scene({ children, ...props }) {
  const canvasRef = useRef()

  return (
    <>
      <div > </div>
      <Canvas {...props} style={{ position: "fixed", top: 0, left: 0, width: "100%", }} shadows>
        <color attach="background" args={['#d0d0d0']} />
        <PerspectiveCamera

          makeDefault
          position={[6, 2.5, 10]}
          rotation={[-.19, .65, .1]}


          fov={25} />
        <Camera />
        <GetMaterials></GetMaterials>
        <Perf
          matrixUpdate

          overClock
          style={{ zIndex: 99999999, }}
          antialias
        />
        <Lights></Lights>
        <GetScene />
        <Stages></Stages>
      </Canvas>
    </>

  )
}
/*
import { Perf } from 'r3f-perf'
import { GridFloor } from './GridFloor'
import { Lights } from './Lights'


<Lights></Lights>
        <Stages></Stages>
        <GridFloor />
        <Perf
          matrixUpdate
          deepAnalyze
          overClock
          style={{ zIndex: 99999999, }}
          antialias
        />
        */
