import { useEffect, useRef, useState } from 'react'

export type UseDebouncedValueOptions = {
  leading?: boolean
}

const useDebouncedValue = <T>(
  value: T,
  wait: number,
  { leading = false }: UseDebouncedValueOptions = {}
): [T, () => void] => {
  const [debounced, setDebounced] = useState(value)
  const mounted = useRef(false)
  const cooling = useRef(false)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const cancel = () => clearTimeout(timer.current)

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      return
    }
    if (leading && !cooling.current) setDebounced(value)
    cooling.current = true
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      cooling.current = false
      setDebounced(value)
    }, wait)
  }, [value, wait, leading])

  useEffect(() => () => clearTimeout(timer.current), [])

  return [debounced, cancel]
}

export default useDebouncedValue
