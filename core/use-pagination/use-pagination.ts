import { useCallback, useState } from 'react'

export type UsePaginationOptions = {
  total: number
  page?: number
  initialPage?: number
  siblings?: number
  boundaries?: number
  onChange?: (page: number) => void
}

export type UsePaginationResult = {
  range: (number | 'dots')[]
  active: number
  setPage: (page: number) => void
  next: () => void
  previous: () => void
  first: () => void
  last: () => void
}

const range = (start: number, end: number) =>
  Array.from({ length: Math.max(end - start + 1, 0) }, (_, i) => start + i)

const usePagination = ({
  total,
  page,
  initialPage = 1,
  siblings = 1,
  boundaries = 1,
  onChange
}: UsePaginationOptions): UsePaginationResult => {
  const pages = Math.max(Math.trunc(total), 0)
  const [inner, setInner] = useState(initialPage)
  const active = page ?? inner

  const setPage = useCallback(
    (value: number) => {
      const next = Math.min(Math.max(value, 1), pages)
      setInner(next)
      if (next !== active) onChange?.(next)
    },
    [pages, active, onChange]
  )

  const paginationRange = (): (number | 'dots')[] => {
    if (siblings * 2 + 3 + boundaries * 2 >= pages) return range(1, pages)

    const left = Math.max(active - siblings, boundaries)
    const right = Math.min(active + siblings, pages - boundaries)
    const dotsLeft = left > boundaries + 2
    const dotsRight = right < pages - (boundaries + 1)

    if (!dotsLeft && dotsRight) {
      return [
        ...range(1, siblings * 2 + boundaries + 2),
        'dots',
        ...range(pages - (boundaries - 1), pages)
      ]
    }
    if (dotsLeft && !dotsRight) {
      return [
        ...range(1, boundaries),
        'dots',
        ...range(pages - (boundaries + 1 + 2 * siblings), pages)
      ]
    }
    return [
      ...range(1, boundaries),
      'dots',
      ...range(left, right),
      'dots',
      ...range(pages - boundaries + 1, pages)
    ]
  }

  return {
    range: paginationRange(),
    active,
    setPage,
    next: () => setPage(active + 1),
    previous: () => setPage(active - 1),
    first: () => setPage(1),
    last: () => setPage(pages)
  }
}

export default usePagination
