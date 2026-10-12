import { useCallback, useEffect, useRef, useState } from 'react'
import useLatest from '../utils/use-latest'

export type UseFileDialogOptions = {
  multiple?: boolean
  accept?: string
  capture?: string
  onChange?: (files: FileList | null) => void
}

export type UseFileDialogResult = {
  files: FileList | null
  open: () => void
  reset: () => void
}

const useFileDialog = (
  options: UseFileDialogOptions = {}
): UseFileDialogResult => {
  const [files, setFiles] = useState<FileList | null>(null)
  const input = useRef<HTMLInputElement | null>(null)
  const latest = useLatest(options)

  useEffect(() => {
    const element = document.createElement('input')
    element.type = 'file'
    element.addEventListener('change', () => {
      setFiles(element.files)
      latest.current.onChange?.(element.files)
    })
    input.current = element
    return () => {
      input.current = null
    }
  }, [latest])

  const open = useCallback(() => {
    const element = input.current
    if (!element) return
    const { multiple, accept, capture } = latest.current
    element.multiple = Boolean(multiple)
    element.accept = accept ?? ''
    if (capture) element.capture = capture
    element.click()
  }, [latest])

  const reset = useCallback(() => {
    setFiles(null)
    if (input.current) input.current.value = ''
  }, [])

  return { files, open, reset }
}

export default useFileDialog
