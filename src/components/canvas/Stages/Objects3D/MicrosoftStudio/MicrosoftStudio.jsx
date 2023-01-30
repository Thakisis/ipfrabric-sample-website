import { useRef, useLayoutEffect } from "react"
import { useControls } from 'leva'
import { HtmlStudio } from '@/components/dom/HtmlInCanvas'
import { useThree, useFrame } from "@react-three/fiber"
import { BakeShadows } from "@react-three/drei"
import { useStore } from "@/Store"

import * as THREE from 'three'
import { easing } from 'maath'
const MicrosoftStudio = () => {
  const { overlayState } = useStore(state => state.preloadState)
  const planeRef = useRef()
  const { Models, customTextures } = useStore((state) => ({ Models: state.Models, customTextures: state.customTextures }))
  const model = Models["microsoftStudio"]
  const { size, camera } = useThree()


  useLayoutEffect(() => {
    if (planeRef && camera) {
      zoomCameraToSelection(camera, size, planeRef.current)

    }


  }, [camera, planeRef, size])
  const groupTransform = { position: [0, 0, 0], rotation: [0, 0, 0] }
  const cameraTransform = {

    position: [4.46, 1.83, 7.24],
    rotation: [-0.11, 0.72, 0.07],

  }



  useFrame((state, delta) => {
    if (overlayState === 3) {
      easing.damp3(state.camera.position, cameraTransform.position, 2, delta)
      easing.damp3(state.camera.rotation, cameraTransform.rotation, 2, delta)



    }
  })


  return (
    <group >
      {overlayState === 3 && < primitive object={model} scale={5} position={[0, 0, 0]} />}


      <mesh position={[0, 1.57, -0.090]} rotation={[0, 0, 0]} ref={planeRef}
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
      <HtmlStudio />




    </group >
  )


}


export default MicrosoftStudio









function zoomCameraToSelection(camera, size, selection) {
  const box = new THREE.Box3()

  box.expandByObject(selection)
  const sizeBox = box.getSize(new THREE.Vector3())
  const center = box.getCenter(new THREE.Vector3())




  const maxSize = Math.max(sizeBox.x, sizeBox.y)

  const fitHeightDistance = maxSize / (2 * Math.atan((Math.PI * camera.fov) / 360))
  const fitWidthDistance = fitHeightDistance / camera.aspect
  const distance = size.width > size.height ? 0.970 * fitWidthDistance : 0.66 * fitHeightDistance
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
