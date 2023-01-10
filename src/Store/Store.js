import create from 'zustand'
import { devtools } from 'zustand/middleware'
import { initialLoadState, updateLoadModel } from './StateUtils'
import { preloadModels, createLoaders } from './ThreeUtils'
import { createWorker } from './createWorkers'

export const useStore = create(devtools((set, get) => ({

  //PreloadState contains objects fileLoadState,stageLoadState, sceneLoadState
  preloadState: { ...initialLoadState },
  threeLoaders: { gltfLoader: null },
  isStore: false,
  worker: null,
  Actions: {

    initPreload() {
      if (get().isStore === true)
        return
      const w = createWorker()
      set(() => ({
        worker: w
      }))
      const loaders = createLoaders()
      set(() => ({ threeLoaders: loaders }))

      set(() => ({ isStore: true }))
      const { preloadStages } = get().Actions
      preloadStages({ stage: 0 })
    },
    preloadStages({ stage }) {
      const threeLoaders = get().threeLoaders
      const { fileLoadState } = get().preloadState
      const stagePreloadData = fileLoadState[`stage${stage}`]
      const { updateLoadStatus } = get().Actions

      preloadModels({ stage, updateLoadStatus, stagePreloadData, threeLoaders })


    },
    updateLoadStatus({ modelName, stage, index, sizeLoaded }) {
      const { preloadStages } = get().Actions
      const { fileLoadState } = get().preloadState

      const newPreloadState = updateLoadModel({ stage, index, sizeLoaded, fileLoadState })
      const isStageComplete = newPreloadState.stageLoadState[`stage${stage}`].isLoaded
      const isSceneComplete = newPreloadState.sceneLoadState.isComplete
      set(({ preloadState }) => ({ preloadState: { ...newPreloadState } }))
      if (isSceneComplete)
        return
      console.log()
      if (isStageComplete)
        preloadStages({ stage: stage + 1 })
      //if (stage === 2 || !StageIsComplete)
      return




    }




  }
})))






