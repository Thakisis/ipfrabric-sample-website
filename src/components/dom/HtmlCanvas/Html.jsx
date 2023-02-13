import { useEffect, useMemo, useState, useRef } from "react"
import { useStore } from "@/Store"
import { Html, CameraControls, Mask, useMask } from "@react-three/drei"
import { useThree } from "@react-three/fiber"
import { Preloader } from './Preloader'
import { SettingDialog } from "./SettingsDialog"
import gsap from 'gsap'
import style from './Html.module.css'
import * as THREE from 'three'

export function Studio() {

  const { size, camera } = useThree()
  const { height, width, distanceFactor } = getHtmlSize({ size, ratio: { width: 1500, height: 1030 } })
  const MemoPreloader = useMemo(() => {
    return (<Preloader viewport={size}></Preloader>)
  }, [size])





  return (
    <>

      <Html transform distanceFactor={distanceFactor}
        occlude="blending"
        prepend
        castShadow
        receiveShadow
        wrapperClass={style.wrapperHTMLStudio}
        zIndexRange={[2, 3]}
        //style={{ display: "flex", height: `${height}px`, width: `${width}px`, backgroundColor: "pink" }}
        style={{ display: "flex", height: `${height}px`, width: `${width}px`, overflow: "visible", transform: "scale(1.01)" }}
        position={[0, 1.57, -0.096]} rotation={[0, 0, 0]}
      >
        <div className={style.layerA}>
          {MemoPreloader}
        </div>
        <div className={style.layerB}>
          <SettingDialog></SettingDialog>
        </div>

      </Html>
    </>
  )
}

export function MacBook() {
  const { size, camera } = useThree()
  const [cameracontrolState, setCameraControlsState] = useState(false)

  const { elementsPreload } = useStore((state) => ({ elementsPreload: state.ModelsElements.indexOffline }))
  const geom = elementsPreload?.glassScreenStencil.geometry

  const { height, width, distanceFactor } = getHtmlSize({ size, ratio: { width: 1349, height: 840 }, dfBase: .87 })
  const MemoPreloader = useMemo(() => {
    return (<Preloader viewport={size}></Preloader>)
  }, [size])
  const stencil = useMask(1, false)
  const htmlMaterial = <meshPhongMaterial color={0x00000000} blending={THREE.NoBlending} opacity={0} {...stencil} />

  const cameraControl = cameracontrolState ? <CameraControls></CameraControls> : undefined
  return (
    <>

      {cameraControl}
      <Html transform distanceFactor={distanceFactor}
        occlude="blending"
        prepend
        castShadow
        receiveShadow
        wrapperClass={style.wrapperHTML}
        zIndexRange={[2, 3]}
        //style={{ display: "flex", height: `${height}px`, width: `${width}px`, backgroundColor: "pink" }}
        style={{ display: "flex", height: `${height}px`, width: `${width}px`, overflow: "visible", transform: "scale(1.01)" }}
        position={[0, 1.2396, -0.0085]} rotation={[0, 0, 0]}
        material={htmlMaterial}
      >
        <div className={style.layerA}>
          {MemoPreloader}
        </div>
        <div className={style.layerB}>
          <SettingDialog setCameraControls={setCameraControlsState}></SettingDialog>
        </div>

      </Html>
      <group position={[0, 1.2396, -0.0095]}>
        <mesh position={[0, 0, 0]} scale={1}

          geometry={geom}
          visible={false}
        >
          <meshBasicMaterial color="red"></meshBasicMaterial>

        </mesh>

        <Mask id={1} position={[0, 0, 0]} scale={1}
          geometry={geom}
        >

        </Mask>
      </group>




    </>
  )
}












function getHtmlSize({ size, ratio, dfBase }) {
  const { height, width } = size
  const { height: rHeight, width: rWidth } = ratio
  if (width / rWidth > height / rHeight)
    return { width, height: width * rHeight / rWidth, distanceFactor: dfBase * rWidth / width }
  return { width: height * rWidth / rHeight, height, distanceFactor: dfBase * rHeight / height }

}

