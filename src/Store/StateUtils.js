import gsap from 'gsap'
import { Models } from './Models'


//generate InitialState
function getInitialState() {
  const stagesArray = Object.keys(Models)
  const fileLoadState = stagesArray.reduce((acum, key) => ({

    ...acum, [key]: Models[key].map(model => ({ ...model, sizeLoaded: 0, isLoaded: false }))
  }), {})

  const updateData = updateLoadData(fileLoadState)
  return { fileLoadState, ...updateData }


}
export const progress = getInitialState()





