import { useCallback, useEffect, useRef, useState } from 'react'
import useLatest from '../utils/use-latest'

export type UseIntervalOptions = {
  autoInvoke?: boolean
}

export type UseIntervalResult = {
  start: () => void
  stop: () => void
  toggle: () => void
  active: boolean
}

const useInterval = (
  fn: () => void,
  interval: number,
  { autoInvoke = false }: UseIntervalOptions = {}
): UseIntervalResult => {
  const [active, setActive] = useState(false)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)
  const latest = useLatest(fn)

  const stop = useCallback(() => {
    if (timer.current !== null) clearInterval(timer.current)
    timer.current = null
    setActive(false)
  }, [])

  const start = useCallback(() => {
    if (timer.current !== null) return
    if (autoInvoke) latest.current()
    timer.current = setInterval(() => latest.current(), interval)
    setActive(true)
  }, [interval, autoInvoke, latest])

  const toggle = useCallback(
    () => (timer.current !== null ? stop() : start()),
    [start, stop]
  )

  useEffect(
    () => () => {
      if (timer.current !== null) clearInterval(timer.current)
    },
    []
  )

  return { start, stop, toggle, active }
}

export default useInterval
