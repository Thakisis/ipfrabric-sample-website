import { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useStore } from '@/Store'
import Header from '@/config'
import Layout from '@/components/dom/Layout'
import '@/styles/index.css'
import Overlay from '@/components/dom/Overlay'

const Scene = dynamic(() => import('@/components/canvas/Scene'), { ssr: true })


export default function App({ Component, pageProps = { title: 'index' } }) {
  const ref = useRef()
  const { initStore } = useStore((state) => state.Actions)
  const router = useRouter()

  useEffect(() => {
    initStore(router.pathname)
  }, [initStore, router])
  return (
    <>
      <Header title={pageProps.title} />
      <Layout ref={ref} background={pageProps.background}>
        <Overlay />
        <Component {...pageProps} />
        {/* The canvas can either be in front of the dom or behind. If it is in front it can overlay contents.
         * Setting the event source to a shared parent allows both the dom and the canvas to receive events.
         * Since the eventc source is now shared, the canvas would block events, we prevent that with pointerEvents: none. */}
        {Component?.canvas && (
          <Scene className='pointer-events-none' eventSource={ref} eventPrefix='client'>
            {Component.canvas(pageProps)}
          </Scene>
        )}

      </Layout>
    </>
  )
}
