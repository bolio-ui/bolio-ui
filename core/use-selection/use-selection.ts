import { useMemo, useState } from 'react'

export type UseSelectionOptions<T> = {
  data: T[]
  initialSelection?: T[]
}

export type UseSelectionHandlers<T> = {
  select: (item: T) => void
  deselect: (item: T) => void
  toggle: (item: T) => void
  selectAll: () => void
  deselectAll: () => void
  setSelection: (items: T[]) => void
  isSelected: (item: T) => boolean
}

const useSelection = <T>({
  data,
  initialSelection = []
}: UseSelectionOptions<T>): [T[], UseSelectionHandlers<T>] => {
  const [selected, setSelected] = useState(initialSelection)

  const handlers = useMemo<UseSelectionHandlers<T>>(
    () => ({
      select: (item) =>
        setSelected((list) => (list.includes(item) ? list : [...list, item])),
      deselect: (item) => setSelected((list) => list.filter((i) => i !== item)),
      toggle: (item) =>
        setSelected((list) =>
          list.includes(item) ? list.filter((i) => i !== item) : [...list, item]
        ),
      selectAll: () => setSelected([...data]),
      deselectAll: () => setSelected([]),
      setSelection: setSelected,
      isSelected: (item) => selected.includes(item)
    }),
    [data, selected]
  )

  return [selected, handlers]
}

export default useSelection
