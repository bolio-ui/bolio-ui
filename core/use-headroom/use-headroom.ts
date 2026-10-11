import { useEffect, useState } from 'react'
import useLatest from '../utils/use-latest'

export type UseHeadroomOptions = {
  fixedAt?: number
  onPin?: () => void
  onFix?: () => void
  onRelease?: () => void
}

const useHeadroom = ({
  fixedAt = 10,
  onPin,
  onFix,
  onRelease
}: UseHeadroomOptions = {}) => {
  const [pinned, setPinned] = useState(true)
  const callbacks = useLatest({ onPin, onFix, onRelease })

  useEffect(() => {
    let previous = window.scrollY
    const update = () => {
      const current = window.scrollY
      if (current <= fixedAt) {
        setPinned(true)
        callbacks.current.onFix?.()
      } else if (current < previous) {
        setPinned(true)
        callbacks.current.onPin?.()
      } else if (current > previous) {
        setPinned(false)
        callbacks.current.onRelease?.()
      }
      previous = current
    }
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [fixedAt, callbacks])

  return pinned
}

export default useHeadroom
