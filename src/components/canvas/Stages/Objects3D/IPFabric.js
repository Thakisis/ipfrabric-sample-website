const IPFabric = ({ model }) => {



  return (
    <group>
      <primitive object={model} scale={1}></primitive>
    </group>
  )


}

export default IPFabric

const message = 'Hello world' // Try edit me

// Update header text
document.querySelector('#header').innerHTML = message

// Log to console
console.log(message)


function crearMatrix(n) {
  return Array.from({ length: n }, () =>
    Array.from({ length: n }, () => 0).fill(0)
  )
}


function crearMEspiral(matrix) {

  const middlePoint = { x: Math.floor(matrix.length / 2), y: Math.floor(matrix.length / 2) }

  const result = iterateMatrix({ matrix, position: middlePoint, index: 1, direction: 0 })

}
function iterateMatrix(props) {
  const { matrix, position, index, direction } = props


  const directions = [{ x: 0, y: 1 }, { x: 1, y: 0 }, { x: 0, y: -1 }, { x: -1, y: 0 }]

  const { x, y } = position
  matrix[x][y] = index

  let validDirection = false
  let checkDirection = direction
  let newPos
  let vcheckDir
  while (!validDirection) {

    vcheckDir = directions[checkDirection]
    checkDirection = (checkDirection + 1) % 4

    newPos = { x: vcheckDir.x + position.x, y: vcheckDir.y + position.y, }

    console.log(matrix[newPos.x])
    if (matrix[newPos.x][newPos.y] !== undefined && matrix[newPos.x][newPos.y] === 0)
      validDirection = checkDirection
    else if (validDirection === direction + 3) {
      //console.log("error")
      validDirection = -1
      return matrix
    }
    console.log(matrix[newPos.x][newPos.y])

  }
  console.log(validDirection)


  iterateMatrix({ matrix, position: newPos, index: index + 1, direction: validDirection })
}



crearMEspiral(crearMatrix(5))
