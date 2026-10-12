import { RefObject, useEffect, useRef, useState } from 'react'

export type UseDragResult<T extends HTMLElement> = {
  ref: RefObject<T | null>
  dragging: boolean
  position: { x: number; y: number }
  reset: () => void
}

const useDrag = <T extends HTMLElement = HTMLElement>(): UseDragResult<T> => {
  const ref = useRef<T>(null)
  const [dragging, setDragging] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const node = ref.current
    if (!node) return
    let start = { x: 0, y: 0 }
    let origin = { x: 0, y: 0 }

    const down = (event: PointerEvent) => {
      node.setPointerCapture?.(event.pointerId)
      start = { x: event.clientX, y: event.clientY }
      setPosition((current) => {
        origin = current
        return current
      })
      setDragging(true)
    }
    const move = (event: PointerEvent) => {
      if (!node.hasPointerCapture?.(event.pointerId)) return
      setPosition({
        x: origin.x + event.clientX - start.x,
        y: origin.y + event.clientY - start.y
      })
    }
    const up = (event: PointerEvent) => {
      node.releasePointerCapture?.(event.pointerId)
      setDragging(false)
    }

    node.addEventListener('pointerdown', down)
    node.addEventListener('pointermove', move)
    node.addEventListener('pointerup', up)
    node.addEventListener('pointercancel', up)
    return () => {
      node.removeEventListener('pointerdown', down)
      node.removeEventListener('pointermove', move)
      node.removeEventListener('pointerup', up)
      node.removeEventListener('pointercancel', up)
    }
  }, [])

  return { ref, dragging, position, reset: () => setPosition({ x: 0, y: 0 }) }
}

export default useDrag
