import { useEffect } from 'react'
import { useStore } from '@/Store'
export function InitPreload() {

  const { setOverlayState } = useStore(state => state.Actions)

  useEffect(() => {

    setOverlayState(1)

  }, [setOverlayState])
  return (
    <div style={{ display: "none" }}></div>
  )
}

