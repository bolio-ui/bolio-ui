import { RefObject, useEffect, useRef } from 'react'

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

const useFocusTrap = <T extends HTMLElement = HTMLElement>(
  active = true
): RefObject<T | null> => {
  const ref = useRef<T>(null)

  useEffect(() => {
    const node = ref.current
    if (!active || !node) return

    const items = () =>
      Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE))
    items()[0]?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return
      const list = items()
      if (!list.length) return
      const first = list[0]
      const last = list[list.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    node.addEventListener('keydown', onKeyDown)
    return () => node.removeEventListener('keydown', onKeyDown)
  }, [active])

  return ref
}

export default useFocusTrap
