import { useMemo, useState } from 'react'

export type UseListStateHandlers<T> = {
  setState: (items: T[]) => void
  append: (...items: T[]) => void
  prepend: (...items: T[]) => void
  insert: (index: number, ...items: T[]) => void
  remove: (...indices: number[]) => void
  reorder: (move: { from: number; to: number }) => void
  setItem: (index: number, item: T) => void
  filter: (fn: (item: T, index: number) => boolean) => void
  apply: (fn: (item: T, index: number) => T) => void
}

const useListState = <T>(
  initialValue: T[] = []
): [T[], UseListStateHandlers<T>] => {
  const [state, setState] = useState(initialValue)

  const handlers = useMemo<UseListStateHandlers<T>>(
    () => ({
      setState,
      append: (...items) => setState((list) => [...list, ...items]),
      prepend: (...items) => setState((list) => [...items, ...list]),
      insert: (index, ...items) =>
        setState((list) => [
          ...list.slice(0, index),
          ...items,
          ...list.slice(index)
        ]),
      remove: (...indices) =>
        setState((list) => list.filter((_, index) => !indices.includes(index))),
      reorder: ({ from, to }) =>
        setState((list) => {
          const copy = [...list]
          const [moved] = copy.splice(from, 1)
          copy.splice(to, 0, moved)
          return copy
        }),
      setItem: (index, item) =>
        setState((list) => {
          const copy = [...list]
          copy[index] = item
          return copy
        }),
      filter: (fn) => setState((list) => list.filter(fn)),
      apply: (fn) => setState((list) => list.map(fn))
    }),
    []
  )

  return [state, handlers]
}

export default useListState
