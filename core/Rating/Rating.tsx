import React, { useEffect, useImperativeHandle, useRef, useState } from 'react'
import type { NormalTypes } from '../utils/prop-types'
import RatingIcon from './RatingIcon'
import useTheme from '../use-theme'
import useScale, { withScale } from '../use-scale'
import { joinClasses } from '../use-classes'
import { isDarkPalette } from '../utils/variant-colors'
import type { AnyElement } from '../utils/types'
import styles from './Rating.module.css'

export type RatingTypes = NormalTypes
// how the empty icons look: only the outline, or filled with a soft color
export type RatingVariants = 'outline' | 'filled'
// the step a user can pick, the value shown can always be any fraction
export type RatingPrecision = 1 | 0.5 | 0.25

type RatingIconProp = React.ReactNode | ((index: number) => React.ReactNode)

interface Props {
  type?: RatingTypes
  variant?: RatingVariants
  className?: string
  // one icon for all, or a function of the position (1 to count) for sets
  // such as faces
  icon?: RatingIconProp
  emptyIcon?: RatingIconProp
  count?: number
  value?: number
  initialValue?: number
  // only when the value changes
  onChange?: (value: number) => void
  // the value under the pointer, or null when it leaves
  onHoverChange?: (value: number | null) => void
  precision?: RatingPrecision
  // shows the score, any fraction, and cannot be changed
  readOnly?: boolean
  disabled?: boolean
  // picking the current value again, or Delete, goes back to 0
  clearable?: boolean
  // only the icon of the value is filled, for faces and similar sets
  highlightSelectedOnly?: boolean
  // writes the number after the icons
  showValue?: boolean
  // name of a hidden field, so a form can submit the value
  name?: string
  // text for assistive tech and the tooltip of the score
  getLabel?: (value: number, count: number) => string
}

type NativeAttrs = Omit<
  React.HTMLAttributes<AnyElement>,
  keyof Props | 'onChange'
>
export type RatingProps = Props & NativeAttrs

const defaultGetLabel = (value: number, count: number) => `${value} of ${count}`

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max)

// Float noise such as 0.30000000000000004 must not reach the screen or onChange
const tidy = (value: number) => Number(value.toFixed(4))

const formatValue = (value: number) => String(Number(value.toFixed(2)))

const renderIcon = (icon: RatingIconProp, index: number) =>
  typeof icon === 'function' ? icon(index) : icon

const RatingComponent = React.forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<RatingProps>
>(
  (
    {
      type = 'default' as RatingTypes,
      variant = 'filled' as RatingVariants,
      className = '',
      icon = <RatingIcon />,
      emptyIcon,
      count = 5,
      value: customValue,
      initialValue = 0,
      onChange,
      onHoverChange,
      precision = 1 as RatingPrecision,
      readOnly = false,
      disabled = false,
      clearable = false,
      highlightSelectedOnly = false,
      showValue = false,
      name,
      getLabel = defaultGetLabel,
      style,
      'aria-label': ariaLabel,
      ...props
    },
    ref
  ) => {
    const theme = useTheme()
    const { SCALES } = useScale()
    const rootRef = useRef<HTMLDivElement>(null)
    useImperativeHandle(ref, () => rootRef.current as HTMLDivElement)

    const [selfValue, setSelfValue] = useState(initialValue)
    // the value under the pointer while it hovers or drags
    const [preview, setPreview] = useState<number | null>(null)
    const dragging = useRef(false)
    // feedback for a press, as on a Button: the icon under the pointer shrinks
    // a little while it is held, and a drip spreads from the icon that was picked
    const [pressing, setPressing] = useState(false)
    const [drip, setDrip] = useState<{ index: number; id: number } | null>(null)
    const [rtl, setRtl] = useState(false)

    useEffect(() => {
      if (rootRef.current)
        setRtl(getComputedStyle(rootRef.current).direction === 'rtl')
    }, [])

    const interactive = !readOnly && !disabled
    const snap = (next: number) =>
      tidy(clamp(Math.round(next / precision) * precision, 0, count))

    // A score to show can be any fraction, such as the 4.3 average of reviews.
    // One to pick is held to the step, so it is always a value the user could
    // have chosen.
    const raw = customValue !== undefined ? customValue : selfValue
    const value = interactive ? snap(raw) : tidy(clamp(raw, 0, count))
    const shown = preview ?? value

    const commit = (next: number) => {
      const target = snap(next)
      if (target === value) return
      if (customValue === undefined) setSelfValue(target)
      if (onChange) onChange(target)
    }

    const hover = (next: number | null) => {
      if (next === preview) return
      setPreview(next)
      if (onHoverChange) onHoverChange(next)
    }

    // The value at a screen position, read from where the icons really are, so
    // gaps, scale and right to left layouts all give the right answer.
    const valueAt = (clientX: number) => {
      const root = rootRef.current
      if (!root) return value
      const items = root.querySelectorAll<HTMLElement>('[data-rating-item]')
      for (let index = 0; index < items.length; index += 1) {
        const rect = items[index].getBoundingClientRect()
        const offset = rtl ? rect.right - clientX : clientX - rect.left
        // in the gap before this icon: the icons before it are full
        if (offset < 0) return Math.max(index, precision)
        if (offset <= rect.width) {
          const part = Math.ceil(offset / rect.width / precision) * precision
          return index + clamp(part, precision, 1)
        }
      }
      return count
    }

    const stop = (event: React.PointerEvent<HTMLDivElement>) => {
      dragging.current = false
      setPressing(false)
      if (event.currentTarget.hasPointerCapture?.(event.pointerId))
        event.currentTarget.releasePointerCapture(event.pointerId)
    }

    const pointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
      if (event.button !== 0) return
      event.currentTarget.setPointerCapture?.(event.pointerId)
      dragging.current = true
      setPressing(true)
      hover(valueAt(event.clientX))
    }

    // Hover is for a mouse or a pen, a finger has nothing to preview until it
    // presses, and then dragging across the icons picks the value.
    const pointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
      if (!dragging.current && event.pointerType === 'touch') return
      hover(valueAt(event.clientX))
    }

    const pointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
      if (!dragging.current) return
      const next = valueAt(event.clientX)
      stop(event)
      const target = clearable && next === value ? 0 : next
      commit(target)
      if (target > 0) setDrip({ index: Math.ceil(target), id: Date.now() })
      // a cleared score would still look full under the pointer
      hover(event.pointerType === 'mouse' && target !== 0 ? next : null)
    }

    const pointerCancel = (event: React.PointerEvent<HTMLDivElement>) => {
      stop(event)
      hover(null)
    }

    const pointerLeave = () => {
      if (!dragging.current) hover(null)
    }

    const keyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      // the arrow that points to the end of the row adds, on any direction
      const forward = rtl ? 'ArrowLeft' : 'ArrowRight'
      const backward = rtl ? 'ArrowRight' : 'ArrowLeft'
      let next: number | null = null
      if (event.key === forward || event.key === 'ArrowUp')
        next = value + precision
      else if (event.key === backward || event.key === 'ArrowDown')
        next = value - precision
      else if (event.key === 'PageUp') next = value + 1
      else if (event.key === 'PageDown') next = value - 1
      else if (event.key === 'Home') next = 0
      else if (event.key === 'End') next = count
      else if (event.key === 'Delete' || event.key === 'Backspace') next = 0
      else if (/^[0-9]$/.test(event.key) && Number(event.key) <= count)
        next = Number(event.key)
      if (next === null) return
      event.preventDefault()
      commit(next)
    }

    const fillOf = (index: number) => {
      if (highlightSelectedOnly) return Math.ceil(shown) === index ? 1 : 0
      return tidy(clamp(shown - (index - 1), 0, 1))
    }

    const colors: { [key in RatingTypes]: string } = {
      default: theme.palette.warning,
      primary: theme.palette.primary,
      secondary: theme.palette.secondary,
      success: theme.palette.success,
      warning: theme.palette.warning,
      error: theme.palette.error,
      info: theme.palette.info
    }
    const dark = isDarkPalette(theme.palette)

    const ratingStyle = {
      '--rating-font-size': SCALES.font(1),
      '--rating-color': colors[type] || colors.default,
      '--rating-empty-color':
        variant === 'filled'
          ? dark
            ? theme.palette.accents_4
            : theme.palette.accents_2
          : theme.palette.accents_4,
      '--rating-empty-fill': variant === 'filled' ? 'currentColor' : 'none',
      '--rating-focus-outline': theme.palette.primary,
      '--rating-value-color': theme.palette.accents_5,
      width: SCALES.width(1, 'auto'),
      height: SCALES.height(1, 'auto'),
      padding: `${SCALES.pt(0)} ${SCALES.pr(0)} ${SCALES.pb(0)} ${SCALES.pl(0)}`,
      margin: `${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)} ${SCALES.ml(0)}`,
      ...style
    } as React.CSSProperties

    const items = Array.from({ length: count }, (_, index) => index + 1)
    const label = getLabel(value, count)
    const rootProps = {
      ref: rootRef,
      className: joinClasses(
        styles.rating,
        {
          [styles.interactive]: interactive,
          [styles.rtl]: rtl,
          [styles.disabled]: disabled
        },
        className
      ),
      style: ratingStyle
    }

    const icons = (
      <>
        {items.map((index) => {
          const fill = fillOf(index)
          return (
            <span
              key={index}
              className={styles.item}
              data-rating-item=""
              data-pressed={
                pressing && Math.ceil(shown) === index ? '' : undefined
              }
            >
              {drip?.index === index && (
                <span
                  key={drip.id}
                  className={styles.drip}
                  data-drip=""
                  onAnimationEnd={() => setDrip(null)}
                />
              )}
              <span className={joinClasses(styles.layer, styles.empty)}>
                {renderIcon(emptyIcon ?? icon, index)}
              </span>
              <span
                className={joinClasses(styles.layer, styles.filled)}
                style={{ '--rating-fill': fill } as React.CSSProperties}
              >
                {renderIcon(icon, index)}
              </span>
            </span>
          )
        })}
        {showValue && (
          <span className={styles.value} aria-hidden="true">
            {formatValue(value)}
          </span>
        )}
        {name && <input type="hidden" name={name} value={value} />}
      </>
    )

    if (!interactive) {
      return (
        <div
          role="img"
          aria-label={ariaLabel ?? label}
          aria-disabled={disabled || undefined}
          {...props}
          {...rootProps}
        >
          {icons}
        </div>
      )
    }

    return (
      <div
        role="slider"
        tabIndex={0}
        aria-label={ariaLabel ?? 'Rating'}
        aria-orientation="horizontal"
        aria-valuemin={0}
        aria-valuemax={count}
        aria-valuenow={value}
        aria-valuetext={label}
        onPointerDown={pointerDown}
        onPointerMove={pointerMove}
        onPointerUp={pointerUp}
        onPointerCancel={pointerCancel}
        onPointerLeave={pointerLeave}
        onKeyDown={keyDown}
        {...props}
        {...rootProps}
      >
        {icons}
      </div>
    )
  }
)

RatingComponent.displayName = 'BolioUIRating'
const Rating = withScale(RatingComponent)
export default Rating
