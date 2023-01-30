import { useEffect } from 'react'
import { Grid } from '@react-three/drei'
import { useThree } from '@react-three/fiber'





export function GridFloor() {

  const { gridSize, ...gridConfig } = {
    gridSize: [10.5, 10.5],
    cellSize: 0.5,
    cellThickness: .9,
    cellColor: '#666',
    sectionSize: 3,
    sectionThickness: 1.,
    sectionColor: '#000',
    fadeDistance: 50,
    fadeStrength: 1,
    followCamera: true,
    infiniteGrid: true
  }

  return (
    <Grid position={[0, 0, 0]} args={gridSize} {...gridConfig} />
  )
}
//  
