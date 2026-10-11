import { useEffect, useMemo, useRef } from 'react'
import useLatest from '../utils/use-latest'

const useDebouncedCallback = <A extends unknown[]>(
  callback: (...args: A) => void,
  wait: number
) => {
  const latest = useLatest(callback)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  return useMemo(() => {
    const debounced = (...args: A) => {
      clearTimeout(timer.current)
      timer.current = setTimeout(() => latest.current(...args), wait)
    }
    debounced.cancel = () => clearTimeout(timer.current)
    return debounced
  }, [latest, wait])
}

export default useDebouncedCallback
