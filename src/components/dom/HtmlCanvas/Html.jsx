import { useMemo } from "react"
import { Html, CameraControls } from "@react-three/drei"
import { useThree } from "@react-three/fiber"
import { Preloader } from './Preloader'
import { SettingDialog } from "./SettingsDialog"
import style from './Html.module.css'
export function Studio() {
  const { size, camera } = useThree()
  const { height, width, distanceFactor } = getHtmlSize({ size, ratio: { width: 1500, height: 1030 } })
  const MemoPreloader = useMemo(() => {
    return (<Preloader viewport={size}></Preloader>)
  }, [size])
  return (
    <>
      <CameraControls />
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
  const { height, width, distanceFactor } = getHtmlSize({ size, ratio: { width: 3456, height: 2234 }, dfBase: .336 })
  const MemoPreloader = useMemo(() => {
    return (<Preloader viewport={size}></Preloader>)
  }, [size])
  return (
    <>
      <CameraControls />
      <Html transform distanceFactor={distanceFactor}
        occlude="blending"
        prepend
        castShadow
        receiveShadow
        wrapperClass={style.wrapperHTML}
        zIndexRange={[2, 3]}
        //style={{ display: "flex", height: `${height}px`, width: `${width}px`, backgroundColor: "pink" }}
        style={{ display: "flex", height: `${height}px`, width: `${width}px`, overflow: "visible", transform: "scale(1.01)" }}
        position={[0, 1.2, 0]} rotation={[0, 0, 0]}
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












function getHtmlSize({ size, ratio, dfBase }) {
  const { height, width } = size
  const { height: rHeight, width: rWidth } = ratio
  if (width / rWidth > height / rHeight)
    return { width, height: width * rHeight / rWidth, distanceFactor: dfBase * rWidth / width }
  return { width: height * rWidth / rHeight, height, distanceFactor: dfBase * rHeight / height }

}

function getHtmlSize2({ size, ratio, dfbase = .824 }) {
  const { height, width } = size
  const { height: rHeight, width: rWidth } = ratio
  if (width / rWidth > height / rHeight)
    return { width, height: width * rHeight / rWidth, distanceFactor: .824 * rWidth / width }
  return { width: height * rWidth / rHeight, height, distanceFactor: .824 * rHeight / height }

}

