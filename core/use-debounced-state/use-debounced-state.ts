import { useCallback, useEffect, useRef, useState } from 'react'

export type UseDebouncedStateOptions = {
  leading?: boolean
}

const useDebouncedState = <T>(
  initialValue: T,
  wait: number,
  { leading = false }: UseDebouncedStateOptions = {}
): [T, (value: T) => void] => {
  const [value, setValue] = useState(initialValue)
  const cooling = useRef(false)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  const set = useCallback(
    (next: T) => {
      if (leading && !cooling.current) setValue(next)
      cooling.current = true
      clearTimeout(timer.current)
      timer.current = setTimeout(() => {
        cooling.current = false
        setValue(next)
      }, wait)
    },
    [wait, leading]
  )

  return [value, set]
}

export default useDebouncedState
