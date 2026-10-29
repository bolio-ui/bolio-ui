import type { KeyboardEvent } from 'react'
import { useCallback, useRef, useState } from 'react'

export type UseRovingIndexOptions = {
  total: number
  initialIndex?: number
  orientation?: 'horizontal' | 'vertical'
  loop?: boolean
  onChange?: (index: number) => void
}

const useRovingIndex = ({
  total,
  initialIndex = 0,
  orientation = 'horizontal',
  loop = true,
  onChange
}: UseRovingIndexOptions) => {
  const [selected, setSelected] = useState(initialIndex)
  const items = useRef<(HTMLElement | null)[]>([])

  const select = useCallback(
    (index: number) => {
      setSelected(index)
      items.current[index]?.focus()
      onChange?.(index)
    },
    [onChange]
  )

  const onKeyDown = (event: KeyboardEvent, index: number) => {
    const [prev, next] =
      orientation === 'horizontal'
        ? ['ArrowLeft', 'ArrowRight']
        : ['ArrowUp', 'ArrowDown']
    let target = index
    if (event.key === next) target = index + 1
    else if (event.key === prev) target = index - 1
    else if (event.key === 'Home') target = 0
    else if (event.key === 'End') target = total - 1
    else return
    event.preventDefault()
    if (target < 0) target = loop ? total - 1 : 0
    if (target > total - 1) target = loop ? 0 : total - 1
    select(target)
  }

  const getItemProps = (index: number) => ({
    ref: (element: HTMLElement | null) => {
      items.current[index] = element
    },
    tabIndex: index === selected ? 0 : -1,
    onFocus: () => setSelected(index),
    onKeyDown: (event: KeyboardEvent) => onKeyDown(event, index)
  })

  return { selected, setSelected: select, getItemProps }
}

export default useRovingIndex
