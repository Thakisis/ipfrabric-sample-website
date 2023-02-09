import { useRef, useLayoutEffect } from "react"

import * as Html from '@/components/dom/HtmlCanvas'
import { useThree, useFrame } from "@react-three/fiber"
import { useControls } from "leva"
import { useStore } from "@/Store"

import { easing } from 'maath'


const MacBookM1 = () => {
  const planeRef = useRef()
  const { Models, overlayState, addAnimatedElement, setCameraFit } = useStore((state) => (
    {
      Models: state.Models,
      modelsTextures: state.ModelsTextures,
      overlayState: state.overlayState,
      addAnimatedElement: state.Actions.addAnimatedElement,
      setCameraFit: state.Actions.setCameraFit

    }
  ))

  const model = Models["macBook"]
  const { size, camera } = useThree()

  useLayoutEffect(() => {
    if (planeRef.current) {

      //zoomCameraToSelection(camera, size, planeRef.current)
      addAnimatedElement({ plane: { object: planeRef.current, type: "helper" } })
      setCameraFit(planeRef.current, size, camera)
    }
  }, [planeRef, addAnimatedElement, setCameraFit, size, camera])

  return (
    <group >

      {overlayState === 4 && < primitive object={model} scale={1} position={[0, 0, 0]} />}
      <mesh position={[0, 1.201, .001]} rotation={[0, 0, 0]} ref={planeRef}
        visible={false}
      >
        <planeGeometry args={[2.9, 1.87]} />
        <meshStandardMaterial color='orange' opacity={0} />
      </mesh>
      <Html.MacBook />
      {overlayState === 4 && <DebugCamera></DebugCamera>}
    </group >
  )


}


export default MacBookM1



//1080p <planeGeometry args={[2.9, 1.476]} />

function DebugCamera() {
  const { camera } = useThree()

  const cameraTransform = useControls("Camera", {
    position: { value: [2.32, 1.39, 5.44], step: .01 },
    rotation: { value: [-0.11, 0.629, 0.039], step: 0.01 },
  })


  useFrame((state, delta) => {


    easing.damp3(state.camera.position, cameraTransform.position, 2, delta)
    easing.damp3(state.camera.rotation, cameraTransform.rotation, 2, delta)

  })
  return (undefined)

}








