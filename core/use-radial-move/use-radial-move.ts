import { RefObject, useEffect, useRef, useState } from 'react'
import useLatest from '../utils/use-latest'

export type UseRadialMoveOptions = {
  step?: number
  onChangeEnd?: (value: number) => void
}

const useRadialMove = <T extends HTMLElement = HTMLElement>(
  onChange: (value: number) => void,
  { step = 1, onChangeEnd }: UseRadialMoveOptions = {}
): { ref: RefObject<T | null>; active: boolean } => {
  const ref = useRef<T>(null)
  const [active, setActive] = useState(false)
  const callbacks = useLatest({ onChange, onChangeEnd })
  const last = useRef(0)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    // 0 at the top, growing clockwise
    const update = (event: PointerEvent) => {
      const rect = node.getBoundingClientRect()
      const x = event.clientX - (rect.left + rect.width / 2)
      const y = event.clientY - (rect.top + rect.height / 2)
      const degrees = ((Math.atan2(x, -y) * 180) / Math.PI + 360) % 360
      last.current = (Math.round(degrees / step) * step) % 360
      callbacks.current.onChange(last.current)
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
      callbacks.current.onChangeEnd?.(last.current)
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
  }, [step, callbacks])

  return { ref, active }
}

export default useRadialMove
