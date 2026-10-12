import { RefObject, useCallback, useEffect, useRef, useState } from 'react'

export type UseScrollerResult<T extends HTMLElement> = {
  ref: RefObject<T | null>
  canScrollStart: boolean
  canScrollEnd: boolean
  scrollBy: (direction: 'start' | 'end') => void
}

const useScroller = <T extends HTMLElement = HTMLElement>(
  step = 200
): UseScrollerResult<T> => {
  const ref = useRef<T>(null)
  const [state, setState] = useState({ start: false, end: false })

  const update = useCallback(() => {
    const node = ref.current
    if (!node) return
    setState({
      start: node.scrollLeft > 0,
      end: node.scrollLeft + node.clientWidth < node.scrollWidth - 1
    })
  }, [])

  useEffect(() => {
    const node = ref.current
    if (!node) return
    update()
    node.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      node.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [update])

  const scrollBy = useCallback(
    (direction: 'start' | 'end') =>
      ref.current?.scrollBy({
        left: direction === 'end' ? step : -step,
        behavior: 'smooth'
      }),
    [step]
  )

  return {
    ref,
    canScrollStart: state.start,
    canScrollEnd: state.end,
    scrollBy
  }
}

export default useScroller
