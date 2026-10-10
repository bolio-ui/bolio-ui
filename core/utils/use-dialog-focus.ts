import { RefObject, useEffect } from 'react'
import { isChildElement } from './collections'

// Moves the focus to the dialog when it opens, so a screen reader announces
// its name, and gives it back to the element that had it when the dialog
// closes. A control inside the dialog that already took the focus (an
// autofocus) is left alone.
const useDialogFocus = (
  visible: boolean,
  dialog: RefObject<HTMLElement | null>
) => {
  useEffect(() => {
    if (!visible) return
    const active = document.activeElement as HTMLElement | null
    if (isChildElement(dialog.current, active)) return
    dialog.current?.focus({ preventScroll: true })
    return () => {
      if (active?.isConnected) active.focus({ preventScroll: true })
    }
  }, [visible, dialog])
}

export default useDialogFocus
