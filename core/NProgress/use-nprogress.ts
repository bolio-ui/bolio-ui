import { useCallback, useEffect, useRef, useState } from 'react'

export type UseNProgressOptions = {
  // milliseconds between two steps while it loads
  trickleSpeed?: number
  // where the bar waits for the end of the load
  maximum?: number
}

export type UseNProgressResult = {
  // 0 to 100
  value: number
  visible: boolean
  start: () => void
  set: (value: number) => void
  increment: () => void
  complete: () => void
  reset: () => void
}

// A bigger step at the start and smaller ones near the end, so the bar
// always moves and never reaches the end by itself.
const stepFor = (value: number) =>
  value < 20 ? 10 : value < 50 ? 4 : value < 80 ? 2 : 0.5

const useNProgress = ({
  trickleSpeed = 200,
  maximum = 94
}: UseNProgressOptions = {}): UseNProgressResult => {
  const [value, setValue] = useState(0)
  const [visible, setVisible] = useState(false)
  const timers = useRef<{
    trickle?: ReturnType<typeof setInterval>
    hide?: ReturnType<typeof setTimeout>
    clear?: ReturnType<typeof setTimeout>
  }>({})

  const stop = useCallback(() => {
    clearInterval(timers.current.trickle)
    clearTimeout(timers.current.hide)
    clearTimeout(timers.current.clear)
    timers.current = {}
  }, [])

  const set = useCallback(
    (next: number) => setValue(Math.min(Math.max(next, 0), 100)),
    []
  )

  const increment = useCallback(
    () =>
      setValue((current) =>
        current >= maximum
          ? current
          : Math.min(current + stepFor(current), maximum)
      ),
    [maximum]
  )

  const start = useCallback(() => {
    stop()
    setVisible(true)
    setValue((current) => (current > 0 && current < 100 ? current : 8))
    timers.current.trickle = setInterval(increment, trickleSpeed)
  }, [stop, increment, trickleSpeed])

  const complete = useCallback(() => {
    stop()
    setVisible(true)
    setValue(100)
    // let the bar reach the end, fade it out, then go back to the start
    timers.current.hide = setTimeout(() => setVisible(false), 250)
    timers.current.clear = setTimeout(() => setValue(0), 550)
  }, [stop])

  const reset = useCallback(() => {
    stop()
    setVisible(false)
    setValue(0)
  }, [stop])

  useEffect(() => stop, [stop])

  return { value, visible, start, set, increment, complete, reset }
}

export default useNProgress
