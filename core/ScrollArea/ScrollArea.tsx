import React, { useEffect, useRef } from 'react'
import useTheme from '../use-theme'
import useScale, { withScale } from '../use-scale'
import useClasses from '../use-classes'
import useMergedRef from '../use-merged-ref'
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
    const innerRef = useRef<HTMLDivElement>(null)
    const mergedRef = useMergedRef(ref, innerRef)
    const { SCALES } = useScale()

    // the wheel and a vertical trackpad swipe scroll a sideways area, until
    // it reaches an end, where the page takes over again
    useEffect(() => {
      const node = innerRef.current
      if (!node || orientation !== 'horizontal') return
      const onWheel = (event: WheelEvent) => {
        if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return
        const max = node.scrollWidth - node.clientWidth
        const next = Math.min(max, Math.max(0, node.scrollLeft + event.deltaY))
        if (next === node.scrollLeft) return
        event.preventDefault()
        node.scrollLeft = next
      }
      node.addEventListener('wheel', onWheel, { passive: false })
      return () => node.removeEventListener('wheel', onWheel)
    }, [orientation])

    const classes = useClasses(
      styles.scrollArea,
      styles[orientation],
      { [styles.hover]: scrollbar === 'hover' },
      className
    )

    const scrollStyle = {
      width: SCALES.width(1, '100%'),
      height: SCALES.height(1, 'auto'),
      padding: `${SCALES.pt(0)} ${SCALES.pr(0)} ${SCALES.pb(orientation === 'vertical' ? 0 : 0.5)} ${SCALES.pl(0)}`,
      margin: `${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)} ${SCALES.ml(0)}`,
      '--scroll-thumb-visible': theme.palette.accents_3,
      '--scroll-thumb-active': theme.palette.accents_4,
      '--scroll-focus': theme.palette.foreground,
      ...style
    } as React.CSSProperties

    // the area scrolls with the keyboard only when it can take focus
    return (
      <div
        ref={mergedRef}
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
