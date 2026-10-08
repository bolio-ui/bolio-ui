import React, { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import useTheme from '../use-theme'
import Button from '../Button'
import usePortal from '../utils/use-portal'
import useLatest from '../utils/use-latest'
import logWarning from '../utils/log-warning'
import { joinClasses } from '../use-classes'
import styles from './Tour.module.css'
import { getSurface } from '../utils/surface'

export interface TourStep {
  // what the step points at: a CSS selector, an element, or a function that
  // returns one. Without a target, or when it is not found, the card is
  // centered and nothing is highlighted.
  target?: string | HTMLElement | (() => HTMLElement | null)
  title: React.ReactNode
  content: React.ReactNode
}

interface Props {
  steps: Array<TourStep>
  open: boolean
  // skip, Escape, or the last step
  onClose: () => void
  // the step in view, to control it
  current?: number
  initialCurrent?: number
  onCurrentChange?: (index: number) => void
  // called when the last step is done, before onClose
  onFinish?: () => void
  previousLabel?: string
  nextLabel?: string
  finishLabel?: string
  skipLabel?: string
  stepLabel?: (index: number, count: number) => string
  // space between the target and the highlight, in px
  spotlightPadding?: number
  className?: string
}

type NativeAttrs = Omit<React.HTMLAttributes<HTMLDivElement>, keyof Props>
export type TourProps = Props & NativeAttrs

const CARD_WIDTH = 320
const MARGIN = 8
const GAP = 8
// below this much room under the target, the card goes above it if there is more
const ROOM_BELOW = 240

const resolve = (target: TourStep['target']): HTMLElement | null =>
  !target
    ? null
    : typeof target === 'string'
      ? document.querySelector<HTMLElement>(target)
      : typeof target === 'function'
        ? target()
        : target

const Tour = React.forwardRef<HTMLDivElement, TourProps>(
  (
    {
      steps,
      open,
      onClose,
      current: customCurrent,
      initialCurrent = 0,
      onCurrentChange,
      onFinish,
      previousLabel = 'Back',
      nextLabel = 'Next',
      finishLabel = 'Done',
      skipLabel = 'Skip',
      stepLabel = (index, count) => `${index + 1} of ${count}`,
      spotlightPadding = 6,
      className = '',
      style,
      onKeyDown,
      ...props
    },
    ref
  ) => {
    const theme = useTheme()
    const portal = usePortal('tour')
    const id = useId()
    const [selfCurrent, setSelfCurrent] = useState(initialCurrent)
    const current = Math.max(
      0,
      Math.min(customCurrent ?? selfCurrent, steps.length - 1)
    )
    const step = steps[current]
    const last = current === steps.length - 1
    const [rect, setRect] = useState<DOMRect | null>(null)
    const card = useRef<HTMLDivElement>(null)
    const previous = useRef<HTMLElement | null>(null)
    const latestSteps = useLatest(steps)

    // points at the target of the step: scrolls it into view and follows it
    useEffect(() => {
      const target = latestSteps.current[current]?.target
      if (!open) return
      const element = resolve(target)
      if (!element) {
        if (target) logWarning('The target of the step was not found.', 'Tour')
        setRect(null)
        return
      }
      element.scrollIntoView?.({ block: 'center', inline: 'nearest' })
      const update = () => setRect(element.getBoundingClientRect())
      update()
      window.addEventListener('resize', update)
      window.addEventListener('scroll', update, true)
      return () => {
        window.removeEventListener('resize', update)
        window.removeEventListener('scroll', update, true)
      }
    }, [open, current, latestSteps])

    // the focus goes to the card, and back to where it was when the tour ends
    useEffect(() => {
      if (!open) return
      previous.current = document.activeElement as HTMLElement | null
      return () => previous.current?.focus?.()
    }, [open])
    useEffect(() => {
      if (open && portal) card.current?.focus({ preventScroll: true })
    }, [open, current, portal])

    if (!open || !step || !portal) return null

    const go = (next: number) => {
      if (customCurrent === undefined) setSelfCurrent(next)
      if (onCurrentChange) onCurrentChange(next)
    }

    const finish = () => {
      if (onFinish) onFinish()
      onClose()
    }

    const keyDownHandler = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (onKeyDown) onKeyDown(event)
      if (event.key === 'Escape') {
        event.stopPropagation()
        return onClose()
      }
      if (event.key !== 'Tab') return
      // the focus stays inside the card
      const buttons = Array.from(
        card.current?.querySelectorAll<HTMLElement>('button') ?? []
      )
      const [first, end] = [buttons[0], buttons[buttons.length - 1]]
      const onCard = document.activeElement === card.current
      if (!first) return
      if (event.shiftKey && (onCard || document.activeElement === first)) {
        event.preventDefault()
        end.focus()
      } else if (
        !event.shiftKey &&
        (onCard || document.activeElement === end)
      ) {
        event.preventDefault()
        first.focus()
      }
    }

    const width = Math.min(CARD_WIDTH, window.innerWidth - 2 * MARGIN)
    const room = rect ? window.innerHeight - rect.bottom : 0
    const above = Boolean(rect && room < ROOM_BELOW && rect.top > room)
    const cardStyle: React.CSSProperties = rect
      ? {
          width,
          left: Math.max(
            MARGIN,
            Math.min(rect.left, window.innerWidth - width - MARGIN)
          ),
          ...(above
            ? { bottom: window.innerHeight - rect.top + spotlightPadding + GAP }
            : { top: rect.bottom + spotlightPadding + GAP })
        }
      : { width }

    // The card floats like the other popups, with the shadow of the theme. On
    // a dark page it is also a surface lighter than the page, which is what
    // makes it stand out from the dimmed page. Black shadow vanishes on a dark
    // page, so there it gets a wide, faint halo of light, with no hard edge.
    const dark = theme.type === 'dark'
    const surface = getSurface(theme)

    const tourStyle = {
      '--tour-color': theme.palette.foreground,
      '--tour-muted': theme.palette.accents_5,
      '--tour-radius': theme.layout.radius,
      '--tour-bg': surface.bg,
      '--tour-shadow': surface.shadow,
      '--tour-dim': dark ? 'rgb(0 0 0 / 60%)' : 'rgb(0 0 0 / 55%)',
      ...style
    } as React.CSSProperties

    return createPortal(
      <div
        ref={ref}
        className={joinClasses(styles.tour, className)}
        {...props}
        style={tourStyle}
        onKeyDown={keyDownHandler}
      >
        {rect ? (
          <div
            className={styles.spotlight}
            style={{
              left: rect.left - spotlightPadding,
              top: rect.top - spotlightPadding,
              width: rect.width + 2 * spotlightPadding,
              height: rect.height + 2 * spotlightPadding
            }}
          />
        ) : (
          <div className={styles.dim} />
        )}
        <div
          ref={card}
          role="dialog"
          aria-modal="true"
          aria-labelledby={`${id}-title`}
          aria-describedby={`${id}-content`}
          tabIndex={-1}
          className={joinClasses(styles.card, { [styles.centered]: !rect })}
          style={cardStyle}
        >
          <div className={styles.count}>{stepLabel(current, steps.length)}</div>
          <div id={`${id}-title`} className={styles.title}>
            {step.title}
          </div>
          <div id={`${id}-content`} className={styles.content}>
            {step.content}
          </div>
          <div className={styles.actions}>
            {!last && (
              <Button auto scale={0.75} effect={false} onClick={onClose}>
                {skipLabel}
              </Button>
            )}
            <span className={styles.spacer} />
            {current > 0 && (
              <Button
                auto
                scale={0.75}
                effect={false}
                onClick={() => go(current - 1)}
              >
                {previousLabel}
              </Button>
            )}
            <Button
              auto
              scale={0.75}
              type="primary"
              effect={false}
              onClick={last ? finish : () => go(current + 1)}
            >
              {last ? finishLabel : nextLabel}
            </Button>
          </div>
        </div>
      </div>,
      portal
    )
  }
)

Tour.displayName = 'BolioUITour'
export default Tour
