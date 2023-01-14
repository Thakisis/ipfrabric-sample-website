import { useEffect, useState } from 'react'
import { useStore } from '@/Store'
import { useFrame } from '@react-three/fiber'
import { easing } from 'maath'
import { gsap } from 'gsap/all'
const ComputerNetwork = () => {
  const { computer } = useStore(state => state.Models)
  const [show, setShow] = useState(false)
  let Obj = { x: 0, y: 0 }
  useEffect(() => {
    if (show)
      gsap.to(Obj, { duration: 2.5, ease: "elastic.out(1, 0.3)", x: 3 })
  }, [show])
  useFrame((state, delta) => {
    if (computer) {
      const radius = Obj.x
      const x = radius * Math.sin(state.clock.elapsedTime)
      const y = radius * Math.cos(state.clock.elapsedTime)
      //easing.damp3(computer.scene.rotation, [0, 1, 0], 0.2, delta)

      easing.damp3(computer.scene.rotation, [0, state.clock.elapsedTime, 0], 0.2, delta)
      easing.damp3(computer.scene.position, [x, 0, y], 0.2, delta)
      easing.damp3(computer.scene.scale, [radius / 3, radius / 3, radius / 3], 0.2, delta)
      return
    }
    console.log(computer)
    //easing.damp3(state.camera.position, [Math.sin(state.pointer.x / 4) * 9, 1.25 + state.pointer.y, Math.cos(state.pointer.x / 4) * 9], 0.5, delta)
  })
  return (
    <group>
      {computer && show ? <primitive object={computer.scene}></primitive> : undefined}
      <mesh castShadow position={[0, .25, 1]}

        onClick={() => setShow(!show)}
      >
        <sphereGeometry args={[0.25, 64, 64]} />
        <meshStandardMaterial
          opacity={1} //

          roughness={0.1}
          color={0x030303}
          metalness={1}

        />
      </mesh>
    </group>
  )


}

export default ComputerNetwork

