import type { CSSProperties, RefObject } from 'react'
import { useEffect, useRef, useState } from 'react'

export type UseCollapseOptions = {
  opened: boolean
  duration?: number
}

export type UseCollapseResult<T extends HTMLElement> = {
  ref: RefObject<T | null>
  style: CSSProperties
  onTransitionEnd: () => void
}

const closed: CSSProperties = { height: 0, overflow: 'hidden' }

const useCollapse = <T extends HTMLElement = HTMLElement>({
  opened,
  duration = 200
}: UseCollapseOptions): UseCollapseResult<T> => {
  const ref = useRef<T>(null)
  const first = useRef(true)
  const [style, setStyle] = useState<CSSProperties>(opened ? {} : closed)

  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    const node = ref.current
    if (!node) return
    const height = node.scrollHeight
    const transition = `height ${duration}ms ease`
    let frame = 0
    setStyle({ height: opened ? 0 : height, overflow: 'hidden' })
    frame = requestAnimationFrame(() =>
      setStyle({ height: opened ? height : 0, overflow: 'hidden', transition })
    )
    return () => cancelAnimationFrame(frame)
  }, [opened, duration])

  return {
    ref,
    style,
    onTransitionEnd: () => {
      if (opened) setStyle({})
    }
  }
}

export default useCollapse
