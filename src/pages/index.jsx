import dynamic from 'next/dynamic'
import { IndexScene } from '@/components/canvas/indexScene'
import Instructions from '@/components/dom/Instructions'

// Dynamic import is used to prevent a payload when the website starts, that includes threejs, r3f etc..
// WARNING ! errors might get obfuscated by using dynamic import.
// If something goes wrong go back to a static import to show the error.
// https://github.com/pmndrs/react-three-next/issues/49
const Logo = dynamic(() => import('@/components/canvas/Logo'), { ssr: false })

// Dom components go here
export default function Page(props) {
  return (
    <div style={{
      position: "absolute", height: ".4vh", width: "100%", pointerEvents: "none", color: "black", zIndex: -99
    }}>
      test text
    </div>
  )
}

// Canvas components go here
// It will receive same props as the Page component (from getStaticProps, etc.)
Page.canvas = (props) => <IndexScene {...props}></IndexScene>

export async function getStaticProps() {
  return { props: { title: 'Index', background: "white" } }
}
