import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react'

export type CurrentStateType<S> = [
  S,
  Dispatch<SetStateAction<S>>,
  MutableRefObject<S>
]

const useCurrentState = <S>(
  initialState: S | (() => S)
): CurrentStateType<S> => {
  const [state, setState] = useState<S>(() => {
    return typeof initialState === 'function'
      ? (initialState as () => S)()
      : initialState
  })
  const ref = useRef<S>(initialState as S)

  useEffect(() => {
    ref.current = state
  }, [state])

  // only uses the ref and the state setter, so it is the same function on
  // every render and can be a dependency without making anything rerun
  const setValue = useCallback((val: SetStateAction<S>) => {
    const result =
      typeof val === 'function'
        ? (val as (prevState: S) => S)(ref.current)
        : val
    ref.current = result
    setState(result)
  }, [])

  return [state, setValue, ref]
}

export default useCurrentState
