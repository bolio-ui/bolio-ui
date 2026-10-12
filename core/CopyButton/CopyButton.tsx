import React, { useCallback, useEffect, useRef, useState } from 'react'
import useClipboard from '../use-clipboard'

export type CopyButtonRenderProps = {
  copied: boolean
  copy: () => void
}

export type CopyButtonProps = {
  value: string
  // milliseconds `copied` stays true after a copy
  timeout?: number
  children: (props: CopyButtonRenderProps) => React.ReactNode
}

// renders no element of its own: the children draw the trigger
const CopyButton: React.FC<CopyButtonProps> = ({
  value,
  timeout = 1000,
  children
}) => {
  const { copy: copyText } = useClipboard()
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  const copy = useCallback(() => {
    copyText(value)
    setCopied(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopied(false), timeout)
  }, [copyText, value, timeout])

  return <>{children({ copied, copy })}</>
}

CopyButton.displayName = 'BolioUICopyButton'
export default CopyButton
