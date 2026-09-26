import { useEffect, useState } from 'react'
import useSSR from './use-ssr'
import useLatest from './use-latest'
import { getId } from './collections'

const createElement = (id: string): HTMLElement => {
  const el = document.createElement('div')
  el.setAttribute('id', id)
  return el
}

const usePortal = (
  selectId?: string,
  getContainer?: () => HTMLElement | null
): HTMLElement | null => {
  // without an id, one is made once: a new one on every render would be a
  // new portal element on every render
  const [generatedId] = useState(getId)
  const id = `bolio-ui-${selectId ?? generatedId}`
  const { isBrowser } = useSSR()
  const [elSnapshot, setElSnapshot] = useState<HTMLElement | null>(
    isBrowser ? createElement(id) : null
  )

  // the container is only looked up when the portal is created
  const getContainerRef = useLatest(getContainer)

  useEffect(() => {
    const getContainer = getContainerRef.current
    const customContainer = getContainer ? getContainer() : null
    const parentElement = customContainer || document.body
    const hasElement = parentElement.querySelector<HTMLElement>(`#${id}`)
    const el = hasElement || createElement(id)

    if (!hasElement) {
      parentElement.appendChild(el)
    }
    setElSnapshot(el)
  }, [id, getContainerRef])

  return elSnapshot
}

export default usePortal
