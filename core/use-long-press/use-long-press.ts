import { useCallback, useEffect, useMemo, useRef } from 'react'
import useLatest from '../utils/use-latest'

export type UseLongPressOptions = {
  threshold?: number
}

const useLongPress = (
  onLongPress: () => void,
  { threshold = 400 }: UseLongPressOptions = {}
) => {
  const latest = useLatest(onLongPress)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const start = useCallback(() => {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => latest.current(), threshold)
  }, [latest, threshold])

  const cancel = useCallback(() => clearTimeout(timer.current), [])

  useEffect(() => cancel, [cancel])

  return useMemo(
    () => ({
      onMouseDown: start,
      onTouchStart: start,
      onMouseUp: cancel,
      onMouseLeave: cancel,
      onTouchEnd: cancel
    }),
    [start, cancel]
  )
}

export default useLongPress
