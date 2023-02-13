import { useRef, useEffect, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import dynamic from 'next/dynamic'
import { useStore } from '@/Store'
import { GetScene } from './GetScene'
import { Environment, Lightformer } from '@react-three/drei'
import { Perf } from 'r3f-perf'
export default function Scene({ children, ...props }) {
  const canvasRef = useRef()
  return (
    <>

      <Canvas {...props} style={{ position: "fixed", top: 0, left: 0, width: "100%", }} shadows
        camera={{
          position: [6, 2.5, 10],
          rotation: [-.19, .65, .1],
          fov: 30,
        }}

      >
        <Perf
          overClock={true}
          position="top-left"
        ></Perf>

        <GetScene></GetScene>

        {children}

        <Environment files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/dancing_hall_1k.hdr" resolution={1024} blur={2103}>


        </Environment>

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
