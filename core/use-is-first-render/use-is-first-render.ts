import { useRef } from 'react'

const useIsFirstRender = () => {
  const first = useRef(true)
  if (first.current) {
    first.current = false
    return true
  }
  return first.current
}

export default useIsFirstRender
