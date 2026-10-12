import { useCallback, useState } from 'react'

const useSetState = <T extends Record<string, unknown>>(
  initialState: T
): [T, (statePartial: Partial<T> | ((current: T) => Partial<T>)) => void] => {
  const [state, setState] = useState(initialState)

  const setPartial = useCallback(
    (statePartial: Partial<T> | ((current: T) => Partial<T>)) =>
      setState((current) => ({
        ...current,
        ...(typeof statePartial === 'function'
          ? statePartial(current)
          : statePartial)
      })),
    []
  )

  return [state, setPartial]
}

export default useSetState
