import { useCallback, useEffect, useRef } from 'react'
import useLatest from '../utils/use-latest'

export type UseTimeoutOptions = {
  autoInvoke?: boolean
}

export type UseTimeoutResult = {
  start: () => void
  clear: () => void
}

const useTimeout = (
  callback: () => void,
  delay: number,
  { autoInvoke = false }: UseTimeoutOptions = {}
): UseTimeoutResult => {
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const latest = useLatest(callback)

  const clear = useCallback(() => clearTimeout(timer.current), [])

  const start = useCallback(() => {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => latest.current(), delay)
  }, [delay, latest])

  useEffect(() => {
    if (autoInvoke) start()
    return clear
  }, [autoInvoke, start, clear])

  return { start, clear }
}

export default useTimeout
