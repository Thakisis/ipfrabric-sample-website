import { useStore } from "@/Store"
import { Stage1 } from './Stage1'
export function Stages() {
  const { StagesStates, setStage } = useStore(state => ({ StagesStates: state.StagesState, setStage: state.Actions.setStage }))
  const { entering, inside, leaving, phaseIn } = StagesStates

  const changeSate = () => {
    setStage(0, 1)
  }
  const StageComponent = inside === 1 ? <Stage1 phaseIn={phaseIn} ></Stage1> : undefined
  return (
    <>
      {StageComponent}
      <mesh castShadow position={[0, .5, 0]}
        onClick={() => setStage({ stage: 1, transitionStage: 0 })}
      >
        <sphereGeometry args={[0.25, 64, 64]} />
        <meshStandardMaterial
          opacity={1} //
          roughness={0.1}
          color={0x030303}
          metalness={1}
        />

      </mesh>
    </>
  )
};

