import { useMemo } from "react"
import { Html } from "@react-three/drei"
import { useThree } from "@react-three/fiber"
import { Preloader } from './Preloader'
import { SettingDialog } from "./SettingsDialog"
import style from './Html.module.css'
export function HtmlStudio() {
  const { size, camera } = useThree()
  const { height, width, distanceFactor } = getHtmlSize(size)
  const MemoPreloader = useMemo(() => {
    return (<Preloader viewport={size}></Preloader>)
  }, [size])
  return (
    <Html transform distanceFactor={distanceFactor}
      occlude="blending"
      prepend
      castShadow
      receiveShadow
      wrapperClass={style.wrapperHTMLStudio}
      zIndexRange={[2, 3]}
      //style={{ display: "flex", height: `${height}px`, width: `${width}px`, backgroundColor: "pink" }}
      style={{ display: "flex", height: `${height}px`, width: `${width}px`, overflow: "hidden" }}
      position={[0, 1.57, -0.096]} rotation={[0, 0, 0]}
    >

      <div className={style.layerA}>
        {MemoPreloader}
      </div>
      <div className={style.layerB}>
        <SettingDialog></SettingDialog>
      </div>

    </Html>)
}



function getHtmlSize({ height, width }) {

  if (width / 1500 > height / 1030)
    return { width, height: width * 1030 / 1500, distanceFactor: .824 * 1500 / width }
  return { width: height * 1500 / 1030, height, distanceFactor: .824 * 1030 / height }

}
