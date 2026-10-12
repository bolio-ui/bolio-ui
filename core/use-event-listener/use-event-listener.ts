import { RefObject, useEffect, useRef } from 'react'
import useLatest from '../utils/use-latest'

const useEventListener = <
  K extends keyof HTMLElementEventMap,
  T extends HTMLElement = HTMLElement
>(
  type: K,
  listener: (event: HTMLElementEventMap[K]) => void,
  options?: boolean | AddEventListenerOptions
): RefObject<T | null> => {
  const ref = useRef<T>(null)
  const latest = useLatest(listener)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const handler = (event: HTMLElementEventMap[K]) => latest.current(event)
    node.addEventListener(type, handler, options)
    return () => node.removeEventListener(type, handler, options)
  }, [type, options, latest])

  return ref
}

export default useEventListener
