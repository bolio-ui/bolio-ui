import { useEffect, useRef, useState } from 'react'

const useThrottledValue = <T>(value: T, wait: number): T => {
  const [throttled, setThrottled] = useState(value)
  const lastRun = useRef(0)

  useEffect(() => {
    const remaining = wait - (Date.now() - lastRun.current)
    const run = () => {
      lastRun.current = Date.now()
      setThrottled(value)
    }
    if (remaining <= 0) {
      run()
      return
    }
    const timer = setTimeout(run, remaining)
    return () => clearTimeout(timer)
  }, [value, wait])

  return throttled
}

export default useThrottledValue
