import { useCallback, useEffect, useState } from 'react'

export type UseWindowScrollPosition = {
  x: number
  y: number
}

const useWindowScroll = (): [
  UseWindowScrollPosition,
  (position: Partial<UseWindowScrollPosition>) => void
] => {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const update = () => setPosition({ x: window.scrollX, y: window.scrollY })
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  const scrollTo = useCallback(
    ({ x, y }: Partial<UseWindowScrollPosition>) =>
      window.scrollTo({ left: x ?? window.scrollX, top: y ?? window.scrollY }),
    []
  )

  return [position, scrollTo]
}

export default useWindowScroll
