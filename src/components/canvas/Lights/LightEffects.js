import { EffectComposer, Bloom } from "@react-three/postprocessing"
import { Environment, ContactShadows } from "@react-three/drei"
export const LightEffects = () => {
  return (
    <>
      <Environment preset='city' />
      <ContactShadows />
    </>
  )
}
