import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { ModelsList } from '@/Store/ModelsList'
import InstancedGroupMesh from 'three-instanced-group-mesh'

//load models of a certain stage. Need a callback for onUpdate for preloaders and other for onComplete for store scenes and materials
export function preloadModels({ onUpdateLoad, onCompleteLoad }) {

  const gltfloader = new GLTFLoader()
  const dracoLoader = new DRACOLoader()
  dracoLoader.setDecoderPath('/libs/draco/')
  gltfloader.setDRACOLoader(dracoLoader)

  const Models = {}
  const ResultLoader = ModelsList.map((model, index) => {

    const { modelName, modelFile, ...transform } = model

    gltfloader.loadAsync(`/models/${modelFile}`,
      //progress function
      (xhr) => {
        onUpdateLoad({ modelName, index, sizeLoaded: xhr.loaded })

      },
    )
      .then((gltf) => {
        // activate shadows on models
        const nodes = []
        gltf.scene.traverse(function (node) {

          if (node.isMesh) {

            node.castShadow = true
            node.receiveShadow = true
            nodes.push(node)

            // Materials gltf are used for load materials from blender for use in extrusion and other objects
          }


        })

        const group = new THREE.Group()
        nodes.map((node) => {
          group.add(node)
        })

        onCompleteLoad({ Object3d: group, modelName, transform, nodes })
        //onCompleteLoadModel({ modelName, scene: gltf.scene, stage, materials })
      })

    return
  })

  return
}
// function to get Matrix from a transfrom Objec{position[3],rotation[3],scale[3]}
export function getMatrix(transformArray) {
  const dummy = new THREE.Object3D()

  if (transformArray === 1)
    return dummy.matrix
  if (transformArray === 0) {
    dummy.scale.set(0, 0, 0)
    dummy.updateMatrix()
    return dummy.matrix
  }
  const { position, rotation, scale } = transformArray

  if (position)
    dummy.position.set(position[0], position[1], position[2])
  if (rotation)
    dummy.rotation.set(rotation[0], rotation[1], rotation[2])
  if (scale)
    dummy.scale.set(scale[0], scale[1], scale[2])
  dummy.updateMatrix()
  return dummy.matrix

}

//function to get matrix of a given object
export function setMatrix({ Object3d, transform }) {
  if (!transform || !Object3d)
    return
  const { position, rotation, scale } = transform

  if (position)
    Object3d.position.set(position[0], position[1], position[2])
  if (rotation)
    Object3d.rotation.set(rotation[0], rotation[1], rotation[2])
  if (scale)
    Object3d.scale.set(scale[0], scale[1], scale[2])
  return

}


//apply a transform to a three object
export function applyTransform({ obj, transform, debug }) {

  const { position, rotation, scale } = transform
  if (debug) {

  }
  if (position)
    obj.position.set(position[0], position[1], position[2])
  if (rotation)
    obj.rotation.set(rotation[0], rotation[1], rotation[2])
  if (scale)
    obj.scale.set(scale[0], scale[1], scale[2])
  obj.updateMatrix()
  obj.matrixWorldNeedsUpdate = true
  return
}

//create n instances of an object from a matrix of transforms 
export function createInstances({ model, instanceName, transformArray, modelName, groupTransform }) {

  //dummy object to get coordinates

  const amount = transformArray.length

  const instancedModel = new InstancedGroupMesh(model, amount)
  instancedModel.castShadow = true
  instancedModel.receiveShadow = true

  // calculate matrix of each mesh
  transformArray.map((transform, index) => {
    instancedModel.setMatrixAt(index, getMatrix(transform))
  })
  Object.values(instancedModel.instanceCollect).map(mesh => {
    mesh.castShadow = true
    mesh.receiveShadow = true
  })
  // return the object contain information needed for animation
  return {
    model: instancedModel, transformArray, instanceOf: modelName, groupTransform
  }
}

// calculate transform a group of equidistant computers forming a cirlce
export function getNetworkTransform({
  amount,      // amount of machines per network
  radius = 0,  // radius of actual transform
  angle = 0,   // angle of actual transform
  scale = 0,   // scale of actual transform
  groupTransform = [0, 0, 0],  // position of each network

  maxAngle = Infinity,    // maxiumum angle for all instances
  maxRadius = 2,   // radius max of all instances
  delay = .2,       // will be used to add angle and radius negative and positive to displace animation



}) {
  const transformArray = new Array(amount).fill(0).map((value, index) => {
    //offset of angle when distribute is true
    let finalAngle = angle - Math.PI * 2 / amount * index * delay
    let finalRadius = radius - index * delay
    const newRadius = clamp(finalRadius, 0, radius)
    const newScale = clamp(scale * newRadius / maxRadius, 0, scale)

    const positionX = newRadius * Math.sin(Math.PI * 2 / amount * index + finalAngle) + groupTransform[0]
    const positionY = newRadius * Math.cos(Math.PI * 2 / amount * index + finalAngle) + groupTransform[2]
    const transform = {
      position: [positionX, groupTransform[1], positionY],
      rotation: [0, finalAngle, 0],
      scale: [newScale, newScale, newScale]
    }

    return transform
  })
  return transformArray
}

export function clamp(num, min, max) { return Math.min(Math.max(num, min), max) }


export function getNetworkMatrix({
  amount,      // amount of machines per network
  radius = 0,  // actual radius
  angle = 0,   // angle of actual transform
  scale = 0,   // scale of actual transform
  maxRadius = 0,  // radius where computer stop moving away from center 
  maxAngle = 0,
  groupTransform = [0, 0, 0],  // position of each network
  delay = .2,       // number will be units in delay in the radius

}) {
  //the newradius will be adding extra radius give time for all computer to reach the final radius
  const newMaxRadius = maxRadius + ((amount - 1) * delay)
  const offset = delay * maxRadius / newMaxRadius
  const transformArray = new Array(amount).fill(0).map((value, index) => {
    const newRadius = (radius - offset * index) * newMaxRadius / maxRadius
    const finalRadius = clamp(newRadius, 0, maxRadius)
    const newScale = finalRadius / newMaxRadius * scale
    const finalAngle = (angle + Math.PI * 2 / amount * index) * radius / maxRadius
    const positionX = finalRadius * Math.sin(finalAngle) + groupTransform[0]
    const positionY = finalRadius * Math.cos(finalAngle) + groupTransform[2]
    const transform = {
      position: [positionX + groupTransform[0], groupTransform[1], positionY + groupTransform[2]],
      rotation: [0, finalAngle, 0],
      scale: [newScale, newScale, newScale],
    }
    return (getMatrix(transform))
  })
  return transformArray
}




export function getNetworkMatrix2({ amount, radius = 0, angle = 0, scale = 0, groupTransform = [0, 0, 0] }) {
  const matrixArray = new Array(amount).fill(0).map((value, index) => {

    const positionX = radius * Math.sin(Math.PI * 2 / amount * index + angle) + groupTransform[0]
    const positionY = radius * Math.cos(Math.PI * 2 / amount * index + angle) + groupTransform[2]
    const transform = {
      position: [positionX, groupTransform[1], positionY],
      rotation: [0, angle + Math.PI * 2 / amount * index, 0],
      scale: [scale, scale, scale]
    }
    return (getMatrix(transform))
  })

  return matrixArray
}







export function createNetworkInstances({ positionArray, computersInNetwork, model }) {


  const transformArray = positionArray.map((position) => getNetworkTransform({ amount: computersInNetwork, radius: 0, angle: 0, scale: 0, groupTransform: position })).flat()

  const Network = createInstances({ model, instanceName: "Network", transformArray, modelName: "computer", groupTransform: positionArray })

  return ({ ...Network, instanceName: "Network", amount: computersInNetwork })

}







export function getNetworkTransform2({ amount, radius = 0, angle = 0, scale = 0, groupTransform = [0, 0, 0] }) {
  const transformArray = new Array(amount).fill(0).map((value, index) => {

    const positionX = radius * Math.sin(Math.PI * 2 / amount * index + angle) + groupTransform[0]
    const positionY = radius * Math.cos(Math.PI * 2 / amount * index + angle) + groupTransform[2]
    const transform = {
      position: [positionX, groupTransform[1], positionY],
      rotation: [0, angle + Math.PI * 2 / amount * index, 0],
      scale: [scale, scale, scale]
    }
    return transform
  })

  return transformArray
}
