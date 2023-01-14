
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Preload } from '@react-three/drei'
import { Perf } from 'r3f-perf'
import { GridFloor } from './GridFloor'
import { Camera } from './Camera'
import { LightEffects } from './LightEffects'
import { GetScene } from './GetScene'
import ComputerNetwork from './Objects3D/ComputerNetwork'
export default function Scene({ children, ...props }) {
  // Everything defined in here will persist between route changes, only children are swapped

  return (
    <Canvas {...props}>

      <directionalLight intensity={0.75} />
      <ambientLight intensity={0.75} />
      <Camera />
      <LightEffects></LightEffects>
      <ComputerNetwork></ComputerNetwork>
      <GridFloor />
      <Perf overClock />
      <OrbitControls />
      <GetScene />

    </Canvas>
  )
}
