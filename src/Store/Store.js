import create from 'zustand'
import { mountStoreDevtool } from 'simple-zustand-devtools'
import { preloadModels, setMatrix, createNetworkInstances } from '@/threeutils'
import { ModelsList } from './ModelsList'

export const useStore = create((set, get) => ({

  //PreloadState contains objects fileLoadState,stageLoadState, sceneLoadState
  preloadState: { overlayState: 0 },
  preloadModelState: { overlayState: 0, percentLoaded: 0 },
  animations: {},
  Models: {},
  nodes: {},
  Instances: {},
  threeState: {},
  customMaterials: {},
  isStore: false,
  StagesState: { entering: -1, inside: -1, leaving: -1, phaseIn: 0 },
  Actions: {

    // start preload of stage 0
    initPreload() {

      const { onUpdateLoad, onCompleteLoad, createTimeLines } = get().Actions

      // call a function for load all models passing two callbacks one for progres on percent of load and other for event load complete
      const initialPreloadState = preloadModels({ onUpdateLoad, onCompleteLoad })

      //Initialize global preloadstate from data in ModelList
      set(({ preloadState }) => ({ preloadState: { ...initialPreloadState, filesTotal: 0, filesLoaded: 0, sizeTotal: 0, sizeLoaded: 0, percentLoaded: 0, overlayState: 1 } }))

      // create Object with all models where the name of model become the key of each model object
      const ModelObj = ModelsList.reduce((acum, model) => {
        return ({ ...acum, [model.modelName]: { ...model, sizeLoaded: 0 } })
      }, {})

      // initialize preload state of models 
      set(() => ({ preloadModelState: { ...ModelObj } }))

    },
    createTimeLines() {
      const timelines = getTimeLines()

      set(() => ({ animations: timelines }))
    },
    setThree(three) {

      //Component GetScene is rendered when Scene3D is created and call this function to store scene, gl for precompilation, cameraq ...
      set(() => ({ threeState: { ...three } }))
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


        return ({ ...newSizeLoaded, overlayState: newSizeLoaded.sizeLoaded >= newSizeLoaded.sizeTotal ? 2 : 1, percentLoaded: percentLoaded })
      }
        , { filesTotal: 0, sizeTotal: 0, sizeLoaded: 0, percentLoaded: 0 })
      set(({ preloadState }) => ({ preloadState: { ...preloadState, ...newPreloadState, } }))



    },
    onCompleteLoad({ Object3d, modelName, transform }) {
      //New object 3D is added to Models
      set(({ Models }) => ({ Models: { ...Models, [modelName]: Object3d } }))

      //Some materials era easyer o exclusive of R3f
      const { preloadState, customMaterials, Models, threeState } = get()
      const { gl, scene, camera } = threeState

      //Apply default transform of each model
      const { position, scale, rotation } = transform
      setMatrix({ Object3d: Object3d, transform })

      //Some Models need materials to be replacer with r3f mats
      if (modelName === "IPFabric") {
        const center = Object3d.getObjectByName('Center')
        center.material = customMaterials["glass"]
      }

      // add loaded object to the scene avoid stutters later when added but can cause freeze on canvas
      // but preloaded is still active
      scene.add(Object3d)
      gl.compile(scene, camera)
      scene.remove(Object3d)
      // When all load and compilation is complete is when preloader dissaper so we count completed load here 
      const totalModelsLoaded = Object.keys(Models).length
      set(({ preloadState }) => ({
        preloadState: {
          ...preloadState,
          filesLoaded: totalModelsLoaded, overlayState:
            preloadState.filesTotal === totalModelsLoaded ? 3 : preloadState.overlayState
        }
      }))
      const { onLoadModelSideEffect } = get().Actions
      onLoadModelSideEffect({ modelLoaded: Object3d, modelName })
    },
    onLoadModelSideEffect({ modelLoaded, modelName }) {

      if (modelName === "computer") {
        const positionArray = [[0, 0, 0], [3, 0, 3]]
        const { scene, gl, camera } = get().threeState
        const newInstance = createNetworkInstances({ positionArray, computersInNetwork: 5, model: modelLoaded, scene })
        scene.add(newInstance.model)
        gl.compile(scene, camera)
        scene.remove(newInstance.model)



        set(({ Instances }) => ({ Instances: { ...Instances, ["Network"]: { ...newInstance } } }))


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

