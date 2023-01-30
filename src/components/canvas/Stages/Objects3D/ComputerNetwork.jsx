import { useEffect, useState, useRef } from 'react'
import { useStore } from '@/Store'
import { useFrame } from '@react-three/fiber'
import { easing } from 'maath'
import { getNetworkTransform, applyTransform } from '@/threeutils'
import { animateNetworkIn } from '@/threeutils/AnimationFunctions'

const ComputerNetwork = ({ sceneData }) => {
  const [phase, setPhase] = useState(-1)
  const { model } = sceneData

  const parMutation = useRef()
  const targetMutation = { angle: Math.PI * 4, radius: 2 }
  useEffect(() => {
    parMutation.current = { angle: 0, radius: 0 }


  }, [phase])
  useFrame((state, delta) => {
    const timeAnimation = 5
    if (phase === -1 && parMutation.current) {
      const par = parMutation.current


      easing.damp(par, "radius", targetMutation.radius, 2, delta)
      //angle and radius have a correlation but to avoid more calculation will be interpolated too
      //scale too but in this case is tr
      easing.damp(par, "angle", targetMutation.angle, timeAnimation, delta)
      animateNetworkIn({ sceneData, parMutation: parMutation.current, targetMutation, timeAnimation, debug: true })

    }



  })
  return (
    <group>
      <primitive object={model} scale={1}></primitive>
      <mesh castShadow position={[1, .5, 0]}

      >
        <sphereGeometry args={[0.25, 64, 64]} />
        <meshStandardMaterial
          opacity={1} //
          roughness={0.1}
          color={0xff0000}
          metalness={1}
        />

      </mesh>
    </group>
  )


}

export default ComputerNetwork

