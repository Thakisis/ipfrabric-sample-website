import { useRef, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Camera } from './Camera'
import { GetScene } from './GetScene'
import { GetMaterials } from './GetMaterials'
import { Stages } from './Stages'
import { PerspectiveCamera } from '@react-three/drei'
import { Perf } from 'r3f-perf'
import { Lights } from './Lights'
import { useRouter } from 'next/router'


export default function Scene({ children, ...props }) {
  const canvasRef = useRef()

  return (
    <>

      <Canvas {...props} style={{ position: "fixed", top: 0, left: 0, width: "100%", }} shadows
        camera={{
          fov: 75,
          position: [6, 2.5, 10],
          rotation: [-.19, .65, .1],

        }}

      >
        <color attach="background" args={['#d0d0d0']} />

        <Camera />

        <Perf
          matrixUpdate

          overClock
          style={{ zIndex: 99999999, }}
          antialias
        />
        <Lights></Lights>
        <GetScene />

      </Canvas>
    </>

  )
}

/*!********************************
<GetMaterials></GetMaterials>
        
        <Stages></Stages>
        */

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
