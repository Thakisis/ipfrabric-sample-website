import { useEffect, useRef } from 'react'
import { MeshTransmissionMaterial } from "@react-three/drei"
import { useThree } from '@react-three/fiber'
import { useStore } from '@/Store'

const GetSceneMats = () => {
  const glassRef = useRef()

  const { setThree, addMaterial } = useStore(state => state.Actions)
  const { gl, scene, frameloop, size, camera } = useThree()
  const { initPreload } = useStore(state => state.Actions)

  useEffect(() => {
    if (!gl || !scene || !camera || !glassRef.current)
      return

    setThree({ gl, scene, frameloop, size, camera })
    const material = { glass: glassRef.current }
    addMaterial({ materials: material })
    initPreload()
  }, [gl, scene, frameloop, size, camera, setThree, initPreload, glassRef, addMaterial])



  const configGlass = {
    samples: 16,
    resolution: 256,
    transmission: 0.95,
    roughness: .2,
    clearcoat: 1,
    clearcoatRoughness: 0,
    thickness: .1,
    ior: 1.2,
    chromaticAberration: 0,
    anisotropy: 0,
    distortion: 1,
    distortionScale: 0.3,
    temporalDistortion: 0.5,
    attenuationDistance: 0.5,
    attenuationColor: '#ffffff',
    color: '#ffffff'

  }
  return (
    <mesh position={[0, .5, 0]}

    >
      <sphereGeometry args={[0.5, 64, 64]} />
      <MeshTransmissionMaterial {...configGlass} ref={glassRef}></MeshTransmissionMaterial >

    </mesh>
  )
}

export default GetSceneMats
