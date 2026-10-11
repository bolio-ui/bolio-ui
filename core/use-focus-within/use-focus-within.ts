import { RefObject, useEffect, useRef, useState } from 'react'
import useLatest from '../utils/use-latest'

export type UseFocusWithinOptions = {
  onFocus?: (event: FocusEvent) => void
  onBlur?: (event: FocusEvent) => void
}

export type UseFocusWithinResult<T extends HTMLElement> = {
  ref: RefObject<T | null>
  focused: boolean
}

const useFocusWithin = <T extends HTMLElement = HTMLElement>(
  options: UseFocusWithinOptions = {}
): UseFocusWithinResult<T> => {
  const ref = useRef<T>(null)
  const [focused, setFocused] = useState(false)
  const latest = useLatest(options)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const focusin = (event: FocusEvent) => {
      setFocused(true)
      latest.current.onFocus?.(event)
    }
    const focusout = (event: FocusEvent) => {
      if (node.contains(event.relatedTarget as Node | null)) return
      setFocused(false)
      latest.current.onBlur?.(event)
    }
    node.addEventListener('focusin', focusin)
    node.addEventListener('focusout', focusout)
    return () => {
      node.removeEventListener('focusin', focusin)
      node.removeEventListener('focusout', focusout)
    }
  }, [latest])

  return { ref, focused }
}

export default useFocusWithin
