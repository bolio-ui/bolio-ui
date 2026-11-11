import { useCallback, useEffect, useRef, useState } from 'react'
import type React from 'react'

// One tab stop in a grid of controls, and the arrow keys to move between
// them. `home` says what Home and End do: go to the first and last control
// of the column or of the row.
const useGridFocus = (rows: number, cols: number, home: 'column' | 'row') => {
  const [position, setPosition] = useState({ row: 0, col: 0 })
  const [tick, setTick] = useState(0)
  const elements = useRef(new Map<string, HTMLElement>())
  const shouldFocus = useRef(false)

  const row = Math.min(Math.max(position.row, 0), Math.max(rows - 1, 0))
  const col = Math.min(Math.max(position.col, 0), Math.max(cols - 1, 0))

  useEffect(() => {
    if (!shouldFocus.current) return
    shouldFocus.current = false
    elements.current.get(`${row}:${col}`)?.focus()
  }, [row, col, tick])

  const register = useCallback(
    (r: number, c: number) => (element: HTMLElement | null) => {
      if (element) elements.current.set(`${r}:${c}`, element)
      else elements.current.delete(`${r}:${c}`)
    },
    []
  )

  const onKeyDown = (r: number, c: number) => (event: React.KeyboardEvent) => {
    const targets: Record<string, [number, number]> = {
      ArrowUp: [r - 1, c],
      ArrowDown: [r + 1, c],
      ArrowLeft: [r, c - 1],
      ArrowRight: [r, c + 1],
      Home: home === 'column' ? [0, c] : [r, 0],
      End: home === 'column' ? [rows - 1, c] : [r, cols - 1]
    }
    const target = targets[event.key]
    if (!target) return
    event.preventDefault()
    const [nextRow, nextCol] = target
    if (nextRow < 0 || nextRow >= rows || nextCol < 0 || nextCol >= cols) return
    shouldFocus.current = true
    setPosition({ row: nextRow, col: nextCol })
    setTick((last) => last + 1)
  }

  return {
    register,
    tabIndex: (r: number, c: number) => (r === row && c === col ? 0 : -1),
    onFocus: (r: number, c: number) => () => setPosition({ row: r, col: c }),
    onKeyDown
  }
}

export default useGridFocus
