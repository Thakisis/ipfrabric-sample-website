import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useThree } from '@react-three/fiber'
import { useStore } from '@/Store'


export function GetScene() {
  const threeParam = useThree()
  const { pathname } = useRouter()

  const { setThree, threeState } = useStore(state => ({
    setThree: state.Actions.setThree,
    threeState: state.threeState,
  }
  ))
  useEffect(() => {
    if (!threeParam)
      return
    if (!threeState)
      setThree(threeParam)
  }, [pathname, threeState, setThree, threeParam])





  return (
    <group></group>
  )
}


export default GetScene
