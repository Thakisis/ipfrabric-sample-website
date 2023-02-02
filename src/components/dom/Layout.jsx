import { useRef, forwardRef } from 'react'
import { mergeRefs } from 'react-merge-refs'

const Layout = forwardRef(({ children, ...props }, ref) => {
  const localRef = useRef()
  return (
    <div
      ref={mergeRefs([ref, localRef])}
      className='top-0 left-0 h-screen bg-red-900  w-100 dom text-black-50'>
      {children}
    </div>
  )
})
Layout.displayName = 'Layout'

export default Layout
