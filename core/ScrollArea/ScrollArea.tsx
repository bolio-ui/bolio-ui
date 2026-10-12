import React from 'react'
import useTheme from '../use-theme'
import useScale, { withScale } from '../use-scale'
import useClasses from '../use-classes'
import styles from './ScrollArea.module.css'

export type ScrollAreaOrientation = 'vertical' | 'horizontal' | 'both'

interface Props {
  orientation?: ScrollAreaOrientation
  // `hover` hides the scrollbar until the pointer or the focus is inside
  scrollbar?: 'always' | 'hover'
  className?: string
}

type NativeAttrs = Omit<React.HTMLAttributes<HTMLDivElement>, keyof Props>
export type ScrollAreaProps = Props & NativeAttrs

const ScrollAreaComponent = React.forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<ScrollAreaProps>
>(
  (
    {
      orientation = 'vertical',
      scrollbar = 'always',
      className = '',
      style,
      children,
      ...props
    },
    ref
  ) => {
    const theme = useTheme()
    const { SCALES } = useScale()
    const classes = useClasses(
      styles.scrollArea,
      styles[orientation],
      { [styles.hover]: scrollbar === 'hover' },
      className
    )

    const scrollStyle = {
      width: SCALES.width(1, '100%'),
      height: SCALES.height(1, 'auto'),
      padding: `${SCALES.pt(0)} ${SCALES.pr(0)} ${SCALES.pb(0)} ${SCALES.pl(0)}`,
      margin: `${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)} ${SCALES.ml(0)}`,
      '--scroll-thumb-visible': theme.palette.accents_3,
      '--scroll-focus': theme.palette.foreground,
      ...style
    } as React.CSSProperties

    // the area scrolls with the keyboard only when it can take focus
    return (
      <div
        ref={ref}
        className={classes}
        tabIndex={0}
        {...props}
        style={scrollStyle}
      >
        {children}
      </div>
    )
  }
)

ScrollAreaComponent.displayName = 'BolioUIScrollArea'
const ScrollArea = withScale(ScrollAreaComponent)
export default ScrollArea
