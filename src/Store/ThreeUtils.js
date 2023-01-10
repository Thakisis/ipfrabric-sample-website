import * as THREE from 'three'
import InstancedGroupMesh from "three-instanced-group-mesh"
// three modules for load models
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'


export function createLoaders() {

  const loader = new GLTFLoader()
  const dracoLoader = new DRACOLoader()
  dracoLoader.setDecoderPath('/libs/draco/')
  loader.setDRACOLoader(dracoLoader)

  return { gltfloader: loader }
}

export function preloadModels({ stage, stagePreloadData: models, updateLoadStatus: onProgress, completeLoadStatus: onComplete, threeLoaders }) {

  const { gltfloader } = threeLoaders


  models.map((model, index) => {

    const { modelName, modelFile } = model
    gltfloader.loadAsync(`/models/${modelFile}`,
      //progress function
      (xhr) => {
        onProgress({ modelName, stage, index, sizeLoaded: xhr.loaded })
      },
    )
      .then((gltf) => {

        gltf.scene.traverse(function (node) {
          if (node.isMesh) {
            node.castShadow = true
            node.receiveShadow = true

          }

        })
        //onProgress
        //cbLoaded({ index: index, isComplete: true, scene: gltf.scene, modelName: model.Model, stage: model.stage })

      })


  })
  /*
  //iterate Array
  modelsArray.map((model, index) => {
    */






  return

}
