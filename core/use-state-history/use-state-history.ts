import { useMemo, useState } from 'react'
import useLatest from '../utils/use-latest'

export type UseStateHistoryValue<T> = {
  history: T[]
  current: number
}

export type UseStateHistoryHandlers<T> = {
  set: (value: T) => void
  back: (steps?: number) => void
  forward: (steps?: number) => void
  reset: () => void
}

const useStateHistory = <T>(
  initialValue: T
): [T, UseStateHistoryHandlers<T>, UseStateHistoryValue<T>] => {
  const initial = useLatest(initialValue)
  const [state, setState] = useState<UseStateHistoryValue<T>>({
    history: [initialValue],
    current: 0
  })

  const handlers = useMemo<UseStateHistoryHandlers<T>>(
    () => ({
      set: (value) =>
        setState(({ history, current }) => {
          const next = [...history.slice(0, current + 1), value]
          return { history: next, current: next.length - 1 }
        }),
      back: (steps = 1) =>
        setState(({ history, current }) => ({
          history,
          current: Math.max(0, current - steps)
        })),
      forward: (steps = 1) =>
        setState(({ history, current }) => ({
          history,
          current: Math.min(history.length - 1, current + steps)
        })),
      reset: () => setState({ history: [initial.current], current: 0 })
    }),
    [initial]
  )

  return [state.history[state.current], handlers, state]
}

export default useStateHistory
