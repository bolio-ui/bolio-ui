import { useReducer, useRef } from 'react'

const mutating = ['add', 'delete', 'clear'] as const

const useSet = <T>(values?: readonly T[]): Set<T> => {
  const [, update] = useReducer((tick: number) => tick + 1, 0)
  const ref = useRef<Set<T> | null>(null)

  if (!ref.current) {
    const set = new Set(values)
    mutating.forEach((method) => {
      const original = set[method].bind(set) as (...args: unknown[]) => unknown
      Object.defineProperty(set, method, {
        value: (...args: unknown[]) => {
          const result = original(...args)
          update()
          return result
        }
      })
    })
    ref.current = set
  }

  return ref.current
}

export default useSet
