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















export function updateLoadModel({ stage, index, sizeLoaded, fileLoadState }) {

  //console.log(sizeLoaded)
  const oldModelData = fileLoadState[`stage${stage}`][index]
  const newModelState = { ...oldModelData, sizeLoaded: sizeLoaded, isLoaded: oldModelData.sizeTotal <= sizeLoaded }

  const newStageLoaded = [...fileLoadState[`stage${stage}`].slice(0, index), newModelState, ...fileLoadState[`stage${stage}`].slice(index + 1)]


  const newStateFileLoadState = { ...fileLoadState, [`stage${stage}`]: [...newStageLoaded] }

  const loadState = updateLoadData(newStateFileLoadState)
  //console.log({ ...loadState, newStateFileLoadState })
  return { ...loadState, fileLoadState: newStateFileLoadState }
}


export const initialLoadState = getInitialState()


function updateLoadData(fileLoadState) {
  const stagesArray = Object.keys(fileLoadState)

  const stageLoadState = stagesArray.reduce((acumStage, key) => {
    //console.log(fileLoadState)
    //console.log("***************************")
    //console.log(...fileLoadState[`stage${stage}`].slice(0, index))
    //console.log("---------------------------")
    //console.log(...fileLoadState[`stage${stage}`].slice(index + 1))
    //console.log("---------------------------")
    return (
      {
        ...acumStage, [key]:
          fileLoadState[key].reduce((acum, model) => (
            {
              filesTotal: acum.filesTotal + 1,
              filesLoaded: model.isLoaded ? acum.filesLoaded + 1 : acum.filesLoaded,
              sizeTotal: acum.sizeTotal + model.sizeTotal,
              sizeLoaded: acum.sizeLoaded + model.sizeLoaded,
              isLoaded: acum.isLoaded && model.isLoaded
            }), { filesTotal: 0, filesLoaded: 0, sizeTotal: 0, sizeLoaded: 0, isLoaded: true })
      })
  }
    , {})


  const sceneLoadState = stagesArray.reduce((acum, key) => {
    const stage = stageLoadState[key]
    return ({
      filesTotal: acum.filesTotal + stage.filesTotal,
      filesLoaded: acum.filesLoaded + stage.filesLoaded,
      sizeTotal: acum.sizeTotal + stage.sizeTotal,
      sizeLoaded: acum.sizeLoaded + stage.sizeLoaded,
      isComplete: acum.isComplete && stage.isLoaded
    })

  }, { filesTotal: 0, filesLoaded: 0, sizeTotal: 0, sizeLoaded: 0, isComplete: true })

  return ({ stageLoadState, sceneLoadState })
}
