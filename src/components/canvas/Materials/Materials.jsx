import { useEffect, useRef } from "react"
import { MeshTransmissionMaterial } from "@react-three/drei"
import { useStore } from "@/Store"
import { useThree } from "@react-three/fiber"
//Material only available on Drei need to be created in r3f
export const Materials = () => {
  const glassRef = useRef()
  const { addMaterial, addMeshToScene } = useStore((state) => state.Actions)
  // once material is created component will be removed 
  const { scene } = useThree()
  console.log("mats")
  useEffect(() => {

    if (glassRef.current) {
      const material = { glass: glassRef.current, }
      addMaterial({ materials: material, isComplete: true })

    }

  }, [glassRef, addMaterial])



  const configGlass = {
    samples: 10,
    resolution: 256,
    transmission: 0.95,
    roughness: .11,
    clearcoat: 1,
    clearcoatRoughness: 0,
    thickness: 1,
    ior: 1.1,
    chromaticAberration: 0,
    anisotropy: 0,
    distortion: 0.1,
    distortionScale: 0.3,
    temporalDistortion: 0.5,
    attenuationDistance: 0.5,
    attenuationColor: '#ffffff',
    color: '#ffffff'
  }

  const addLogo = () => {
    addMeshToScene({ type: "SVG", name: "ipLogo", scene })
  }

  return (
    <>
      <mesh castShadow position={[0, .25, 5]}
        onClick={addLogo}
      >
        <sphereGeometry args={[0.5, 64, 64]} />
        <MeshTransmissionMaterial {...configGlass} ref={glassRef}></MeshTransmissionMaterial >

      </mesh>
    </>
  )
}


