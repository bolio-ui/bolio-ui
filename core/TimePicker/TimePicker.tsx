import React, { useEffect, useRef, useState } from 'react'
import useTheme from '../use-theme'
import { getColors } from '../Input/styles'
import type { NormalTypes } from '../utils/prop-types'
import useScale, { withScale } from '../use-scale'
import useClasses from '../use-classes'
import styles from './TimePicker.module.css'

interface Props {
  value?: string
  initialValue?: string
  onChange?: (value: string) => void
  withSeconds?: boolean
  format?: '12h' | '24h'
  hoursStep?: number
  minutesStep?: number
  secondsStep?: number
  hoursLabel?: string
  minutesLabel?: string
  secondsLabel?: string
  amPmLabel?: string
  amPmLabels?: { am: string; pm: string }
  disabled?: boolean
  type?: NormalTypes
  rounded?: boolean
  filled?: boolean
  light?: boolean
  ghost?: boolean
  subtle?: boolean
  className?: string
}

type NativeAttrs = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  keyof Props | 'onChange' | 'defaultValue'
>
export type TimePickerProps = Props & NativeAttrs

type Period = '' | 'AM' | 'PM'
type Parts = { h: string; m: string; s: string; p: Period }
type Segment = 'h' | 'm' | 's'

const pad = (value: number) => String(value).padStart(2, '0')

// "13:05" or "13:05:09" (24h) into the text of each segment.
const parse = (value: string | undefined, twelve: boolean): Parts => {
  const match = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/.exec(value || '')
  if (!match) return { h: '', m: '', s: '', p: '' }
  const hours = Number(match[1])
  return {
    h: pad(twelve ? hours % 12 || 12 : hours),
    m: match[2],
    s: match[3] || '',
    p: twelve ? (hours >= 12 ? 'PM' : 'AM') : ''
  }
}

const TimePickerComponent = React.forwardRef<HTMLDivElement, TimePickerProps>(
  (
    {
      value: customValue,
      initialValue = '',
      onChange,
      withSeconds = false,
      format = '24h',
      hoursStep = 1,
      minutesStep = 1,
      secondsStep = 1,
      hoursLabel = 'Hours',
      minutesLabel = 'Minutes',
      secondsLabel = 'Seconds',
      amPmLabel = 'AM or PM',
      amPmLabels = { am: 'AM', pm: 'PM' },
      disabled = false,
      type = 'default',
      rounded = false,
      filled = false,
      light = false,
      ghost = false,
      subtle = false,
      className = '',
      style,
      ...props
    },
    ref
  ) => {
    const theme = useTheme()
    const { SCALES } = useScale()
    const colors = getColors(theme.palette, type, disabled, {
      filled,
      light,
      ghost,
      subtle
    })
    const twelve = format === '12h'
    const segments: Segment[] = withSeconds ? ['h', 'm', 's'] : ['h', 'm']

    const [parts, setParts] = useState(() =>
      parse(customValue ?? initialValue, twelve)
    )
    const inputs = useRef<Array<HTMLInputElement | null>>([])
    const amPm = useRef<HTMLSelectElement>(null)
    // The last value reported, so the same time is not reported twice and a
    // controlled value that comes back from the parent is not parsed again.
    const reported = useRef(customValue ?? initialValue)

    useEffect(() => {
      if (customValue === undefined || customValue === reported.current) return
      reported.current = customValue
      setParts(parse(customValue, twelve))
    }, [customValue, twelve])

    const limits = (segment: Segment) =>
      segment === 'h'
        ? { min: twelve ? 1 : 0, max: twelve ? 12 : 23 }
        : { min: 0, max: 59 }
    const steps = { h: hoursStep, m: minutesStep, s: secondsStep }

    // The time as "HH:mm[:ss]" once every segment is filled, "" when all are
    // empty, and null while it is half typed.
    const compose = (next: Parts) => {
      const filled = segments.map((s) => next[s])
      if (twelve) filled.push(next.p)
      if (filled.every((text) => text === '')) return ''
      if (filled.some((text) => text === '')) return null
      const hours = twelve
        ? (Number(next.h) % 12) + (next.p === 'PM' ? 12 : 0)
        : Number(next.h)
      return [hours, ...segments.slice(1).map((s) => Number(next[s]))]
        .map(pad)
        .join(':')
    }

    const update = (next: Parts) => {
      setParts(next)
      const result = compose(next)
      if (result === null || result === reported.current) return
      reported.current = result
      if (onChange) onChange(result)
    }

    const focusSegment = (index: number) => {
      const target =
        index < segments.length ? inputs.current[index] : amPm.current
      target?.focus()
    }

    const typeHandler = (index: number, text: string) => {
      const segment = segments[index]
      const { min, max } = limits(segment)
      const digits = text.replace(/\D/g, '').slice(-2)
      if (digits === '') return update({ ...parts, [segment]: '' })
      let number = Number(digits)
      if (digits.length === 2) number = Math.min(Math.max(number, min), max)
      update({
        ...parts,
        [segment]: digits.length === 2 ? pad(number) : digits
      })
      // two digits, or a first digit that cannot start a bigger number
      if (digits.length === 2 || number * 10 > max) focusSegment(index + 1)
    }

    const blurHandler = (index: number) => {
      const segment = segments[index]
      if (parts[segment] === '') return
      const { min, max } = limits(segment)
      const number = Math.min(Math.max(Number(parts[segment]), min), max)
      if (pad(number) !== parts[segment])
        update({ ...parts, [segment]: pad(number) })
    }

    const keyDownHandler = (
      event: React.KeyboardEvent<HTMLInputElement>,
      index: number
    ) => {
      const segment = segments[index]
      const input = event.currentTarget
      if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        event.preventDefault()
        const direction = event.key === 'ArrowUp' ? 1 : -1
        const { min, max } = limits(segment)
        const size = max - min + 1
        const number =
          parts[segment] === ''
            ? direction > 0
              ? min
              : max
            : ((((Number(parts[segment]) - min + direction * steps[segment]) %
                size) +
                size) %
                size) +
              min
        return update({ ...parts, [segment]: pad(number) })
      }
      if (event.key === 'Backspace' && input.value === '' && index > 0) {
        event.preventDefault()
        return focusSegment(index - 1)
      }
      if (
        event.key === 'ArrowLeft' &&
        index > 0 &&
        input.selectionStart === 0 &&
        input.selectionEnd === 0
      ) {
        event.preventDefault()
        return focusSegment(index - 1)
      }
      if (
        event.key === 'ArrowRight' &&
        input.selectionStart === input.value.length &&
        input.selectionEnd === input.value.length
      ) {
        event.preventDefault()
        focusSegment(index + 1)
      }
    }

    const labels = { h: hoursLabel, m: minutesLabel, s: secondsLabel }
    const pickerStyle = {
      '--time-picker-font-size': SCALES.font(0.875),
      '--time-picker-height': SCALES.height(2.25),
      '--time-picker-width': SCALES.width(1, 'initial'),
      '--time-picker-padding-top': SCALES.pt(0),
      '--time-picker-padding-right': SCALES.pr(0),
      '--time-picker-padding-bottom': SCALES.pb(0),
      '--time-picker-padding-left': SCALES.pl(0),
      '--time-picker-margin-top': SCALES.mt(0),
      '--time-picker-margin-right': SCALES.mr(0),
      '--time-picker-margin-bottom': SCALES.mb(0),
      '--time-picker-margin-left': SCALES.ml(0),
      '--time-picker-radius': rounded ? '25px' : theme.layout.radius,
      '--time-picker-color': colors.color,
      '--time-picker-bg': colors.bgColor,
      '--time-picker-border': colors.borderColor,
      '--time-picker-hover-bg': colors.hoverBgColor,
      '--time-picker-hover-border': colors.hoverBorder,
      '--time-picker-focus-border': colors.focusBorder,
      '--time-picker-placeholder': colors.placeholderColor,
      ...style
    } as React.CSSProperties

    return (
      <div
        ref={ref}
        role="group"
        aria-disabled={disabled || undefined}
        className={useClasses(styles.picker, className)}
        style={pickerStyle}
        {...props}
      >
        <div className={styles.field}>
          {segments.map((segment, index) => (
            <React.Fragment key={segment}>
              {index > 0 && (
                <span className={styles.separator} aria-hidden="true">
                  :
                </span>
              )}
              <input
                ref={(element) => {
                  inputs.current[index] = element
                }}
                type="text"
                inputMode="numeric"
                autoComplete="off"
                aria-label={labels[segment]}
                placeholder="--"
                value={parts[segment]}
                disabled={disabled}
                className={styles.segment}
                onChange={(event) => typeHandler(index, event.target.value)}
                onKeyDown={(event) => keyDownHandler(event, index)}
                onFocus={(event) => event.target.select()}
                onBlur={() => blurHandler(index)}
              />
            </React.Fragment>
          ))}
          {twelve && (
            <select
              ref={amPm}
              aria-label={amPmLabel}
              value={parts.p}
              disabled={disabled}
              className={styles.period}
              onChange={(event) =>
                update({ ...parts, p: event.target.value as Period })
              }
            >
              <option value="" />
              <option value="AM">{amPmLabels.am}</option>
              <option value="PM">{amPmLabels.pm}</option>
            </select>
          )}
        </div>
      </div>
    )
  }
)

TimePickerComponent.displayName = 'BolioUITimePicker'
const TimePicker = withScale(TimePickerComponent)
export default TimePicker
