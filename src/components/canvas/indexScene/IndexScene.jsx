import { useEffect, Suspense } from "react"
import { GridFloor } from "./GridFloor"
import { OrbitControls } from '@react-three/drei'

import { Stages } from './Stages'
export function IndexScene() {


  return (
    <>
      <color attach="background" args={['#252530']} />
      <Stages></Stages>
      <Suspense>

      </Suspense>
    </>
  )

}

//      <GridFloor></GridFloor>
