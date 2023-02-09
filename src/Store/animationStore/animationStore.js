import { zoomCameraToSelection } from '@/threeutils'

export const animationStore = (set, get) => ({

  //Elementens needed for animation
  AnimatedElements: {},

  storeActions: {
    initAnimations() {
      console.log("animations")
    },
    addAnimatedElement(element) {

    },
    setCameraFit(object, size, camera) {



      zoomCameraToSelection(camera, size, object)

    }

  }



})

