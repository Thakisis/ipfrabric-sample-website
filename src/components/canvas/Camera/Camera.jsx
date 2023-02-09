import { useRef, useState, useEffect } from 'react'
import { CameraControls, PerspectiveCamera } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from "@/Store"

export const Camera = ({ props }) => {
  const [cameraState, setCameraState] = useState(false)
  const { overlayState } = useStore(state => state.preloadState)
  const cameraControlsRef = useRef()
  const { camera } = useThree()

  useEffect(() => {
    setCameraState(false)
  }, [setCameraState])
  useEffect(() => {
    if (overlayState === 4) {

      if (cameraState) {
        //cameraControlsRef.current?.zoom(-camera.zoom / 2, true)

        //cameraControlsRef.current?.setRotation([0, 0, 0])
      }
      else {
        setCameraState(true)
      }


    }
  }, [cameraControlsRef, overlayState, cameraState, camera])

  return (
    <>
      {overlayState === 4 &&
        <CameraControls
          ref={cameraControlsRef}
          makeDefault
          events={false}

        ></CameraControls>
      }


    </>

  )
}
/*

*/


function Rig({ vec = new THREE.Vector3() }) {
  const lockCamera = true
  useFrame((state) => {

    //state.camera.position.lerp(vec.set(6 + state.pointer.x, 2.5, 10), 0.1)
    if (lockCamera) {
      state.camera.position.set(0, 1.57, 5)
      state.camera.lookAt(0, 1.57, 0)
    }

    //state.camera.lookAt(2.39, 2., 10.56)

  })
}
