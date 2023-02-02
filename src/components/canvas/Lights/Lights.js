import { Environment, ContactShadows, Lightformer, CameraControls } from "@react-three/drei"
export function Lights(props) {

  return (
    <>

      <ContactShadows resolution={1024} position={[0, -0.002, 0]} far={7.5} blur={.61} smooth opacity={.6} />
      <Environment preset="city"></Environment>

    </>
  )
}
//<ContactShadows />

