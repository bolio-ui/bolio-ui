import { useReducer, useRef } from 'react'

const mutating = ['set', 'delete', 'clear'] as const

const useMap = <K, V>(initialState?: Iterable<readonly [K, V]>): Map<K, V> => {
  const [, update] = useReducer((tick: number) => tick + 1, 0)
  const ref = useRef<Map<K, V> | null>(null)

  if (!ref.current) {
    const map = new Map(initialState)
    mutating.forEach((method) => {
      const original = map[method].bind(map) as (...args: unknown[]) => unknown
      Object.defineProperty(map, method, {
        value: (...args: unknown[]) => {
          const result = original(...args)
          update()
          return result
        }
      })
    })
    ref.current = map
  }

  return ref.current
}

export default useMap
