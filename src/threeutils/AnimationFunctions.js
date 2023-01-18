import { getNetworkMatrix } from "./threeutils"


export function animateNetworkIn({
  sceneData,
  parMutation,
  targetMutation,
  debug = true
}) {
  const { model, amount, groupTransform } = sceneData
  /*
    Interpolation need to be adjusted to add the delay between computers.
    This calculation should be done  adding the time children are hidden.
    
    this dilation is the same for each meash and will be passed to getNetworkmatrix
    */

  //const timeDilation =

  //const newRadius = clamp(par.radius, 0, 3)
  //const newAngle = clamp(par.angle, 0, 100)
  const newRadius = parMutation.radius
  const newAngle = parMutation.angle
  const maxRadius = targetMutation.radius
  const maxAngle = targetMutation.angle

  //if (par.radius !== newRadius && newAngle !== par.angle)
  //  return

  const MatrixArray = groupTransform.map((position, index) => getNetworkMatrix({ amount: 5, radius: newRadius, angle: newAngle, scale: .8, groupTransform: position, maxRadius, maxAngle })).flat()

  model.children.map(mesh => {
    MatrixArray.map((matrix, index) => {
      mesh.setMatrixAt(index, matrix)
    })
    mesh.instanceMatrix.needsUpdate = true
  })


}

