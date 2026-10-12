import { useCallback, useMemo, useState } from 'react'
import useLatest from '../utils/use-latest'

export type UseDisclosureOptions = {
  onOpen?: () => void
  onClose?: () => void
}

export type UseDisclosureHandlers = {
  open: () => void
  close: () => void
  toggle: () => void
}

const useDisclosure = (
  initialState = false,
  options: UseDisclosureOptions = {}
): [boolean, UseDisclosureHandlers] => {
  const [opened, setOpened] = useState(initialState)
  const openedRef = useLatest(opened)
  const optionsRef = useLatest(options)

  const open = useCallback(() => {
    if (openedRef.current) return
    setOpened(true)
    optionsRef.current.onOpen?.()
  }, [openedRef, optionsRef])

  const close = useCallback(() => {
    if (!openedRef.current) return
    setOpened(false)
    optionsRef.current.onClose?.()
  }, [openedRef, optionsRef])

  const toggle = useCallback(() => {
    if (openedRef.current) close()
    else open()
  }, [openedRef, open, close])

  const handlers = useMemo(
    () => ({ open, close, toggle }),
    [open, close, toggle]
  )

  return [opened, handlers]
}

export default useDisclosure
