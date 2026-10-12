import { useEffect, useState } from 'react'

export type UseIdleOptions = {
  events?: string[]
  initialState?: boolean
}

const DEFAULT_EVENTS = ['keypress', 'mousemove', 'touchmove', 'click', 'scroll']

const useIdle = (
  timeout: number,
  { events = DEFAULT_EVENTS, initialState = true }: UseIdleOptions = {}
) => {
  const [idle, setIdle] = useState(initialState)

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>
    const start = () => {
      clearTimeout(timer)
      timer = setTimeout(() => setIdle(true), timeout)
    }
    const handler = () => {
      setIdle(false)
      start()
    }
    events.forEach((event) => document.addEventListener(event, handler))
    start()
    return () => {
      clearTimeout(timer)
      events.forEach((event) => document.removeEventListener(event, handler))
    }
  }, [timeout, events])

  return idle
}

export default useIdle
