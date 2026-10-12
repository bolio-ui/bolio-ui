import { RefObject, useEffect, useRef, useState } from 'react'

export type UseResizeObserverRect = {
  x: number
  y: number
  width: number
  height: number
  top: number
  left: number
  bottom: number
  right: number
}

const defaultRect: UseResizeObserverRect = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  top: 0,
  left: 0,
  bottom: 0,
  right: 0
}

const useResizeObserver = <T extends HTMLElement = HTMLElement>(
  options?: ResizeObserverOptions
): [RefObject<T | null>, UseResizeObserverRect] => {
  const ref = useRef<T>(null)
  const [rect, setRect] = useState(defaultRect)
  const box = options?.box

  useEffect(() => {
    const node = ref.current
    if (!node || typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(([entry]) => {
      if (entry) setRect(entry.contentRect)
    })
    observer.observe(node, { box })
    return () => observer.disconnect()
  }, [box])

  return [ref, rect]
}

export default useResizeObserver
