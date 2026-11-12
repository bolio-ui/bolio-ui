import { useEffect, useState } from 'react'

// The element that has focus, or null while nothing does (and on the server).
const useActiveElement = (): Element | null => {
  const [active, setActive] = useState<Element | null>(null)

  useEffect(() => {
    const update = () => setActive(document.activeElement)
    update()
    document.addEventListener('focusin', update)
    document.addEventListener('focusout', update)
    return () => {
      document.removeEventListener('focusin', update)
      document.removeEventListener('focusout', update)
    }
  }, [])

  return active
}

export default useActiveElement
