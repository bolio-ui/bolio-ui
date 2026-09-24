import * as React from 'react'

// Picks the current heading from the scroll position at which each one
// reaches the top of the page (`targets`). The headings the page can not
// scroll up to share the scroll that is left, in order, so each of them can
// be selected and the last one is selected at the end of the page, whatever
// the window height. Returns -1 before the first heading.
export const getActiveIndex = (
  targets: number[],
  scrollY: number,
  maxScroll: number
): number => {
  if (!targets.length) return -1
  if (maxScroll <= 0) return 0

  const firstUnreachable = targets.findIndex((target) => target > maxScroll)
  const adjusted = targets.slice()
  if (firstUnreachable !== -1) {
    const start =
      firstUnreachable > 0 ? Math.max(0, targets[firstUnreachable - 1]) : 0
    const count = targets.length - firstUnreachable
    for (let i = firstUnreachable; i < targets.length; i++) {
      const step = i - firstUnreachable + 1
      adjusted[i] = start + ((maxScroll - start) * step) / count
    }
  }

  // 1px of tolerance for fractional scroll positions
  let active = -1
  adjusted.forEach((target, i) => {
    if (target <= scrollY + 1) active = i
  })
  return active
}

// The id of the heading being read. A heading reached from a link (Contents
// or its own anchor) stays selected until the reader scrolls, even when the
// page ends before that heading gets to the top.
export function useScrollSpy(ids: string[]) {
  const [activeId, setActiveId] = React.useState<string | null>(null)
  const idsKey = ids.join('\n')

  React.useEffect(() => {
    let pinned: string | null = null
    let frame = 0

    const update = () => {
      frame = 0
      if (pinned) return setActiveId(pinned)

      const elements = ids
        .map((id) => document.getElementById(id))
        .filter((el): el is HTMLElement => Boolean(el))
      const scrollY = window.scrollY
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight
      // the same spot an anchor link scrolls the heading to
      const targets = elements.map(
        (el) =>
          el.getBoundingClientRect().top +
          scrollY -
          (parseFloat(getComputedStyle(el).scrollMarginTop) || 0)
      )
      const index = getActiveIndex(targets, scrollY, maxScroll)
      setActiveId(index === -1 ? null : elements[index].id)
    }

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }

    const pin = (id: string) => {
      if (!ids.includes(id)) return
      pinned = id
      schedule()
    }

    const onLinkClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.('a[href^="#"]')
      if (link) pin(decodeURIComponent(link.getAttribute('href').slice(1)))
    }

    const unpin = () => {
      if (!pinned) return
      pinned = null
      schedule()
    }

    pin(decodeURIComponent(window.location.hash.slice(1)))
    schedule()

    const userScroll = ['wheel', 'touchmove', 'keydown']
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    document.addEventListener('click', onLinkClick)
    userScroll.forEach((name) =>
      window.addEventListener(name, unpin, { passive: true })
    )
    // content that loads later (images, playgrounds) moves the headings
    const resizeObserver =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(schedule)
        : null
    resizeObserver?.observe(document.body)

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      document.removeEventListener('click', onLinkClick)
      userScroll.forEach((name) => window.removeEventListener(name, unpin))
      resizeObserver?.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsKey])

  return activeId
}
