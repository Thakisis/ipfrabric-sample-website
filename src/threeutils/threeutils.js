import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { ModelsList, TextureList } from '@/Store/ModelsList'
import InstancedGroupMesh from 'three-instanced-group-mesh'



const gltfloader = new GLTFLoader()
const dracoLoader = new DRACOLoader()
const ktx2Loader = new KTX2Loader()

//load models of a certain stage. Need a callback for onUpdate for preloaders and other for onComplete for store scenes and materials
export function preloadModels({ ModelsList, onUpdateLoad, onCompleteLoad, gl }) {
  dracoLoader.setDecoderPath('/libs/draco/')
  gltfloader.setDRACOLoader(dracoLoader)
  ktx2Loader.setTranscoderPath('/libs/basis/')
  ktx2Loader.detectSupport(gl)
  gltfloader.setKTX2Loader(ktx2Loader)


  const Models = {}
  const ResultLoader = ModelsList.map((model, index) => {

    const { modelName, modelFile, type, ...transform } = model

    gltfloader.loadAsync(`/models/${modelFile}`,
      //progress function
      (xhr) => {
        onUpdateLoad({ modelName, index, sizeLoaded: xhr.loaded })
      },
    )
      .then((gltf) => {
        // activate shadows on models


        onCompleteLoad({ scene: gltf.scene, modelName, transform, type })
        //onCompleteLoadModel({ modelName, scene: gltf.scene, stage, materials })
      })

    return
  })

  return { dracoLoader, ktx2Loader, gltfloader }
}

export function prepareModels({ ModelsLoaded, scene, camera, gl }) {
  const models = {}
  const elements = {}
  let textures = {}
  Object.entries(ModelsLoaded).map(([modelName, model]) => {
    if (model.type === "textures") {
      textures = { ...textures, ...getTexturesScene(model) }
      return
    }

    model.scene.traverse(function (node) {

      if (node.name.startsWith("Ref")) {
        elements[modelName] = { ...elements[modelName], [node.name.substring(4)]: node }


      }
      if (node.isMesh) {


        node.castShadow = true
        node.receiveShadow = true
        return
      }
      if (node.isGroup)
        return
    })


    scene.add(model.scene)
    gl.compile(scene, camera)
    applyTransform({ obj: model.scene, transform: model.transform })
    models[modelName] = model.scene
  })


  return { models, elements, textures }
}

// used for load textures from the gltfContaining the textures
function getTexturesScene(model) {
  const textures = {}
  model.scene.traverse(function (node) {
    if (node.isMesh) {
      node.castShadow = true
      node.receiveShadow = true
      //todo ear all maps
      const texture = node.material.map

      textures[node.material.map.name] = texture

    }

  })
  return textures
}

// calculate camera position on preloader to make html element fit the viewport
export function zoomCameraToSelection(camera, size, selection) {
  //create a box 3 to calculate dimensions
  const box = new THREE.Box3()
  box.expandByObject(selection)
  const sizeBox = box.getSize(new THREE.Vector3())
  const center = box.getCenter(new THREE.Vector3())
  //take the min of the dimensiones x and y to make it cover the viewport
  const maxSize = Math.min(sizeBox.x, sizeBox.y)
  //caculate the distance for width and height 
  const fitHeightDistance = maxSize / (2 * Math.atan((Math.PI * camera.fov) / 360))
  const fitWidthDistance = fitHeightDistance / camera.aspect

  // apply value based on aspecratio lower or greated than 1
  const distance = size.width > size.height ? fitWidthDistance : fitHeightDistance
  //position camera
  camera.position.set(center.x, center.y, distance + center.z)
  //makeit look to center of screen
  camera.lookAt(center.x, center.y, 0)




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
// clamp two number in a interval if number is lower than min then min will be returned if number is higher than max then  return max 
export function clamp(num, min, max) { return Math.min(Math.max(num, min), max) }

// get matrix transform of all computer instances
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




// create all computer of all networks
export function createNetworkInstances({ positionArray, computersInNetwork, model }) {


  const transformArray = positionArray.map((position) => getNetworkTransform({ amount: computersInNetwork, radius: 0, angle: 0, scale: 0, groupTransform: position })).flat()

  const Network = createInstances({ model, instanceName: "Network", transformArray, modelName: "computer", groupTransform: positionArray })

  return ({ ...Network, instanceName: "Network", amount: computersInNetwork })

}





















export function prepareModels2(scenes, mainScene, camera, gl) {
  const models = {}
  const elements = {}
  const textures = getTexturesScene(scenes["textures"].scene)
  Object.entries(scenes).map(([modelName, model]) => {
    if (modelName === "textures")
      return
    model.scene.traverse(function (node) {
      if (node.isMesh) {

        node.castShadow = true
        node.receiveShadow = true
        if (node.name.startsWith("Repl")) {
          elements[modelName] = { ...elements[modelName], [node.name.substring(4)]: node }
        }
        if (node.name === "Screen-Back") {
          console.log(node.material)
          node.material.roughnessMap = textures["BackMonitorBW"]
          node.material.metallness = 1

          node.material.needsUpdate = true

        }
        return
      }
      if (node.isGroup)
        return

      if (node.name.startsWith("Gri")) {

        elements[modelName] = { ...elements[modelName], [node.name.substring(3)]: node }
      }
    })

    applyTransform({ obj: model.scene, transform: model.transform })
    mainScene.add(model.scene)
    models[modelName] = model.scene

  })

  gl.compile(mainScene, camera)

  return { models, elements, textures }
  //Some Models need materials to be replacer with r3f mats


  // add loaded object to the scene avoid stutters later when added but can cause freeze on canvas
  // but preloaded is still active
  //onLoadModelSideEffect({ modelLoaded: Object3d, modelName })
  //scene.add(Object3d)
  //gl.compile(scene, camera)
  //scene.remove(Object3d)
  // When all load and compilation is complete is when preloader dissaper so we count completed load here 
  /*
  if (modelName === "IPFabric") {
    const center = Object3d.getObjectByName('Center')
    center.material = customMaterials["glass"]
  }
  const nodes = []
  gltf.scene.traverse(function (node) {

    if (node.isMesh) {
      const groupName = node.name.split("-")[1]

      node.castShadow = true
      node.receiveShadow = true
      nodes.push(node)

    }


  })*/
}
