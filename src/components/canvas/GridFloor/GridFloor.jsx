import { useEffect } from 'react'
import { Grid } from '@react-three/drei'
import { useThree } from '@react-three/fiber'





export function GridFloor() {

  const { gridSize, ...gridConfig } = {
    gridSize: [10.5, 10.5],
    cellSize: 0.5,
    cellThickness: .9,
    cellColor: '#a2ddff',
    sectionSize: 3,
    sectionThickness: 1.,
    sectionColor: '#ffffff',
    fadeDistance: 25,
    fadeStrength: 1,
    followCamera: false,
    infiniteGrid: true
  }

  return (
    <Grid position={[0, -0.01, 0]} args={gridSize} {...gridConfig} />
  )
}
