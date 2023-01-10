import create from 'zustand'
import { devtools } from 'zustand/middleware'
import { initialLoadState, updateLoadModel } from './StateUtils'
import { preloadModels, createLoaders, createSVGExtrude, createExtrudeMeshes, addSVGtoScene } from './ThreeUtils'


export const useStore = create(devtools((set, get) => ({

  //PreloadState contains objects fileLoadState,stageLoadState, sceneLoadState
  preloadState: { ...initialLoadState },
  //loaders for threeje
  threeLoaders: { gltfLoader: null },
  // avoid second initPreload during dev
  sceneModels: { isComplete: false, Models: {} },
  loadedMaterials: { isComplete: false, Materials: {} },
  disposables: { materials: false },
  SVGGeom: {},

  isStore: false,
  Actions: {

    // start preload of stage 0
    initPreload() {
      if (get().isStore === true)
        return


      const loaders = createLoaders()
      set(() => ({ threeLoaders: loaders }))

      set(() => ({ isStore: true }))
      const { preloadStages } = get().Actions
      preloadStages({ stage: 0 })
      const svgGeom = createSVGExtrude()
      set(({ SVGGeom }) => ({ SVGGeom: { ...svgGeom } }))
      //console.log(svgModel)
    },
    // function to preload a certain stage instead of launch preload of all files
    preloadStages({ stage }) {
      const threeLoaders = get().threeLoaders
      const { fileLoadState } = get().preloadState
      const stagePreloadData = fileLoadState[`stage${stage}`]
      const { onUpdateLoadModel, onCompleteLoadModel } = get().Actions

      preloadModels({ stage, stagePreloadData, threeLoaders, onUpdateLoadModel, onCompleteLoadModel })


    },

    // progress on load model to provide data for show preloader components and load net strages
    onUpdateLoadModel({ modelName, stage, index, sizeLoaded }) {
      const { preloadStages } = get().Actions
      const { fileLoadState } = get().preloadState

      const newPreloadState = updateLoadModel({ stage, index, sizeLoaded, fileLoadState })
      const isStageComplete = newPreloadState.stageLoadState[`stage${stage}`].isLoaded
      const isSceneComplete = newPreloadState.sceneLoadState.isComplete
      set(({ preloadState }) => ({ preloadState: { ...newPreloadState } }))
      if (isSceneComplete)
        return
      if (isStageComplete && stage === 1)
        return
      if (!isStageComplete)
        preloadStages({ stage: stage + 1 })
      //if (stage === 2 || !StageIsComplete)
      return




    },

    // store evry model to add later to scene
    onCompleteLoadModel({ modelName, scene, stage, materials }) {
      const { addMaterial } = get().Actions
      //set(({ loadedMaterials }) => ({ loadedMaterials: { ...loadedMaterials, Materials: { ...loadedMaterials.Materials, ...materials } } }))
      set(({ sceneModels }) => ({ sceneModels: { ...sceneModels, Models: { ...sceneModels.Models, [modelName]: scene } } }))
      addMaterial({ materials, val: undefined })
      const { Models } = get().sceneModels
    },
    addMaterial({ materials, ...otherProps }) {
      set(({ loadedMaterials }) => ({ loadedMaterials: { ...loadedMaterials, Materials: { ...loadedMaterials.Materials, ...materials }, ...otherProps } }))
      set(({ disposables }) => ({ disposables: { ...disposables } }))

      const Materials = get().loadedMaterials.Materials

      if (Materials.BlackMetal && Materials.WhiteMetal && Materials.glass) {
        const SvgModels = createExtrudeMeshes(get().SVGGeom, get().loadedMaterials.Materials)
        set(() => ({ SVGModels: { ...SvgModels } }))

      }
    },
    addMeshToScene({ mesh, scene, type }) {

      const { SVGModels } = get()

      addSVGtoScene({ meshes: SVGModels["iplogo"], scene })



    }








  }
})))






