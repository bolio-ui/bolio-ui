import type { RefObject } from 'react'
import { useEffect, useRef, useState } from 'react'
import useLatest from '../utils/use-latest'

export type UseMovePosition = {
  x: number
  y: number
}

const clamp = (value: number) => Math.min(Math.max(value, 0), 1)

const useMove = <T extends HTMLElement = HTMLElement>(
  onChange: (value: UseMovePosition) => void,
  onScrubEnd?: () => void
): { ref: RefObject<T | null>; active: boolean } => {
  const ref = useRef<T>(null)
  const [active, setActive] = useState(false)
  const callbacks = useLatest({ onChange, onScrubEnd })

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const update = (event: PointerEvent) => {
      const rect = node.getBoundingClientRect()
      callbacks.current.onChange({
        x: clamp((event.clientX - rect.left) / (rect.width || 1)),
        y: clamp((event.clientY - rect.top) / (rect.height || 1))
      })
    }
    const down = (event: PointerEvent) => {
      node.setPointerCapture?.(event.pointerId)
      setActive(true)
      update(event)
    }
    const move = (event: PointerEvent) => {
      if (node.hasPointerCapture?.(event.pointerId)) update(event)
    }
    const up = (event: PointerEvent) => {
      node.releasePointerCapture?.(event.pointerId)
      setActive(false)
      callbacks.current.onScrubEnd?.()
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
  }, [callbacks])

  return { ref, active }
}

export default useMove
