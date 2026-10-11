import { useCallback, useEffect, useRef } from 'react'

export type UseFocusReturnOptions = {
  opened: boolean
  shouldReturnFocus?: boolean
}

const useFocusReturn = ({
  opened,
  shouldReturnFocus = true
}: UseFocusReturnOptions) => {
  const last = useRef<HTMLElement | null>(null)

  const returnFocus = useCallback(() => {
    if (last.current && typeof last.current.focus === 'function') {
      last.current.focus({ preventScroll: true })
    }
  }, [])

  useEffect(() => {
    if (opened) {
      last.current = document.activeElement as HTMLElement | null
      return
    }
    if (shouldReturnFocus) returnFocus()
  }, [opened, shouldReturnFocus, returnFocus])

  return returnFocus
}

export default useFocusReturn
