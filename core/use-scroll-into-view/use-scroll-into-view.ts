import type { RefObject } from 'react'
import { useCallback, useEffect, useRef } from 'react'

export type UseScrollIntoViewOptions = {
  duration?: number
  offset?: number
}

export type UseScrollIntoViewResult<
  T extends HTMLElement,
  C extends HTMLElement
> = {
  targetRef: RefObject<T | null>
  scrollableRef: RefObject<C | null>
  scrollIntoView: () => void
  cancel: () => void
}

const ease = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t)

const useScrollIntoView = <
  T extends HTMLElement = HTMLElement,
  C extends HTMLElement = HTMLElement
>({
  duration = 800,
  offset = 0
}: UseScrollIntoViewOptions = {}): UseScrollIntoViewResult<T, C> => {
  const targetRef = useRef<T>(null)
  const scrollableRef = useRef<C>(null)
  const frame = useRef(0)

  const cancel = useCallback(() => cancelAnimationFrame(frame.current), [])

  const scrollIntoView = useCallback(() => {
    const target = targetRef.current
    if (!target) return
    cancel()
    const container = scrollableRef.current
    const start = container ? container.scrollTop : window.scrollY
    const targetTop = target.getBoundingClientRect().top
    const containerTop = container ? container.getBoundingClientRect().top : 0
    const distance = targetTop - containerTop - offset
    const startTime = performance.now()

    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1)
      const value = start + distance * ease(progress)
      if (container) container.scrollTop = value
      else window.scrollTo({ top: value })
      if (progress < 1) frame.current = requestAnimationFrame(step)
    }
    frame.current = requestAnimationFrame(step)
  }, [duration, offset, cancel])

  useEffect(() => cancel, [cancel])

  return { targetRef, scrollableRef, scrollIntoView, cancel }
}

export default useScrollIntoView
