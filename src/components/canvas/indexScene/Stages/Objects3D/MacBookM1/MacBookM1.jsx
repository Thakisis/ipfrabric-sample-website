import { useRef, useLayoutEffect, useEffect, useMemo } from "react"
import * as THREE from 'three'
import * as Html from '@/components/dom/HtmlCanvas'
import { useThree, useFrame } from "@react-three/fiber"
import { useControls } from "leva"
import { useStore } from "@/Store"
import { MeshPhongMaterial, MeshStandardMaterial } from "three"

import { easing } from 'maath'


const MacBookM1 = () => {

  const planeRef = useRef()
  const { Models, overlayState, addAnimatedElement, setCameraFit, elements, elementsPreload } = useStore((state) => (
    {
      Models: state.Models,
      modelsTextures: state.ModelsTextures,
      overlayState: state.overlayState,
      addAnimatedElement: state.Actions.addAnimatedElement,
      setCameraFit: state.Actions.setCameraFit,
      elements: state.ModelsElements.macBook,
      elementsPreload: state.ModelsElements.indexOffline

    }
  ))

  const gsSclasreenMaterial = useMemo(() => new MeshStandardMaterial({
    color: 0x00000000,
    transparent: true,
    metalness: 1,
    roughness: 0,
    blending: THREE.CustomBlending,
    blendEquation: THREE.AddEquation,
    blendSrc: THREE.OneMinusSrcColorFactor,
    blendDst: THREE.OneFactor

  }), [])

  useLayoutEffect(() => {
    if (overlayState === 0)
      return


    if (overlayState === 1) {

      const { glassFull: glassFullPreload } = elementsPreload
      glassFullPreload.material = gsSclasreenMaterial
      return
    }
    if (overlayState === 4) {
      console.log(elements)
      const { glassFull } = elements
      glassFull.material = gsSclasreenMaterial

    }
    return () => {


    }
  }, [overlayState])
  const model = Models["macBook"]
  const modelPreload = Models["indexOffline"]
  const { size, camera } = useThree()

  useLayoutEffect(() => {
    if (planeRef.current) {

      //zoomCameraToSelection(camera, size, planeRef.current)
      addAnimatedElement({ plane: { object: planeRef.current, type: "helper" } })
      setCameraFit(planeRef.current, size, camera)
    }
  }, [planeRef, addAnimatedElement, setCameraFit, size, camera])
  const geom = elementsPreload?.glassScreenStencil.geometry
  return (
    <group >

      {overlayState === 4 ? < primitive object={model} scale={1} position={[0, 0, 0]} /> : overlayState > 1 ? < primitive object={modelPreload} scale={1} position={[0, 0, 0]} /> : undefined}
      <mesh position={[0, 1.201, 0]} rotation={[0, 0, 0]} ref={planeRef}
        visible={false}
      >
        <planeGeometry args={[2.9, 1.87]} />
        <meshStandardMaterial color='orange' opacity={1} />
      </mesh>
      <Html.MacBook />







    </group >
  )


}


export default MacBookM1

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
/*----------------------------------------------------------------
if (!elements) return
    const { blendEquation, dst, src, opacity } = blend
    elements.keyText.material = new MeshStandardMaterial({ color: 0x000000, emissive: 0xffffff, emissiveIntensity: 100 })
    elements.glassFull.material = new MeshStandardMaterial({ color: 0xff00ff, transparent: true })
    elements.glassScreen.material.color = new THREE.Color(0xff0000)
    elementsPreload.glassFull.material = new MeshStandardMaterial({ color: 0x00000000, transparent: true, metalness: 1, roughness: 0, transparent: true, opacity: opacity })
    //ºelementsPreload.glassFull.material = new MeshStandardMaterial({ color: 0x000000ff, transparent: true, colorWrite: false, blending: THREE.NoBlending, opacity: 1 })
    const material = elementsPreload.glassFull.material


    material.blending = THREE.CustomBlending
    material.blendEquation = THREE.AddEquation
    material.blendSrc = THREE.OneMinusSrcColorFactor
    material.blendDst = THREE.dstOneFactor
    elementsPreload.glassFull.position.set(0, 0, 0)
    console.log(material)
  */








/* ********************************

 const AddEquation = THREE.AddEquation
  const SubtractEquation = THREE.SubtractEquation
  const ReverseSubtractEquation = THREE.ReverseSubtractEquation
  const MinEquation = THREE.MinEquation
  const MaxEquation = THREE.MaxEquation
  const ZeroFactor = THREE.ZeroFactor
  const OneFactor = THREE.OneFactor
  const SrcColorFactor = THREE.SrcColorFactor
  const OneMinusSrcColorFactor = THREE.OneMinusSrcColorFactor
  const SrcAlphaFactor = THREE.SrcAlphaFactor
  const OneMinusSrcAlphaFactor = THREE.OneMinusSrcAlphaFactor
  const DstAlphaFactor = THREE.DstAlphaFactor
  const OneMinusDstAlphaFactor = THREE.OneMinusDstAlphaFactor
  const DstColorFactor = THREE.DstColorFactor
  const OneMinusDstColorFactor = THREE.OneMinusDstColorFactor
  const SrcAlphaSaturateFactor = THREE.SrcAlphaSaturateFactor

  const blend = useControls("Blending", {
    blendEquation: { value: AddEquation, options: { AddEquation, SubtractEquation, ReverseSubtractEquation, MinEquation, MaxEquation } },
    src: { value: OneMinusSrcColorFactor, options: { ZeroFactor, OneFactor, SrcColorFactor, OneMinusSrcColorFactor, SrcAlphaFactor, OneMinusSrcAlphaFactor, DstAlphaFactor, OneMinusDstAlphaFactor, DstColorFactor, OneMinusDstColorFactor, SrcAlphaSaturateFactor } },
    dst: { value: OneFactor, options: { ZeroFactor, OneFactor, SrcColorFactor, OneMinusSrcColorFactor, SrcAlphaFactor, OneMinusSrcAlphaFactor, DstAlphaFactor, OneMinusDstAlphaFactor, DstColorFactor, OneMinusDstColorFactor } },
    opacity: { value: 1, min: 0, max: 1 }
  })


  */
