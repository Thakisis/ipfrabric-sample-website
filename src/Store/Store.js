import create from 'zustand'
import { mountStoreDevtool } from 'simple-zustand-devtools'
import partialStores from './partialStores'
import { ModelsList } from './ModelsList'

export const useStore = create((set, get) => ({
  created: false,
  activeRoute: undefined,
  //PreloadState contains objects fileLoadState,stageLoadState, sceneLoadState
  /*
    overlayState values
    0 nothing rendered
    1 preloader and scene rendered
    2 fileload started 
    3 fileload complete 
    4 scene compiled
    5 first Scene Ready

  */
  overlayState: 0,
  Loading: { preloadState: { percent: 0 } },
  storesCreated: {},
  Actions: {
    initStore(route) {
      const { addStore, setRoute, } = get().Actions
      const routeName = setRoute(route)
      //add store property and functions if will check if already loaded
      addStore("threeStore")
      addStore("animationStore")
      addStore(`${routeName}Store`)
    },
    initPreloadRoute() {

      const route = get().activeRoute

      const { initPreload, setOverlayState } = get().Actions

      setOverlayState(2)
      initPreload(ModelsList[route])


    },
    addStore(store) {


      const storesCreated = get().storesCreated
      if (storesCreated[store])
        return
      const addToState = partialStores[store](set, get)
      const { storeActions, ...storeData } = addToState
      set(state => ({ ...state, ...storeData, Actions: { ...state.Actions, ...storeActions }, storesCreated: { ...storesCreated, [store]: true } }))

    },
    setRoute(route) {

      const routeName = getRouteName(route)
      const actRoute = get().actRoute
      if (actRoute === routeName)
        return actRoute
      set(() => ({ activeRoute: routeName, overlayState: 0 }))
      return routeName

    }
    , setOverlayState(overlayState) {
      set(() => ({ overlayState: overlayState }))
    }
  }

}))

function getRouteName(route) {


  const pathName = route.substring(1, route.length)
  const routeName = pathName === "" ? "index" : pathName

  return routeName
}






if (process.env.NODE_ENV === 'development') {
  mountStoreDevtool('Store', useStore)
}

