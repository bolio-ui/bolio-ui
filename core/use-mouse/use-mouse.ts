import { RefObject, useEffect, useRef, useState } from 'react'

export type UseMouseResult<T extends HTMLElement> = {
  ref: RefObject<T | null>
  x: number
  y: number
}

const useMouse = <T extends HTMLElement = HTMLElement>(): UseMouseResult<T> => {
  const ref = useRef<T>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const node = ref.current
    const target: HTMLElement | Document = node ?? document
    const move = (event: Event) => {
      const { clientX, clientY } = event as MouseEvent
      if (node) {
        const rect = node.getBoundingClientRect()
        setPosition({
          x: Math.round(clientX - rect.left),
          y: Math.round(clientY - rect.top)
        })
      } else {
        setPosition({ x: clientX, y: clientY })
      }
    }
    target.addEventListener('mousemove', move)
    return () => target.removeEventListener('mousemove', move)
  }, [])

  return { ref, ...position }
}

export default useMouse
