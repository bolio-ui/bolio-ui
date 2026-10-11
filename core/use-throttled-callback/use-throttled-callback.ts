import { useEffect, useMemo, useRef } from 'react'
import useLatest from '../utils/use-latest'

const useThrottledCallback = <A extends unknown[]>(
  callback: (...args: A) => void,
  wait: number
) => {
  const latest = useLatest(callback)
  const lastRun = useRef(0)
  const lastArgs = useRef<A | undefined>(undefined)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  return useMemo(() => {
    const run = () => {
      timer.current = undefined
      lastRun.current = Date.now()
      if (lastArgs.current) latest.current(...lastArgs.current)
    }
    const throttled = (...args: A) => {
      lastArgs.current = args
      const remaining = wait - (Date.now() - lastRun.current)
      if (remaining <= 0) {
        clearTimeout(timer.current)
        run()
      } else if (timer.current === undefined) {
        timer.current = setTimeout(run, remaining)
      }
    }
    throttled.cancel = () => {
      clearTimeout(timer.current)
      timer.current = undefined
    }
    return throttled
  }, [latest, wait])
}

export default useThrottledCallback
