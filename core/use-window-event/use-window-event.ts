import { useEffect } from 'react'
import useLatest from '../utils/use-latest'

const useWindowEvent = <K extends keyof WindowEventMap>(
  type: K,
  listener: (event: WindowEventMap[K]) => void,
  options?: boolean | AddEventListenerOptions
) => {
  const latest = useLatest(listener)

  useEffect(() => {
    const handler = (event: WindowEventMap[K]) => latest.current(event)
    window.addEventListener(type, handler, options)
    return () => window.removeEventListener(type, handler, options)
  }, [type, options, latest])
}

export default useWindowEvent
