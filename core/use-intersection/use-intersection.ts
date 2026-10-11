import { useCallback, useRef, useState } from 'react'

export type UseIntersectionResult<T extends HTMLElement> = {
  ref: (element: T | null) => void
  entry: IntersectionObserverEntry | null
}

const useIntersection = <T extends HTMLElement = HTMLElement>(
  options?: IntersectionObserverInit
): UseIntersectionResult<T> => {
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null)
  const observer = useRef<IntersectionObserver | null>(null)
  const root = options?.root
  const rootMargin = options?.rootMargin
  const threshold = String(options?.threshold ?? '')

  const ref = useCallback(
    (element: T | null) => {
      observer.current?.disconnect()
      observer.current = null
      if (!element || typeof IntersectionObserver === 'undefined') {
        setEntry(null)
        return
      }
      observer.current = new IntersectionObserver(([next]) => setEntry(next), {
        root,
        rootMargin,
        threshold: threshold ? threshold.split(',').map(Number) : undefined
      })
      observer.current.observe(element)
    },
    [root, rootMargin, threshold]
  )

  return { ref, entry }
}

export default useIntersection
