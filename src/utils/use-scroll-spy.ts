import * as React from 'react'

export function useScrollSpy(
  selectors: string[],
  options?: IntersectionObserverInit
) {
  const [activeId, setActiveId] = React.useState<string | null>()
  const observer = React.useRef<IntersectionObserver>()
  React.useEffect(() => {
    const elements = selectors.map((selector) =>
      document.querySelector(selector)
    )
    if (observer.current) {
      observer.current.disconnect()
    }
    observer.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry?.isIntersecting) {
          setActiveId(entry.target.getAttribute('id'))
        }
      })
    }, options)
    elements.forEach((el) => el && observer.current?.observe(el))

    // The last headings can never reach the observed band of a page that has
    // no more room to scroll, so the end of the page selects the last one.
    const onScroll = () => {
      const last = elements[elements.length - 1]
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2
      if (last && atBottom) setActiveId(last.getAttribute('id'))
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      observer.current?.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  }, [options, selectors])

  return activeId
}
