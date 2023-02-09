import { useMemo, forwardRef } from 'react'
import { useStore } from "@/Store"
import { useControls } from "leva"
import { MeshTransmissionMaterial } from "@react-three/drei"
export function GetMaterials() {
  const { overlayState } = useStore(state => state.preloadState)

  const { ipfabric } = useStore((state) => state.ModelsElements)



  const { Left, Center, Right } = ipfabric ? ipfabric : {}


  const GlassMaterial = useMemo(() => {

    return (
      <MeshTransmissionMaterial />)

  }, [])
  if (overlayState !== 4)
    return undefined


  return (

    <group position={[-3, 0, 2]} scale={1.5} >
      <primitive object={Left} scale={1} />
      <primitive object={Center} position={[0, 0, 0]} >
        <meshBasicMaterial metalness={1} roughness={1}></meshBasicMaterial>
      </primitive>
      <primitive object={Right} scale={1} />
    </group >

  )


}



/*----------------------------------------------------------------

  const config = useControls({
    meshPhysicalMaterial: true,
    transmissionSampler: false,
    backside: true,
    backsideThickness: { value: -.4, min: -10, max: 10 },
    samples: { value: 10, min: 0, max: 32, step: 1 },
    resolution: { value: 1024, min: 256, max: 2048, step: 256 },
    backsideResolution: { value: 1024, min: 32, max: 2048, step: 256 },
    transmission: { value: .95, min: 0, max: 1 },
    roughness: { value: 0.48, min: 0, max: 1, step: 0.01 },
    ior: { value: 1.02, min: 1, max: 5, step: 0.01 },
    thickness: { value: 1, min: 0, max: 10, step: 0.01 },
    chromaticAberration: { value: 0, min: 0, max: 1 },
    anisotropy: { value: 0, min: 0, max: 1, step: 0.01 },
    distortion: { value: 1, min: 0, max: 1, step: 0.01 },
    distortionScale: { value: 0.3, min: 0.01, max: 1, step: 0.01 },
    temporalDistortion: { value: 0, min: 0, max: 1, step: 0.01 },
    attenuationDistance: { value: 0.5, min: 0, max: 2.5, step: 0.01 },
    clearcoat: { value: 0, min: 0, max: 1 },
    attenuationColor: '#ffffff',
    color: '#ffffff'
  })
  */
