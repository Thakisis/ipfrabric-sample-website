import GetEssentials from './GetSceneMats'
import { useStore } from '@/Store'
export const GetScene = () => {
  const { scene } = useStore(state => state.threeState)

  if (scene)
    return (<group></group>)
  return (
    <GetEssentials></GetEssentials>
  )
}

