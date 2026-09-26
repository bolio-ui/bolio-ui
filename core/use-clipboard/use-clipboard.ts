import usePortal from '../utils/use-portal'
import useLatest from '../utils/use-latest'
import logWarning from '../utils/log-warning'
import { useCallback } from 'react'

export type UseClipboardOptions = {
  onError: () => unknown
}

export type UseClipboardResult = {
  copy: (text: string) => void
}

const defaultOptions: UseClipboardOptions = {
  onError: () => logWarning('Failed to copy.', 'use-clipboard')
}

const copyText = (
  el: HTMLElement | null,
  text: string,
  onError?: () => unknown
) => {
  if (!el || !text) return
  const selection = window.getSelection()
  if (!selection) return

  el.style.whiteSpace = 'pre'
  el.textContent = text

  const range = window.document.createRange()
  selection.removeAllRanges()
  range.selectNode(el)
  selection.addRange(range)
  try {
    window.document.execCommand('copy')
  } catch {
    if (onError) onError()
  }

  selection.removeAllRanges()
  if (el) {
    el.textContent = ''
  }
}

const useClipboard = (
  options: UseClipboardOptions = defaultOptions
): UseClipboardResult => {
  const el = usePortal('clipboard')
  const latestOnError = useLatest(options.onError)

  const copy = useCallback(
    (text: string) => {
      copyText(el, text, latestOnError.current)
    },
    [el, latestOnError]
  )

  return { copy }
}

export default useClipboard
