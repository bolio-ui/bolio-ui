import { useEffect, useState } from 'react'

export type UseViewportSizeResult = {
  width: number
  height: number
}

const useViewportSize = (): UseViewportSizeResult => {
  const [size, setSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const update = () =>
      setSize({ width: window.innerWidth, height: window.innerHeight })
    update()
    window.addEventListener('resize', update)
    window.addEventListener('orientationchange', update)
    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('orientationchange', update)
    }
  }, [])

  return size
}

export default useViewportSize
