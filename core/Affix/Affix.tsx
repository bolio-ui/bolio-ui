import React from 'react'
import { createPortal } from 'react-dom'
import useMounted from '../use-mounted'

interface Props {
  // distance to each edge of the window: a number is pixels, a string is
  // used as it is
  top?: number | string
  right?: number | string
  bottom?: number | string
  left?: number | string
  zIndex?: number
  className?: string
}

type NativeAttrs = Omit<React.HTMLAttributes<HTMLDivElement>, keyof Props>
export type AffixProps = Props & NativeAttrs

const Affix = React.forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<AffixProps>
>(
  (
    { top, right, bottom, left, zIndex = 100, children, style, ...props },
    ref
  ) => {
    const mounted = useMounted()
    if (!mounted) return null
    return createPortal(
      <div
        ref={ref}
        style={{
          position: 'fixed',
          top,
          right,
          bottom,
          left,
          zIndex,
          ...style
        }}
        {...props}
      >
        {children}
      </div>,
      document.body
    )
  }
)

Affix.displayName = 'BolioUIAffix'
export default Affix
