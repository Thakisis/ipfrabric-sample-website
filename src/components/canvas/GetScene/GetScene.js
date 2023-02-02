import { useLayoutEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { useStore } from '@/Store'

export function GetScene() {


  const { setThree, threeState } = useStore(state => ({ setThree: state.Actions.setThree, threeState: state.threeState }))
  const threeParam = useThree()

  useLayoutEffect(() => {
    if (threeState)
      return
    if (threeParam)
      setThree(threeParam)


  }, [threeParam, setThree, threeState])


  return (
    <group></group>
  )
}


export default GetScene
