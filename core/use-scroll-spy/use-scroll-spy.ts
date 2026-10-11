import { useCallback, useEffect, useState } from 'react'

export type UseScrollSpyHeading = {
  id: string
  label: string
  depth: number
  element: HTMLElement
}

export type UseScrollSpyOptions = {
  selector?: string
  offset?: number
}

const useScrollSpy = ({
  selector = 'h1, h2, h3, h4, h5, h6',
  offset = 0
}: UseScrollSpyOptions = {}) => {
  const [data, setData] = useState<UseScrollSpyHeading[]>([])
  const [active, setActive] = useState(-1)

  const reinitialize = useCallback(() => {
    setData(
      Array.from(document.querySelectorAll<HTMLElement>(selector)).map(
        (element) => ({
          id: element.id,
          label: element.textContent ?? '',
          depth: Number(element.tagName.slice(1)) || 1,
          element
        })
      )
    )
  }, [selector])

  useEffect(reinitialize, [reinitialize])

  useEffect(() => {
    const update = () => {
      let current = -1
      data.forEach(({ element }, index) => {
        if (element.getBoundingClientRect().top - offset <= 0) current = index
      })
      setActive(current)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [data, offset])

  return { active, data, reinitialize }
}

export default useScrollSpy
