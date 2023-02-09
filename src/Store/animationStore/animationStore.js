import { zoomCameraToSelection } from '@/threeutils'
import gsap from 'gsap'
export const animationStore = (set, get) => ({

  //Elementens needed for animation
  AnimatedElements: {},

  storeActions: {
    initAnimations() {
      const { camera } = get().threeState

      const timeline = gsap.timeline()
      animatetransform({
        object: camera,
        transform: { position: [2.43, 1.38, 5.52], rotation: [-0.11, 0.629, 0.039] },
        ease: { position: "Elastic.easeOut.config(1,.5)", rotation: "Elastic.easeOut.config(1,.4)" },
        duration: 3,

        tl: timeline
      })
      /*
      gsap.to(
        camera.position,
        { z: Math.floor((Math.random() * 4) + 2), duration: 2, ease: "elastic" },
        0
      )*/


    },
    addAnimatedElement(element) {

    },
    setCameraFit(object, size, camera) {

      zoomCameraToSelection(camera, size, object)

    }

  }
})

function animatetransform({ object, transform, ease, duration, tl }) {
  const coordArraPos = ["x", "y", "z"]
  const { position, rotation } = transform
  const { position: positionEase, rotation: rotationEase } = ease

  //2.32, 1.39, 5.4
  tl.to(object.position, {
    x: position[0],
    y: position[1],
    z: position[2],
    duration: duration,
    ease: ease.position,
    onUpdate: () => {
      console.log(object.position)
    }
  })
  tl.to(object.rotation, {
    x: rotation[0],
    y: rotation[1],
    z: rotation[2],
    duration: duration,
    ease: ease.rotation,
    delay: -1 * duration,
    onUpdate: () => {
      console.log(object.rotation)
    }
  })

  rotation.map((value, index) => {
    //gsap.to(object.position, { [coordArraPos[index]]: value, duration: duration, ease: ease.rotation })
  })

}



