import type { RefObject } from 'react'
import { useEffect, useRef, useState } from 'react'

export type UseFloatingWindowOptions = {
  initialPosition?: { x: number; y: number }
}

export type UseFloatingWindowResult<
  T extends HTMLElement,
  H extends HTMLElement
> = {
  ref: RefObject<T | null>
  handleRef: RefObject<H | null>
  style: React.CSSProperties
  dragging: boolean
}

const useFloatingWindow = <
  T extends HTMLElement = HTMLElement,
  H extends HTMLElement = HTMLElement
>({
  initialPosition = { x: 16, y: 16 }
}: UseFloatingWindowOptions = {}): UseFloatingWindowResult<T, H> => {
  const ref = useRef<T>(null)
  const handleRef = useRef<H>(null)
  const [position, setPosition] = useState(initialPosition)
  const [dragging, setDragging] = useState(false)

  useEffect(() => {
    const handle = handleRef.current
    const node = ref.current
    if (!handle || !node) return
    let offset = { x: 0, y: 0 }

    const down = (event: PointerEvent) => {
      const rect = node.getBoundingClientRect()
      offset = { x: event.clientX - rect.left, y: event.clientY - rect.top }
      handle.setPointerCapture?.(event.pointerId)
      setDragging(true)
    }
    const move = (event: PointerEvent) => {
      if (!handle.hasPointerCapture?.(event.pointerId)) return
      const maxX = window.innerWidth - node.offsetWidth
      const maxY = window.innerHeight - node.offsetHeight
      setPosition({
        x: Math.min(Math.max(event.clientX - offset.x, 0), Math.max(maxX, 0)),
        y: Math.min(Math.max(event.clientY - offset.y, 0), Math.max(maxY, 0))
      })
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
  }, [])

  return {
    ref,
    handleRef,
    dragging,
    style: { position: 'fixed', left: position.x, top: position.y }
  }
}

export default useFloatingWindow
