import { useEffect, useState, useRef } from 'react'
import { useStore } from '@/Store'
import { useFrame } from '@react-three/fiber'
import { easing } from 'maath'
import { getNetworkTransform, applyTransform } from '@/threeutils'

const ComputerNetwork = ({ scene }) => {
  const [phase, setPhase] = useState(-1)


  const parMutation = useRef()
  const target = { angle: Math.PI * 4, radius: 2 }
  useEffect(() => {
    parMutation.current = { angle: -Math.PI, radius: -Math.PI / 4 }


  }, [phase])
  useFrame((state, delta) => {

    //const tEnd = inAnim.animFunc(inAnim.endParams)[0]
    if (phase === -1 && parMutation.current) {
      const par = parMutation.current
      easing.damp(par, "angle", target.angle, 1, delta)
      easing.damp(par, "radius", target.radius, 1, delta)
      const clamp = (num, min, max) => Math.min(Math.max(num, min), max)
      const newRadius = clamp(par.radius, 0, 100)
      const newAngle = clamp(par.angle, 0, 100)
      const transform = getNetworkTransform({ amount: 1, radius: newRadius, angle: newAngle, scale: newRadius / 3 })[0]
      applyTransform({ obj: scene, transform: transform, debug: false })
    }
    //const angle = computer.scene.rotation.y
    //const posx = finalRadius * angle / turns * Math.sin(angle)
    //const posy = finalRadius * angle / turns * Math.cos(angle)
    //computer.scene.position.set(posx, 0, posy)
    //const actScale = angle / (Math.PI * turns) * finalScale
    //computer.scene.scale.set(actScale, actScale, actScale)
    //computer.scene.matrix.needsUpdate = true
    /*
          easing.damp3(computer.scene.rotation, [0, angle, 0], 0.2, delta)
    
          easing.damp3(computer.scene.position, [x, 0, y], 0.2, delta)
    
          easing.damp3(computer.scene.scale, [angle / 12, angle / 12, angle / 12], 0.2, delta)
          */



    //easing.damp3(state.camera.position, [Math.sin(state.pointer.x / 4) * 9, 1.25 + state.pointer.y, Math.cos(state.pointer.x / 4) * 9], 0.5, delta)
  })
  return (
    <group>
      <primitive object={scene} scale={.3}></primitive>

    </group>
  )


}

export default ComputerNetwork

