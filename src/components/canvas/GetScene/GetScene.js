import { useLayoutEffect, useRef } from 'react'
import { MeshTransmissionMaterial } from "@react-three/drei"
import { useThree } from '@react-three/fiber'
import { useStore } from '@/Store'

export function GetScene() {

  const glassRef = useRef()

  const { setThree, addMaterial, initPreload } = useStore(state => state.Actions)
  const { gl, scene, frameloop, size, camera } = useThree()

  useLayoutEffect(() => {
    if (!gl || !scene || !camera || !glassRef.current)
      return
    setThree({ gl, scene, frameloop, size, camera })
    const material = { glass: glassRef.current }
    addMaterial({ materials: material })
    initPreload()
  }, [gl, scene, frameloop, size, camera, setThree, initPreload, glassRef, addMaterial])


  const configGlass = {
    samples: 10,
    resolution: 1024,
    transmission: 0.95,
    roughness: 0,
    clearcoat: 1,
    clearcoatRoughness: 0,
    thickness: .5,
    ior: 1.2,
    chromaticAberration: 0,
    anisotropy: 0,
    distortion: 1,
    distortionScale: 0.3,
    temporalDistortion: 0,
    attenuationDistance: 0.5,

    color: '#bdd4ff'

  }
  return (
    <mesh position={[0, -2, 0]}>
      <sphereGeometry args={[0.01, 64, 64]} />
      <MeshTransmissionMaterial {...configGlass} ref={glassRef} />
    </mesh>
  )
}


export default GetScene
