import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useCallback,
  useMemo
} from 'react'
import useCurrentState from '../use-current-state'
import useLatest from '../use-latest'
import { capitalize } from '../collections'

export type ContextStateOnChange<T> = <K extends keyof T>(
  key: K,
  nextValue: T[K]
) => void
export type ContextHandler<S> = {
  [K in keyof S as `set${Capitalize<string & K>}`]: (next: S[K]) => void
}

export type ContextHandlerWhere<T> = <K extends keyof T>(
  key: K,
  next: T[K]
) => void
export type ContextStates<S> = S &
  ContextHandler<S> & { update: ContextHandlerWhere<S> }
export type ContextStatesType<S> = [
  ContextStates<S>,
  Dispatch<SetStateAction<S>>,
  MutableRefObject<S>
]

export type ContextStateFilter<T> = <K extends keyof T>(
  key: K,
  nextValue: T[K]
) => boolean

const useContextState = <S extends Record<string, unknown>>(
  initialState: Required<S> | (() => Required<S>),
  options?: {
    filter?: ContextStateFilter<S>
    onChange?: ContextStateOnChange<S>
  }
): ContextStatesType<S> => {
  const [state, setState, stateRef] = useCurrentState(initialState)

  // the memo below keeps `update` between renders, so it reads the options
  // of the latest render
  const latestOptions = useLatest(options)
  const update: ContextHandlerWhere<S> = useCallback(
    (key, next) => {
      const { filter, onChange } = latestOptions.current || {}
      const allowChange = filter ? filter(key, next) : true
      if (!allowChange) return
      setState((last) => ({ ...last, [key]: next }))
      if (onChange) onChange(key, next)
    },
    [latestOptions, setState]
  )

  const stateMemo = useMemo<ContextStates<S>>(() => {
    const keys = Object.keys(state) as Array<keyof S>
    const updates = keys.reduce<ContextHandler<S>>((pre, current) => {
      const updateHandler = {
        [`set${capitalize(current)}`]: (nextValue: S[typeof current]) => {
          update(current, nextValue)
        }
      }
      return { ...pre, ...updateHandler }
    }, {} as ContextHandler<S>)
    return {
      update,
      ...state,
      ...updates
    }
  }, [state, update])

  return [stateMemo, setState, stateRef]
}

export default useContextState
