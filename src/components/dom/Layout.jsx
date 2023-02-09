import { useRef, forwardRef } from 'react'
import { mergeRefs } from 'react-merge-refs'

const Layout = forwardRef(({ children, ...props }, ref) => {
  const localRef = useRef()
  const { background } = props
  return (
    <div
      ref={mergeRefs([ref, localRef])}
      className='top-0 left-0 h-screen  w-100 dom text-black-50'
      style={{ background: background }}
    >

      {children}
    </div>
  )
})
Layout.displayName = 'Layout'

export default Layout
