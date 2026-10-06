import React, { useEffect, useId, useState } from 'react'
import useTheme from '../use-theme'
import useScale, { withScale } from '../use-scale'
import useClasses from '../use-classes'
import InputBlockLabel from '../Input/InputBlockLabel'
import { getColors } from '../Input/styles'
import { NormalTypes } from '../utils/prop-types'
import styles from './NumberInput.module.css'

interface Props {
  value?: number | null
  initialValue?: number | null
  onChange?: (value: number | null) => void
  min?: number
  max?: number
  step?: number
  // decimal places kept; the ones of `step` when missing
  precision?: number
  type?: NormalTypes
  rounded?: boolean
  filled?: boolean
  light?: boolean
  ghost?: boolean
  subtle?: boolean
  disabled?: boolean
  readOnly?: boolean
  hideControls?: boolean
  error?: boolean
  errorMessage?: string
  className?: string
}

type NativeAttrs = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  keyof Props | 'defaultValue' | 'role'
>
export type NumberInputProps = Props & NativeAttrs

const decimalsOf = (num: number) => {
  const [, decimals = ''] = String(num).split('.')
  return decimals.length
}

// digits with an optional minus sign and one decimal separator, while typing
const PARTIAL_NUMBER = /^-?\d*([.,]\d*)?$/

const parse = (text: string): number | null => {
  const normalized = text.replace(',', '.')
  if (normalized === '' || normalized === '-' || normalized === '.') return null
  const num = Number(normalized)
  return Number.isNaN(num) ? null : num
}

const NumberInputComponent = React.forwardRef<
  HTMLInputElement,
  React.PropsWithChildren<NumberInputProps>
>(
  (
    {
      value: customValue,
      initialValue = null,
      onChange,
      min,
      max,
      step = 1,
      precision,
      type = 'default',
      rounded = false,
      filled = false,
      light = false,
      ghost = false,
      subtle = false,
      disabled = false,
      readOnly = false,
      hideControls = false,
      error = false,
      errorMessage,
      className = '',
      children,
      onKeyDown,
      onBlur,
      ...props
    },
    ref
  ) => {
    const theme = useTheme()
    const { SCALES } = useScale()
    const generatedId = useId()
    const inputId = props.id || generatedId
    const errorId = `${inputId}-error`
    const describedBy =
      [props['aria-describedby'], error && errorMessage ? errorId : undefined]
        .filter(Boolean)
        .join(' ') || undefined
    const colors = getColors(theme.palette, type, disabled, {
      filled,
      light,
      ghost,
      subtle
    })
    const places = precision ?? decimalsOf(step)

    const isControlled = customValue !== undefined
    const [selfValue, setSelfValue] = useState<number | null>(initialValue)
    const value = isControlled ? customValue : selfValue
    const format = (num: number | null) => (num === null ? '' : String(num))
    const [text, setText] = useState(format(value))

    // a new value from outside replaces the text, unless the text already
    // means it ("1." while typing "1.5")
    useEffect(() => {
      if (parse(text) !== value) setText(format(value))
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value])

    const clamp = (num: number) => {
      let next = num
      if (max !== undefined) next = Math.min(next, max)
      if (min !== undefined) next = Math.max(next, min)
      return Number(next.toFixed(places))
    }

    const commit = (next: number | null) => {
      setText(format(next))
      if (next === value) return
      if (!isControlled) setSelfValue(next)
      onChange?.(next)
    }

    const locked = disabled || readOnly
    const increment = (direction: 1 | -1, multiplier = 1) => {
      if (locked) return
      commit(clamp((value ?? 0) + direction * step * multiplier))
    }

    const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
      const next = event.target.value
      if (!PARTIAL_NUMBER.test(next)) return
      setText(next)
      const parsed = parse(next)
      if (parsed === value) return
      if (!isControlled) setSelfValue(parsed)
      onChange?.(parsed)
    }

    const blurHandler = (event: React.FocusEvent<HTMLInputElement>) => {
      onBlur?.(event)
      const parsed = parse(text)
      commit(parsed === null ? null : clamp(parsed))
    }

    const keyDownHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
      onKeyDown?.(event)
      if (event.defaultPrevented) return
      const actions: Record<string, () => void> = {
        ArrowUp: () => increment(1),
        ArrowDown: () => increment(-1),
        PageUp: () => increment(1, 10),
        PageDown: () => increment(-1, 10),
        Home: () => min !== undefined && !locked && commit(min),
        End: () => max !== undefined && !locked && commit(max)
      }
      const action = actions[event.key]
      if (!action) return
      event.preventDefault()
      action()
    }

    const atMin = min !== undefined && value !== null && value <= min
    const atMax = max !== undefined && value !== null && value >= max

    const control = (direction: 1 | -1) => (
      <button
        type="button"
        // the spinbutton pattern keeps these out of the tab order: the
        // arrow keys do the same from the input
        tabIndex={-1}
        className={styles.control}
        aria-label={direction === 1 ? 'Increase' : 'Decrease'}
        aria-controls={inputId}
        disabled={disabled || readOnly || (direction === 1 ? atMax : atMin)}
        // keep the focus in the input
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => increment(direction)}
      >
        <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true">
          <path
            d={direction === 1 ? 'M12 5v14M5 12h14' : 'M5 12h14'}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
    )

    const withLabelStyle: React.CSSProperties = {
      '--input-height': SCALES.height(2.25),
      fontSize: SCALES.font(0.875),
      width: SCALES.width(1, 'initial'),
      margin: `${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)} ${SCALES.ml(0)}`
    } as React.CSSProperties

    const numberInputStyle = {
      '--input-border': colors.borderColor,
      '--input-radius': rounded ? '25px' : theme.layout.radius,
      '--input-bg': colors.bgColor,
      '--input-hover-border': colors.hoverBorder,
      '--input-hover-bg': colors.hoverBgColor,
      '--input-focus-border': colors.focusBorder,
      '--input-placeholder-color': colors.placeholderColor,
      '--input-color': colors.color,
      '--control-color': colors.iconColor,
      '--control-hover-color': colors.color,
      '--control-disabled-color': theme.palette.accents_3
    } as React.CSSProperties

    return (
      <div
        className={useClasses(styles.withLabel, className)}
        style={withLabelStyle}
      >
        {children && (
          <InputBlockLabel htmlFor={inputId}>{children}</InputBlockLabel>
        )}
        <div
          className={useClasses(styles.numberInput, {
            [styles.disabled]: disabled
          })}
          style={numberInputStyle}
        >
          {!hideControls && control(-1)}
          <input
            ref={ref}
            type="text"
            role="spinbutton"
            inputMode={places > 0 ? 'decimal' : 'numeric'}
            autoComplete="off"
            value={text}
            disabled={disabled}
            readOnly={readOnly}
            onChange={changeHandler}
            onKeyDown={keyDownHandler}
            onBlur={blurHandler}
            {...props}
            id={inputId}
            aria-valuenow={value ?? undefined}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-invalid={error || undefined}
            aria-describedby={describedBy}
            className={styles.input}
            style={{
              textAlign: hideControls ? 'left' : 'center',
              ...(props as { style?: React.CSSProperties }).style
            }}
          />
          {!hideControls && control(1)}
        </div>
        {error && (
          <InputBlockLabel error={error} id={errorId}>
            {errorMessage}
          </InputBlockLabel>
        )}
      </div>
    )
  }
)

NumberInputComponent.displayName = 'BolioUINumberInput'
const NumberInput = withScale(NumberInputComponent)
export default NumberInput
