import React from 'react'
import useTheme from '../use-theme'
import useClasses from '../use-classes'
import styles from './Overlay.module.css'

interface Props {
  // color of the layer, the page background by default
  color?: string
  // from 0 (clear) to 1 (solid)
  opacity?: number
  // blur in px of what is behind the layer
  blur?: number
  // covers the whole screen instead of the closest positioned parent
  fixed?: boolean
  zIndex?: number
  className?: string
}

type NativeAttrs = Omit<React.HTMLAttributes<HTMLDivElement>, keyof Props>
export type OverlayProps = Props & NativeAttrs

const Overlay = React.forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<OverlayProps>
>(
  (
    {
      color,
      opacity = 0.6,
      blur = 0,
      fixed = false,
      zIndex = 10,
      className = '',
      style,
      children,
      ...props
    },
    ref
  ) => {
    const theme = useTheme()
    const overlayStyle = {
      position: fixed ? 'fixed' : 'absolute',
      zIndex,
      backgroundColor: `color-mix(in srgb, ${color ?? theme.palette.background} ${opacity * 100}%, transparent)`,
      backdropFilter: blur ? `blur(${blur}px)` : undefined,
      ...style
    } as React.CSSProperties

    return (
      <div
        ref={ref}
        className={useClasses(styles.overlay, className)}
        style={overlayStyle}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Overlay.displayName = 'BolioUIOverlay'
export default Overlay
