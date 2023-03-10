import create from 'zustand'
import { mountStoreDevtool } from 'simple-zustand-devtools'
import { preloadModels, createNetworkInstances, preloadTextures, prepareModels } from '@/threeutils'
import { ModelsList } from './ModelsList'





export const useStore = create((set, get) => ({


  preloadState: { overlayState: 0 },
  preloadModelState: { percentLoaded: 0 },

  animations: {},
  Models: {},
  ModelsElements: {},
  ModelsLoaded: {},
  customScenes: {},
  customTextures: {},
  Instances: {},
  threeState: undefined,
  customMaterials: {},
  isStore: false,
  StagesState: { entering: -1, inside: -1, leaving: -1, phaseIn: 0 },
  Actions: {

    // start preload of stage 0
    initPreload() {

      const { onUpdateLoad, onCompleteLoad } = get().Actions
      const { gl } = get().threeState
      // call a function for load all models passing two callbacks one for progres on percent of load and other for event load complete
      const initialPreloadState = preloadModels({ onUpdateLoad, onCompleteLoad, gl })

      //Initialize global preloadstate from data in ModelList
      set(({ preloadState }) => ({ preloadState: { ...initialPreloadState, filesLoaded: 0, sizeLoaded: 0, percentLoaded: 0, overlayState: 2 } }))

      // create Object with all models where the name of model become the key of each model object
      const ModelObj = ModelsList.reduce((acum, model) => {
        return ({ ...acum, [model.modelName]: { ...model, sizeLoaded: 0 } })
      }, {})

      // initialize preload state of models 
      set(() => ({ preloadModelState: { ...ModelObj } }))

    },
    setThree(three) {
      const { gl } = three
      //      preloadTextures({ gl })
      //Component GetScene is rendered when Scene3D is created and call this function to store scene, gl for precompilation, cameraq ...
      set(() => ({ threeState: { ...three } }))

    },

    //set overlayState
    setOverlay(value) {
      set(({ preloadState }) => ({ preloadState: { ...preloadState, overlayState: value } }))
    },

    onUpdateLoad({ modelName, sizeLoaded }) {
      //callback when loader notify progress update
      // update each model with the bytes loaded total was stored previously
      set(({ preloadModelState }) => (
        {
          preloadModelState: { ...preloadModelState, [modelName]: { ...preloadModelState[modelName], sizeLoaded: sizeLoaded } }
        }))
      const preloadModelState = get().preloadModelState

      // calculate total of bytes loaded and total size of all models to calculate percentage
      // Number of files loaded will be calculated when  onComplete call back
      const newPreloadState = Object.values(preloadModelState).reduce((acum, model) => {
        const { filesTotal, sizeTotal, sizeLoaded } = acum
        const newSizeLoaded = { filesTotal: filesTotal + 1, sizeTotal: sizeTotal + model.sizeTotal, sizeLoaded: sizeLoaded + model.sizeLoaded }
        const percentLoaded = newSizeLoaded.sizeLoaded / newSizeLoaded.sizeTotal * 100
        return ({ ...newSizeLoaded, percentLoaded: percentLoaded })
      }
        , { filesTotal: 0, sizeTotal: 0, sizeLoaded: 0, percentLoaded: 0 })
      set(({ preloadState }) => ({ preloadState: { ...preloadState, ...newPreloadState, } }))



    },

    onCompleteLoad({ scene, modelName, transform }) {
      //store all models as loaded


      set(({ ModelsLoaded }) => ({ ModelsLoaded: { ...ModelsLoaded, [modelName]: { scene, transform } } }))
      const updatedModelsLoaded = get().ModelsLoaded

      const totalModelsLoaded = Object.keys(updatedModelsLoaded).length
      set(({ preloadState }) => ({
        preloadState: {
          ...preloadState,
          filesLoaded: totalModelsLoaded, overlayState:
            preloadState.filesTotal === totalModelsLoaded ? 3 : preloadState.overlayState
        }
      }))

    },

    compileModels() {
      //prepare models for screne and add to renderer to compile and avoid stutter on add model to scene
      const ModelsLoaded = get().ModelsLoaded
      const { scene, camera, gl } = get().threeState
      const { models, elements } = prepareModels(ModelsLoaded, scene, camera, gl)

      set(() => ({ Models: models, ModelsElements: elements }))
      set(({ preloadState }) => ({ preloadState: { ...preloadState, overlayState: 4 } }))

    }
    ,
    onLoadModelSideEffect({ modelLoaded, modelName }) {

      if (modelName === "computer") {
        const positionArray = [[0, 0, 0], [3, 0, 3]]
        const { scene, gl, camera } = get().threeState
        const newInstance = createNetworkInstances({ positionArray, computersInNetwork: 5, model: modelLoaded, scene })
        scene.add(newInstance.model)
        gl.compile(scene, camera)
        scene.remove(newInstance.model)
        set(({ Instances }) => ({ Instances: { ...Instances, ["Network"]: { ...newInstance } } }))

        return
      }
      if (modelName === "ipfabric") {
        const nodes = {}
        const materials = {}
        modelLoaded.traverse(function (node) {

          if (node.isMesh) {

            if (node.name === "Center") {
              const { customMaterials } = get()
              node.material = customMaterials.glass
            }


            node.castShadow = true
            node.receiveShadow = true
            nodes[node.name] = node
            materials[node.material.name] = node.material

          }
        })
        set(({ customScenes }) => ({ customScenes: { ...customScenes, [modelName]: { nodes, materials } } }))
        // Materials gltf are used for load materials from blender for use in extrusion and other objects
      }

      if (modelName === "textureContainer") {
        const textures = {}
        modelLoaded.traverse(function (node) {

          if (node.isMesh) {
            textures[node.material.name] = node.material.map
          }


        })
        set(() => ({ customTextures: { ...textures } }))
      }


    },

    setStage({ stage, transitionStage }) {

      set(({ StagesState }) => {
        if (transitionStage === 1)
          return ({ StagesState: { entering: stage, inside: -1, leaving: -1, phaseIn: 0 } })
        if (transitionStage === -1)
          return ({ StagesState: { ...StagesState, entering: stage, inside: StagesState.in, leaving: StagesState.in } })
        return ({ StagesState: { ...StagesState, entering: -1, inside: stage, leaving: -1, phaseIn: 1 } })


      })

    },

    addMaterial({ materials }) {
      set(({ customMaterials }) => ({ customMaterials: { ...customMaterials, ...materials } }))
    },


  }
}))








if (process.env.NODE_ENV === 'development') {
  mountStoreDevtool('Store', useStore)
}

