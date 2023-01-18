import { EffectComposer, Bloom } from "@react-three/postprocessing"
import { Environment, ContactShadows } from "@react-three/drei"
export const Lights = () => {
  return (
    <>
      <Environment preset='city' />
      <ContactShadows />
    </>
  )
}
