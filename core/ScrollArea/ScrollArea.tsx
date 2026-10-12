import React, { useCallback, useEffect, useRef, useState } from 'react'
import useTheme from '../use-theme'
import useScale, { withScale } from '../use-scale'
import useClasses, { joinClasses } from '../use-classes'
import useMergedRef from '../use-merged-ref'
import styles from './ScrollArea.module.css'

export type ScrollAreaOrientation = 'vertical' | 'horizontal' | 'both'

interface Props {
  orientation?: ScrollAreaOrientation
  // `hover` hides the scrollbar until the pointer or the focus is inside
  scrollbar?: 'always' | 'hover'
  // goes to the root; the native props go to the scrolling element
  className?: string
}

type NativeAttrs = Omit<React.HTMLAttributes<HTMLDivElement>, keyof Props>
export type ScrollAreaProps = Props & NativeAttrs

type Axis = 'x' | 'y'
// size and offset in px along the track; null while nothing scrolls
type Thumb = { size: number; offset: number } | null
type Thumbs = Record<Axis, Thumb>

const minThumb = 24
const noThumbs: Thumbs = { x: null, y: null }

const measure = (node: HTMLElement, axis: Axis): Thumb => {
  const horizontal = axis === 'x'
  const scroll = horizontal ? node.scrollWidth : node.scrollHeight
  const client = horizontal ? node.clientWidth : node.clientHeight
  if (scroll <= client) return null
  const position = horizontal ? node.scrollLeft : node.scrollTop
  const size = Math.max(minThumb, (client * client) / scroll)
  return {
    size,
    offset: (position / (scroll - client)) * (client - size)
  }
}

const same = (a: Thumb, b: Thumb) =>
  a === b || (!!a && !!b && a.size === b.size && a.offset === b.offset)

// Chrome and Safari style the native scrollbar; Firefox keeps an overlay one
// that never shows on hover, so there the area draws its own thumbs
const hasStyledScrollbar = () =>
  typeof CSS === 'undefined' ||
  typeof CSS.supports !== 'function' ||
  CSS.supports('selector(::-webkit-scrollbar)')

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
    const viewportRef = useRef<HTMLDivElement>(null)
    const mergedRef = useMergedRef(ref, viewportRef)
    const { SCALES } = useScale()
    const [custom, setCustom] = useState(false)
    const [thumbs, setThumbs] = useState<Thumbs>(noThumbs)
    const drag = useRef<{ axis: Axis; pointer: number; scroll: number } | null>(
      null
    )

    useEffect(() => setCustom(!hasStyledScrollbar()), [])

    // the wheel and a vertical trackpad swipe scroll a sideways area, until
    // it reaches an end, where the page takes over again
    useEffect(() => {
      const node = viewportRef.current
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

    const update = useCallback(() => {
      const node = viewportRef.current
      if (!node) return
      const x = orientation === 'vertical' ? null : measure(node, 'x')
      const y = orientation === 'horizontal' ? null : measure(node, 'y')
      setThumbs((prev) =>
        same(prev.x, x) && same(prev.y, y) ? prev : { x, y }
      )
    }, [orientation])

    useEffect(() => {
      const node = viewportRef.current
      if (!custom || !node) return
      update()
      node.addEventListener('scroll', update)
      const resize = new ResizeObserver(update)
      resize.observe(node)
      const mutation = new MutationObserver(update)
      mutation.observe(node, {
        childList: true,
        subtree: true,
        characterData: true
      })
      return () => {
        node.removeEventListener('scroll', update)
        resize.disconnect()
        mutation.disconnect()
      }
    }, [custom, update])

    const onThumbDown = (axis: Axis) => (event: React.PointerEvent) => {
      const node = viewportRef.current
      if (!node) return
      event.currentTarget.setPointerCapture(event.pointerId)
      drag.current = {
        axis,
        pointer: axis === 'x' ? event.clientX : event.clientY,
        scroll: axis === 'x' ? node.scrollLeft : node.scrollTop
      }
    }

    const onThumbMove = (event: React.PointerEvent) => {
      const node = viewportRef.current
      const start = drag.current
      if (!node || !start) return
      const horizontal = start.axis === 'x'
      const thumb = thumbs[start.axis]
      if (!thumb) return
      const scroll = horizontal ? node.scrollWidth : node.scrollHeight
      const client = horizontal ? node.clientWidth : node.clientHeight
      const delta = (horizontal ? event.clientX : event.clientY) - start.pointer
      const next =
        start.scroll + (delta * (scroll - client)) / (client - thumb.size)
      if (horizontal) node.scrollLeft = next
      else node.scrollTop = next
    }

    const classes = useClasses(
      styles.scrollArea,
      { [styles.hover]: scrollbar === 'hover' },
      className
    )
    const viewportClasses = useClasses(styles.viewport, styles[orientation], {
      [styles.custom]: custom
    })

    const rootStyle = {
      width: SCALES.width(1, '100%'),
      height: SCALES.height(1, 'auto'),
      margin: `${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)} ${SCALES.ml(0)}`,
      '--scroll-thumb-visible': theme.palette.accents_5,
      '--scroll-thumb-active': theme.palette.accents_6,
      '--scroll-focus': theme.palette.foreground,
      ...style
    } as React.CSSProperties

    const viewportStyle: React.CSSProperties = {
      padding: `${SCALES.pt(0)} ${SCALES.pr(0)} ${SCALES.pb(orientation === 'vertical' ? 0 : 0.5)} ${SCALES.pl(0)}`
    }

    return (
      <div className={classes} style={rootStyle}>
        {/* the area scrolls with the keyboard only when it can take focus */}
        <div
          ref={mergedRef}
          className={viewportClasses}
          tabIndex={0}
          {...props}
          style={viewportStyle}
        >
          {children}
        </div>
        {custom &&
          (['x', 'y'] as const).map((axis) => {
            const thumb = thumbs[axis]
            if (!thumb) return null
            const horizontal = axis === 'x'
            return (
              <div
                key={axis}
                className={joinClasses(
                  styles.track,
                  horizontal ? styles.trackX : styles.trackY
                )}
                aria-hidden
              >
                <div
                  className={styles.thumb}
                  style={
                    horizontal
                      ? {
                          width: thumb.size,
                          transform: `translateX(${thumb.offset}px)`
                        }
                      : {
                          height: thumb.size,
                          transform: `translateY(${thumb.offset}px)`
                        }
                  }
                  onPointerDown={onThumbDown(axis)}
                  onPointerMove={onThumbMove}
                  onPointerUp={() => (drag.current = null)}
                  onPointerCancel={() => (drag.current = null)}
                />
              </div>
            )
          })}
      </div>
    )
  }
)

ScrollAreaComponent.displayName = 'BolioUIScrollArea'
const ScrollArea = withScale(ScrollAreaComponent)
export default ScrollArea
