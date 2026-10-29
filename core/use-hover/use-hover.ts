import type { RefObject } from 'react'
import { useEffect, useRef, useState } from 'react'

export type UseHoverResult<T extends HTMLElement> = {
  hovered: boolean
  ref: RefObject<T | null>
}

const useHover = <T extends HTMLElement = HTMLElement>(): UseHoverResult<T> => {
  const [hovered, setHovered] = useState(false)
  const ref = useRef<T>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const enter = () => setHovered(true)
    const leave = () => setHovered(false)
    node.addEventListener('mouseenter', enter)
    node.addEventListener('mouseleave', leave)
    return () => {
      node.removeEventListener('mouseenter', enter)
      node.removeEventListener('mouseleave', leave)
    }
  }, [])

  return { hovered, ref }
}

export default useHover
