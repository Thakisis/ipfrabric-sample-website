import { preloadModels, createNetworkInstances, preloadTextures, prepareModels } from '@/threeutils'

export const threeStore = (set, get) => ({

  //Models prepared
  Models: {},
  //Model exactly how it was loaded
  ModelsLoaded: {},
  //refereces to relevant Object3D
  ModelsElements: {},
  //textures for models loaded from textures.glb
  ModelsTextures: {},
  //Models instanced
  Instances: {},
  // Rendered information provided by useThree
  threeState: undefined,
  storeActions: {
    initPreload(ModelsList) {
      const { onUpdateLoad, onCompleteLoad } = get().Actions
      const Models = get().Models

      // remove models shared already loaded by other routes or in previous render of the router
      const ModelsNeeded = ModelsList.filter(model => Models[model.modelName] === undefined)
      set(({ Loading }) => ({
        Loading: {
          ...Loading,
          ModelsToLoad: ModelsNeeded.map(model => model.modelName),
          ModelsPreloadState:
            ModelsNeeded.reduce((acum, model) => ({ ...acum, [model.modelName]: { sizeTotal: model.sizeTotal, sizeLoaded: 0 } }), {})
          ,
          preloadState:
            ModelsNeeded.reduce((acum, model) => ({ ...acum, filesTotal: acum.filesTotal + 1, sizeTotal: acum.filesTotal + model.sizeTotal }), { filesTotal: 0, sizeTotal: 0, sizeLoaded: 0, fileLoaded: 0, percentLoaded: 0 })
        }
      }))
      const { gl } = get().threeState
      // call a function for load all models passing two callbacks one for progress on percent of load and other for event load complete
      preloadModels({ ModelsList, onUpdateLoad, onCompleteLoad, gl })

    },
    onUpdateLoad({ modelName, sizeLoaded }) {

      const { ModelsPreloadState } = get().Loading
      // new progrsss on model load  on event fire by loader
      const updatedModelsPreloadState = {
        ...ModelsPreloadState,
        [modelName]: { ...ModelsPreloadState[modelName], sizeLoaded }
      }
      // create updated state from new loaded data
      const updatePreloadState = Object.values(updatedModelsPreloadState).reduce((acum, model) => ({
        ...acum,
        filesTotal: acum.filesTotal + 1,
        sizeTotal: acum.sizeTotal + model.sizeTotal,
        filesLoaded: acum.filesLoaded + (model.sizeLoaded >= model.sizeLoaded ? 1 : 0),
        sizeLoaded: acum.sizeLoaded + model.sizeLoaded,
        percentLoaded: Math.floor((acum.sizeLoaded + model.sizeLoaded) / (acum.sizeTotal + model.sizeTotal) * 100)
      }), { filesTotal: 0, sizeTotal: 0, sizeLoaded: 0, filesLoaded: 0, percentLoaded: 0 })

      // set state loading
      set(({ Loading }) => ({
        Loading: {
          ...Loading,
          ModelsPreloadState: updatedModelsPreloadState,
          preloadState: updatePreloadState

        }
      }))
    },

    onCompleteLoad({ scene, modelName, type, transform }) {
      const { ModelsToLoad } = get().Loading
      const { setOverlayState } = get().Actions
      const ModelsLoaded = get().ModelsLoaded

      // Ignore models not needed for actual route
      // loader will cache model for future loads
      if (!ModelsToLoad.includes(modelName))
        return

      //add models to model loaded later will be edited on compile state
      const updatedModelsLoaded = { ...ModelsLoaded, [modelName]: { scene, transform, type } }
      set(() => ({ ModelsLoaded: updatedModelsLoaded }))

      //remove model from list of models needed to load
      const updatedModelsToLoad = ModelsToLoad.filter(model => model !== modelName)
      set(({ Loading }) => ({ Loading: { ...Loading, ModelsToLoad: updatedModelsToLoad } }))

      // Process models for compilation
      if (updatedModelsToLoad.length === 0)
        setOverlayState(3)

    },
    compileObjects() {
      const ModelsLoaded = get().ModelsLoaded
      const { prepareModels, setOverlayState } = get().Actions

      prepareModels(ModelsLoaded)
      setOverlayState(4)
    },
    prepareModels(ModelsLoaded) {

      const { scene, camera, gl } = get().threeState
      const activeRoute = get().activeRoute
      // function for traverse 3d objects locate 3dObjets, textures ...
      const { models, elements, textures } = prepareModels({ ModelsLoaded, scene, camera, gl })

      //store references
      set(() => ({ Models: models, ModelsElements: elements, ModelsTextures: textures }))

    },
    setThree(three) {
      const { gl } = three

      //Component GetScene is rendered when Scene3D is created and call this function to store scene, gl for precompilation, cameraq ...
      set(() => ({ threeState: { ...three } }))
    },
  }



})

