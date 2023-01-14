import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { ModelsList } from '@/Store/ModelsList'
import { Materials } from './CustomMaterials'

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

        gltf.scene.traverse(function (node) {

          if (node.isMesh) {
            node.castShadow = true
            node.receiveShadow = true
            // Materials gltf are used for load materials from blender for use in extrusion and other objects
          }


        })
        onCompleteLoad({ Object3d: gltf, modelName, transform })
        //onCompleteLoadModel({ modelName, scene: gltf.scene, stage, materials })
      })

    return
  })

  return
}

export function getMatrix(transformArray) {
  const dummy = new THREE.Object3D()
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

export function createMeshTransmisionMaterial(params) {

  const defaultParams = {
    clearcoat: 1,
    clearcoatRoughness: 0,
    transmission: 1,
    chromaticAberration: 0.03,
    anisotropy: 0.1,
    // Set to > 0 for diffuse roughness
    roughness: 0,
    thickness: 4.5,
    ior: 1.5,
    // Set to > 0 for animation
    distortion: 0.1,
    distortionScale: 0.2,
    temporalDistortion: 0.2
  }
  const material = Object.assign(new Materials.MeshTransmissionMaterial(10), { ...defaultParams, params })
  return material


}
