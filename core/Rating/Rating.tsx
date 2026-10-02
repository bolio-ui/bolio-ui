import React, { useId, useState } from 'react'
import { NormalTypes } from '../utils/prop-types'
import RatingIcon from './RatingIcon'
import useTheme from '../use-theme'
import useScale, { withScale } from '../use-scale'
import { joinClasses } from '../use-classes'
import type { AnyElement } from '../utils/types'
import styles from './Rating.module.css'

export type RatingTypes = NormalTypes
// how the empty icons look: only the outline, or filled with a soft color
export type RatingVariants = 'outline' | 'filled'
export type RatingPrecision = 1 | 0.5

interface Props {
  type?: RatingTypes
  variant?: RatingVariants
  className?: string
  icon?: React.ReactNode
  emptyIcon?: React.ReactNode
  count?: number
  value?: number
  initialValue?: number
  onChange?: (value: number) => void
  onHoverChange?: (value: number | null) => void
  precision?: RatingPrecision
  readOnly?: boolean
  disabled?: boolean
  clearable?: boolean
  highlightSelectedOnly?: boolean
  getLabel?: (value: number, count: number) => string
}

type NativeAttrs = Omit<React.HTMLAttributes<AnyElement>, keyof Props>
export type RatingProps = Props & NativeAttrs

const defaultGetLabel = (value: number, count: number) => `${value} of ${count}`

const RatingComponent = React.forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<RatingProps>
>(
  (
    {
      type = 'default' as RatingTypes,
      variant = 'outline' as RatingVariants,
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
      getLabel = defaultGetLabel,
      style,
      ...props
    },
    ref
  ) => {
    const theme = useTheme()
    const { SCALES } = useScale()
    const name = useId()

    const [selfValue, setSelfValue] = useState(initialValue)
    const [hovered, setHovered] = useState<number | null>(null)

    const round = (next: number) =>
      Math.min(Math.max(Math.round(next / precision) * precision, 0), count)
    const value = round(customValue !== undefined ? customValue : selfValue)
    const shown = hovered ?? value
    const interactive = !readOnly && !disabled

    const palette = theme.palette
    const colors: { [key in RatingTypes]: string } = {
      default: palette.warning,
      primary: palette.primary,
      secondary: palette.secondary,
      success: palette.success,
      warning: palette.warning,
      error: palette.error,
      info: palette.info
    }

    const commit = (next: number) => {
      if (customValue === undefined) setSelfValue(next)
      if (onChange) onChange(next)
    }

    const hover = (next: number | null) => {
      if (next === hovered) return
      setHovered(next)
      if (onHoverChange) onHoverChange(next)
    }

    const fillOf = (index: number) => {
      if (highlightSelectedOnly) return Math.ceil(shown) === index ? 1 : 0
      return Math.min(Math.max(shown - (index - 1), 0), 1)
    }

    const steps = precision === 0.5 ? [0.5, 1] : [1]

    const ratingStyle = {
      '--rating-font-size': SCALES.font(1),
      '--rating-color': colors[type] || colors.default,
      '--rating-empty-color':
        variant === 'filled' ? palette.accents_2 : palette.accents_4,
      '--rating-empty-fill': variant === 'filled' ? 'currentColor' : 'none',
      '--rating-focus-outline': palette.primary,
      width: SCALES.width(1, 'auto'),
      height: SCALES.height(1, 'auto'),
      padding: `${SCALES.pt(0)} ${SCALES.pr(0)} ${SCALES.pb(0)} ${SCALES.pl(0)}`,
      margin: `${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)} ${SCALES.ml(0)}`,
      ...style
    } as React.CSSProperties

    const items = Array.from({ length: count }, (_, index) => index + 1)
    const layers = (index: number) => (
      <>
        <span className={joinClasses(styles.layer, styles.empty)}>
          {emptyIcon ?? icon}
        </span>
        <span
          className={joinClasses(styles.layer, styles.filled)}
          style={{ clipPath: `inset(0 ${(1 - fillOf(index)) * 100}% 0 0)` }}
        >
          {icon}
        </span>
      </>
    )

    if (!interactive) {
      return (
        <div
          ref={ref}
          role="img"
          aria-label={getLabel(value, count)}
          aria-disabled={disabled || undefined}
          className={joinClasses(
            styles.rating,
            { [styles.disabled]: disabled },
            className
          )}
          {...props}
          style={ratingStyle}
        >
          {items.map((index) => (
            <span key={index} className={styles.item} aria-hidden="true">
              {layers(index)}
            </span>
          ))}
        </div>
      )
    }

    return (
      <div
        ref={ref}
        role="radiogroup"
        className={joinClasses(styles.rating, className)}
        onMouseLeave={() => hover(null)}
        {...props}
        style={ratingStyle}
      >
        <input
          type="radio"
          className={styles.input}
          name={name}
          value={0}
          checked={value === 0}
          aria-label={getLabel(0, count)}
          onChange={() => commit(0)}
        />
        {items.map((index) => (
          <span key={index} className={styles.item}>
            {layers(index)}
            {steps.map((step) => {
              const stepValue = index - 1 + step
              return (
                <label
                  key={step}
                  className={joinClasses(styles.hit, {
                    [styles.half]: precision === 0.5 && step === 0.5,
                    [styles.full]: precision === 0.5 && step === 1
                  })}
                  onMouseEnter={() => hover(stepValue)}
                >
                  <input
                    type="radio"
                    className={styles.input}
                    name={name}
                    value={stepValue}
                    checked={value === stepValue}
                    aria-label={getLabel(stepValue, count)}
                    onChange={() => commit(stepValue)}
                    onClick={() => {
                      if (clearable && value === stepValue) commit(0)
                    }}
                    onFocus={() => hover(stepValue)}
                    onBlur={() => hover(null)}
                  />
                </label>
              )
            })}
          </span>
        ))}
      </div>
    )
  }
)

RatingComponent.displayName = 'BolioUIRating'
const Rating = withScale(RatingComponent)
export default Rating
