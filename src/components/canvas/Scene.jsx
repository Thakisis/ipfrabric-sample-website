import { useRef, useEffect, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
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
        ></Perf>

        <GetScene></GetScene>

        {children}
        <Suspense>
          <Environment files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/dancing_hall_1k.hdr" resolution={1024} blur={2103}>
            {/** On top of the HDRI we add some rectangular and circular shapes for nicer reflections */}
            <group rotation={[-Math.PI / 3, 0, 0]}>
              <Lightformer intensity={4} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={[10, 10, 1]} />
              {[2, 0, 2, 0, 2, 0, 2, 0].map((x, i) => (
                <Lightformer key={i} form="circle" intensity={4} rotation={[Math.PI / 2, 0, 0]} position={[x, 4, i * 4]} scale={[4, 1, 1]} />
              ))}
              <Lightformer intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={[50, 2, 1]} />
              <Lightformer intensity={2} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={[50, 2, 1]} />
            </group>
          </Environment>
        </Suspense>
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
