import { useRef, useLayoutEffect } from "react"
import * as Html from '@/components/dom/HtmlCanvas'
import { useThree, useFrame } from "@react-three/fiber"
import { useControls } from "leva"
import { useStore } from "@/Store"
import * as THREE from 'three'
import { easing } from 'maath'
import { BakeShadows } from "@react-three/drei"
const MacBookM1 = () => {
  const planeRef = useRef()
  const { Models, overlayState } = useStore((state) => ({ Models: state.Models, modelsTextures: state.ModelsTextures, overlayState: state.overlayState }))
  const model = Models["macBook"]
  const { size, camera } = useThree()

  useLayoutEffect(() => {
    if (planeRef && camera) {
      zoomCameraToSelection(camera, size, planeRef.current)
    }
  }, [camera, planeRef, size])

  return (
    <group >
      {overlayState === 4 && < primitive object={model} scale={1} position={[0, 0, 0]} />}


      <mesh position={[0, 1.57, 0]} rotation={[0, 0, 0]} ref={planeRef}
        visible={false}

      >
        <planeGeometry args={[3.08, 2.09]} />
        <meshPhysicalMaterial
          //map={ScreenShot}
          //emissiveMap={ScreenShot}
          color="red"
          opacity={0}
          metalness={1}
          roughness={0}
        //emissiveIntensity={22}
        //roughness={0}
        ></meshPhysicalMaterial>



      </mesh>
      <Html.MacBook />


      <BakeShadows></BakeShadows>
      {overlayState === 10 && <DebugCamera></DebugCamera>}

    </group >
  )


}


export default MacBookM1





function DebugCamera() {
  const { camera } = useThree()

  const cameraTransform = useControls("Camera", {
    //position: { value: [3.19, 1.51, 6.49], step: .01 },
    //rotation: { value: [-0.07, 0.72, 0.04], step: 0.01 },
  })

  useFrame((state, delta) => {


    //easing.damp3(state.camera.position, cameraTransform.position, 2, delta)
    //easing.damp3(state.camera.rotation, cameraTransform.rotation, 2, delta)

  })
  return (undefined)

}








function zoomCameraToSelection(camera, size, selection) {
  const box = new THREE.Box3()

  box.expandByObject(selection)
  const sizeBox = box.getSize(new THREE.Vector3())
  const center = box.getCenter(new THREE.Vector3())
  const maxSize = Math.min(sizeBox.x, sizeBox.y)
  const fitHeightDistance = maxSize / (2 * Math.atan((Math.PI * camera.fov) / 360))
  const fitWidthDistance = fitHeightDistance / camera.aspect
  //const distance = size.width > size.height ? 0.970 * fitWidthDistance : 0.66 * fitHeightDistance
  const distance = size.width > size.height ? fitWidthDistance : fitHeightDistance
  camera.position.set(center.x, center.y, distance + center.z)
  camera.lookAt(center.x, center.y, 0)


  /*
    const direction = center
      .clone()
      .sub(camera.position)
      .normalize()
      .multiplyScalar(distance)
  
    controls.maxDistance = distance * 10
    controls.target.copy(center)
  
    camera.near = distance / 100
    camera.far = distance * 100
    camera.updateProjectionMatrix()
  
    camera.position.copy(controls.target).sub(direction)
  
    controls.update()*/

}
