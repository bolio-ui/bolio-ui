import React from 'react'
import useTheme from '../use-theme'
import useClasses from '../use-classes'
import type { AnyElement } from '../utils/types'
import styles from './SliderDot.module.css'

interface Props {
  left: number
  disabled?: boolean
  isClick?: boolean
}

type NativeAttrs = Omit<React.HTMLAttributes<AnyElement>, keyof Props>
export type SliderDotProps = Props & NativeAttrs

const SliderDot = React.forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<SliderDotProps>
>(
  (
    {
      children,
      disabled = false,
      left = 0,
      isClick = false,
      style,
      ...props
    }: React.PropsWithChildren<SliderDotProps>,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const theme = useTheme()
    const classes = useClasses(styles.dot, {
      [styles.disabled]: disabled,
      [styles.click]: isClick
    })

    const dotStyle = {
      left: `${left}%`,
      backgroundColor: disabled ? theme.palette.accents_2 : theme.palette.primary,
      color: disabled ? theme.palette.accents_4 : theme.palette.background,
      '--slider-dot-focus-color': theme.palette.foreground,
      ...style
    } as React.CSSProperties

    return (
      <div className={classes} ref={ref} {...props} style={dotStyle}>
        {children}
      </div>
    )
  }
)

SliderDot.displayName = 'BolioUISliderDot'
export default SliderDot
