import { useState } from 'react'
import useThrottledCallback from '../use-throttled-callback'

const useThrottledState = <T>(
  initialValue: T,
  wait: number
): [T, (value: T) => void] => {
  const [value, setValue] = useState(initialValue)
  const throttledSet = useThrottledCallback(setValue, wait)
  return [value, throttledSet]
}

export default useThrottledState
