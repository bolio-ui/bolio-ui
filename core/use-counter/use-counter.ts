import { useCallback, useMemo, useState } from 'react'

export type UseCounterOptions = {
  min?: number
  max?: number
}

export type UseCounterHandlers = {
  increment: () => void
  decrement: () => void
  set: (value: number) => void
  reset: () => void
}

const useCounter = (
  initialValue = 0,
  { min, max }: UseCounterOptions = {}
): [number, UseCounterHandlers] => {
  const clamp = useCallback(
    (value: number) =>
      Math.min(Math.max(value, min ?? -Infinity), max ?? Infinity),
    [min, max]
  )
  const [count, setCount] = useState(() => clamp(initialValue))

  const handlers = useMemo(
    () => ({
      increment: () => setCount((current) => clamp(current + 1)),
      decrement: () => setCount((current) => clamp(current - 1)),
      set: (value: number) => setCount(clamp(value)),
      reset: () => setCount(clamp(initialValue))
    }),
    [clamp, initialValue]
  )

  return [count, handlers]
}

export default useCounter
