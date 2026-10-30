import type { RefObject } from 'react'
import { useEffect, useRef } from 'react'
import useLatest from '../utils/use-latest'

const useMutationObserver = <T extends HTMLElement = HTMLElement>(
  callback: MutationCallback,
  options: MutationObserverInit
): RefObject<T | null> => {
  const ref = useRef<T>(null)
  const latest = useLatest(callback)
  const { attributes, attributeFilter, childList, subtree, characterData } =
    options
  const filter = attributeFilter?.join(',')

  useEffect(() => {
    const node = ref.current
    if (!node || typeof MutationObserver === 'undefined') return
    const observer = new MutationObserver((mutations, instance) =>
      latest.current(mutations, instance)
    )
    observer.observe(node, {
      attributes,
      attributeFilter: filter ? filter.split(',') : undefined,
      childList,
      subtree,
      characterData
    })
    return () => observer.disconnect()
  }, [latest, attributes, filter, childList, subtree, characterData])

  return ref
}

export default useMutationObserver
