import { useStore } from "@/Store"
import { Stage1 } from './Stage1'
import { StagePreload } from "./StagePreload"
export function Stages() {
  //const { StagesStates, setStage } = useStore(state => ({ StagesStates: state.StagesState, setStage: state.Actions.setStage }))
  //const { entering, inside, leaving, phaseIn } = StagesStates

  const changeSate = () => {
    //setStage(0, 1)
  }
  //const StageComponent = inside === 1 ? <Stage1 phaseIn={phaseIn} ></Stage1> : undefined
  return (
    <>


      <StagePreload></StagePreload>

    </>
  )
};

