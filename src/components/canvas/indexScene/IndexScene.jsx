import { useEffect } from "react"
import { GridFloor } from "./GridFloor"
import { OrbitControls } from '@react-three/drei'
import { Stages } from './Stages'
export function IndexScene() {


  return (
    <>
      <color attach="background" args={["white"]} />
      <Stages></Stages>

    </>
  )

}

//      <GridFloor></GridFloor>
