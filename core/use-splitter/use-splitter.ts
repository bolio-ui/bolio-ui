import { RefObject, useEffect, useRef, useState } from 'react'

export type UseSplitterOptions = {
  initialSize?: number
  min?: number
  max?: number
  direction?: 'horizontal' | 'vertical'
}

export type UseSplitterResult<C extends HTMLElement, H extends HTMLElement> = {
  containerRef: RefObject<C | null>
  handleRef: RefObject<H | null>
  size: number
  dragging: boolean
}

const useSplitter = <
  C extends HTMLElement = HTMLElement,
  H extends HTMLElement = HTMLElement
>({
  initialSize = 50,
  min = 10,
  max = 90,
  direction = 'horizontal'
}: UseSplitterOptions = {}): UseSplitterResult<C, H> => {
  const containerRef = useRef<C>(null)
  const handleRef = useRef<H>(null)
  const [size, setSize] = useState(initialSize)
  const [dragging, setDragging] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    const handle = handleRef.current
    if (!container || !handle) return

    const down = (event: PointerEvent) => {
      handle.setPointerCapture?.(event.pointerId)
      setDragging(true)
    }
    const move = (event: PointerEvent) => {
      if (!handle.hasPointerCapture?.(event.pointerId)) return
      const rect = container.getBoundingClientRect()
      const percent =
        direction === 'horizontal'
          ? ((event.clientX - rect.left) / (rect.width || 1)) * 100
          : ((event.clientY - rect.top) / (rect.height || 1)) * 100
      setSize(Math.min(Math.max(percent, min), max))
    }
    const up = (event: PointerEvent) => {
      handle.releasePointerCapture?.(event.pointerId)
      setDragging(false)
    }

    handle.addEventListener('pointerdown', down)
    handle.addEventListener('pointermove', move)
    handle.addEventListener('pointerup', up)
    handle.addEventListener('pointercancel', up)
    return () => {
      handle.removeEventListener('pointerdown', down)
      handle.removeEventListener('pointermove', move)
      handle.removeEventListener('pointerup', up)
      handle.removeEventListener('pointercancel', up)
    }
  }, [min, max, direction])

  return { containerRef, handleRef, size, dragging }
}

export default useSplitter
