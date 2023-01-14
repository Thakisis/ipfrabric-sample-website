import create from 'zustand'
import { mountStoreDevtool } from 'simple-zustand-devtools'
import { preloadModels, setMatrix, createMeshTransmisionMaterial } from '@/ThreeUtils'
import { ModelsList } from './ModelsList'

export const useStore = create((set, get) => ({

  //PreloadState contains objects fileLoadState,stageLoadState, sceneLoadState
  preloadState: { overlayState: 0 },
  preloadModelState: {},
  Models: {},
  threeState: {},
  customMaterials: {},
  isStore: false,
  Actions: {

    // start preload of stage 0
    initPreload() {
      const { onUpdateLoad, onCompleteLoad } = get().Actions

      // call a function for load all models passing two callbacks one for progres on percent of load and other for event load complete
      const initialPreloadState = preloadModels({ onUpdateLoad, onCompleteLoad })

      //Initialize global preloadstate from data in ModelList
      set(({ preloadState }) => ({ preloadState: { ...initialPreloadState, filesTotal: 0, filesLoaded: 0, sizeTotal: 0, sizeLoaded: 0, overlayState: 1 } }))

      // create Object with all models where the name of model become the key of each model object
      const ModelObj = ModelsList.reduce((acum, model) => {
        return ({ ...acum, [model.modelName]: { ...model, sizeLoaded: 0 } })
      }, {})

      // initialize preload state of models 
      set(() => ({ preloadModelState: { ...ModelObj } }))
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


        return ({ ...newSizeLoaded, overlayState: newSizeLoaded.sizeLoaded >= newSizeLoaded.sizeTotal ? 2 : 1 })
      }
        , { filesTotal: 0, sizeTotal: 0, sizeLoaded: 0 })
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
      setMatrix({ Object3d: Object3d.scene, transform })

      //Some Models need materials to be replacer with r3f mats
      if (modelName === "IPFabric") {
        const center = Object3d.getObjectByName('Center')
        center.material = customMaterials["glass"]
      }

      // add loaded object to the scene avoid stutters later when added but can cause freeze on canvas
      // but preloaded is still active
      scene.add(Object3d.scene)
      gl.compile(scene, camera)
      scene.remove(Object3d.scene)
      // When all load and compilation is complete is when preloader dissaper so we count completed load here 
      const totalModelsLoaded = Object.keys(Models).length
      set(({ preloadState }) => ({
        preloadState: {
          ...preloadState,
          filesLoaded: totalModelsLoaded, overlayState:
            preloadState.filesTotal === totalModelsLoaded ? 3 : preloadState.overlayState
        }
      }))
    },

    addMaterial({ materials }) {

      set(({ customMaterials }) => ({ customMaterials: { ...customMaterials, ...materials } }))
    },


  }
}))








if (process.env.NODE_ENV === 'development') {
  mountStoreDevtool('Store', useStore)
}

