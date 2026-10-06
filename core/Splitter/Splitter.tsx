import React, { useId, useRef, useState } from 'react'
import useTheme from '../use-theme'
import useScale, { withScale } from '../use-scale'
import useClasses, { joinClasses } from '../use-classes'
import { SplitterPanelContext } from './SplitterContext'
import type { SplitterPanelProps } from './SplitterPanel'
import styles from './Splitter.module.css'

export type SplitterDirection = 'horizontal' | 'vertical'

interface Props {
  // horizontal puts the panels side by side, vertical stacks them
  direction?: SplitterDirection
  // called with the size of every panel, in percent, when one of them changes
  onResize?: (sizes: Array<number>) => void
  handleLabel?: string
  className?: string
}

type NativeAttrs = Omit<React.HTMLAttributes<HTMLDivElement>, keyof Props>
export type SplitterProps = Props & NativeAttrs

type PanelElement = React.ReactElement<SplitterPanelProps>

const initialSizes = (panels: Array<PanelElement>) => {
  const given = panels.map((panel) => panel.props.defaultSize)
  const used = given.reduce<number>((sum, size) => sum + (size ?? 0), 0)
  const open = given.filter((size) => size === undefined).length
  return given.map((size) =>
    size === undefined ? Math.max(0, 100 - used) / open : size
  )
}

const SplitterComponent = React.forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<SplitterProps>
>(
  (
    {
      direction = 'horizontal',
      onResize,
      handleLabel = 'Resize',
      className = '',
      children,
      style,
      ...props
    },
    ref
  ) => {
    const theme = useTheme()
    const { SCALES } = useScale()
    const baseId = useId()
    const panels = React.Children.toArray(children).filter(
      React.isValidElement
    ) as Array<PanelElement>
    const horizontal = direction === 'horizontal'

    const [sizes, setSizes] = useState(() => initialSizes(panels))
    // a panel that comes or goes starts the sizes again
    if (sizes.length !== panels.length) setSizes(initialSizes(panels))

    const elements = useRef<Array<HTMLDivElement | null>>([])
    const drag = useRef<
      { from: number; sizes: Array<number>; room: number } | undefined
    >(undefined)

    const minOf = (index: number) => panels[index].props.minSize ?? 0
    const maxOf = (index: number) => panels[index].props.maxSize ?? 100

    // Moves the line after panel `index`: that panel grows by `delta` percent
    // and the next one shrinks by the same, as far as both of them allow.
    const move = (index: number, delta: number, from: Array<number>) => {
      const [a, b] = [from[index], from[index + 1]]
      const low = Math.max(minOf(index) - a, b - maxOf(index + 1))
      const high = Math.min(maxOf(index) - a, b - minOf(index + 1))
      const applied = Math.min(Math.max(delta, low), high)
      if (!applied && sizes[index] === a) return
      const next = [...from]
      next[index] = a + applied
      next[index + 1] = b - applied
      setSizes(next)
      if (onResize) onResize(next)
    }

    const pointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
      event.currentTarget.setPointerCapture?.(event.pointerId)
      // the room the panels share, without the lines
      const room = elements.current.reduce((sum, element) => {
        const rect = element?.getBoundingClientRect()
        return sum + (rect ? (horizontal ? rect.width : rect.height) : 0)
      }, 0)
      drag.current = {
        from: horizontal ? event.clientX : event.clientY,
        sizes: [...sizes],
        room
      }
    }

    const pointerMove = (
      event: React.PointerEvent<HTMLDivElement>,
      index: number
    ) => {
      const start = drag.current
      if (!start || !start.room) return
      if (!event.currentTarget.hasPointerCapture?.(event.pointerId)) return
      const travelled =
        (horizontal ? event.clientX : event.clientY) - start.from
      move(index, (travelled / start.room) * 100, start.sizes)
    }

    const keyDown = (
      event: React.KeyboardEvent<HTMLDivElement>,
      index: number
    ) => {
      const step = event.shiftKey ? 10 : 1
      const [less, more] = horizontal
        ? ['ArrowLeft', 'ArrowRight']
        : ['ArrowUp', 'ArrowDown']
      const deltas: Record<string, number> = {
        [less]: -step,
        [more]: step,
        Home: -100,
        End: 100
      }
      if (!(event.key in deltas)) return
      event.preventDefault()
      move(index, deltas[event.key], sizes)
    }

    // Grid tracks, not flex sizes: a track of `fr` units does not grow with
    // the padding of the panel, so the panels stay in proportion.
    const template = sizes.map((size) => `minmax(0, ${size}fr)`).join(' auto ')

    const splitterStyle = {
      '--splitter-template': template,
      width: SCALES.width(1, '100%'),
      height: SCALES.height(1, '100%'),
      margin: `${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)} ${SCALES.ml(0)}`,
      '--splitter-line': theme.palette.border,
      '--splitter-active': theme.palette.primary,
      ...style
    } as React.CSSProperties

    return (
      <div
        ref={ref}
        className={useClasses(styles.splitter, className, {
          [styles.horizontal]: horizontal,
          [styles.vertical]: !horizontal
        })}
        {...props}
        style={splitterStyle}
      >
        {panels.map((panel, index) => {
          const [a, b] = [sizes[index], sizes[index + 1]]
          return (
            <React.Fragment key={panel.key ?? index}>
              <SplitterPanelContext.Provider
                value={{
                  id: `${baseId}-panel-${index}`,
                  setElement: (element) => {
                    elements.current[index] = element
                  }
                }}
              >
                {panel}
              </SplitterPanelContext.Provider>
              {index < panels.length - 1 && (
                <div
                  role="separator"
                  tabIndex={0}
                  aria-label={handleLabel}
                  aria-orientation={horizontal ? 'vertical' : 'horizontal'}
                  aria-controls={`${baseId}-panel-${index}`}
                  aria-valuenow={Math.round(a)}
                  aria-valuemin={Math.round(
                    Math.max(minOf(index), a + b - maxOf(index + 1))
                  )}
                  aria-valuemax={Math.round(
                    Math.min(maxOf(index), a + b - minOf(index + 1))
                  )}
                  className={joinClasses(styles.handle)}
                  onPointerDown={pointerDown}
                  onPointerMove={(event) => pointerMove(event, index)}
                  onPointerUp={() => (drag.current = undefined)}
                  onPointerCancel={() => (drag.current = undefined)}
                  onKeyDown={(event) => keyDown(event, index)}
                />
              )}
            </React.Fragment>
          )
        })}
      </div>
    )
  }
)

SplitterComponent.displayName = 'BolioUISplitter'
const Splitter = withScale(SplitterComponent)
export default Splitter
