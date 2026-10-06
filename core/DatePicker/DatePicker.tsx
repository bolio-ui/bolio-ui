import React, { useEffect, useImperativeHandle, useRef, useState } from 'react'
import useTheme from '../use-theme'
import { getColors } from '../Input/styles'
import { NormalTypes } from '../utils/prop-types'
import useScale, { withScale } from '../use-scale'
import useClasses from '../use-classes'
import useClickAway from '../utils/use-click-away'
import styles from './DatePicker.module.css'
import Calendar from '../Calendar'
import { fromISO, startOfDay, toISO } from '../Calendar/date-utils'

interface Props {
  value?: Date | null
  initialValue?: Date | null
  onChange?: (date: Date | null) => void
  min?: Date
  max?: Date
  locale?: string
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
  placeholder?: string
  disabled?: boolean
  type?: NormalTypes
  rounded?: boolean
  filled?: boolean
  light?: boolean
  ghost?: boolean
  subtle?: boolean
  calendarLabel?: string
  className?: string
}

type NativeAttrs = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  keyof Props | 'value' | 'defaultValue' | 'onChange' | 'type' | 'min' | 'max'
>
export type DatePickerProps = Props & NativeAttrs

const DatePickerComponent = React.forwardRef<HTMLInputElement, DatePickerProps>(
  (
    {
      value: customValue,
      initialValue = null,
      onChange,
      min,
      max,
      locale,
      weekStartsOn,
      placeholder = 'YYYY-MM-DD',
      disabled = false,
      type = 'default',
      rounded = false,
      filled = false,
      light = false,
      ghost = false,
      subtle = false,
      calendarLabel = 'Choose date',
      className = '',
      onBlur,
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

    const isControlled = customValue !== undefined
    const [selfValue, setSelfValue] = useState<Date | null>(initialValue)
    const selected = isControlled ? customValue : selfValue
    const selectedText = selected ? toISO(selected) : ''

    const [text, setText] = useState(selectedText)
    const [open, setOpen] = useState(false)

    useEffect(() => {
      setText(selectedText)
    }, [selectedText])

    const rootRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const buttonRef = useRef<HTMLButtonElement>(null)
    useImperativeHandle(ref, () => inputRef.current as HTMLInputElement)
    useClickAway(rootRef, () => setOpen(false))

    const isInRange = (date: Date) =>
      !((min && date < startOfDay(min)) || (max && date > startOfDay(max)))

    const commit = (date: Date | null) => {
      if (!isControlled) setSelfValue(date)
      if (onChange) onChange(date)
    }

    const inputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
      const next = event.target.value
      setText(next)
      if (next === '') return commit(null)
      const date = fromISO(next)
      if (date && isInRange(date)) commit(date)
    }

    const blurHandler = (event: React.FocusEvent<HTMLInputElement>) => {
      if (onBlur) onBlur(event)
      setText(selectedText)
    }

    const pick = (date: Date) => {
      commit(date)
      setText(toISO(date))
      setOpen(false)
      inputRef.current?.focus()
    }

    const keyDownHandler = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key !== 'Escape') return
      event.stopPropagation()
      setOpen(false)
      buttonRef.current?.focus()
    }

    const datepickerStyle = {
      '--datepicker-font-size': SCALES.font(0.875),
      '--datepicker-input-height': SCALES.height(2.25),
      '--datepicker-width': SCALES.width(1, 'initial'),
      '--datepicker-height': SCALES.height(1, 'auto'),
      '--datepicker-padding-top': SCALES.pt(0),
      '--datepicker-padding-right': SCALES.pr(0),
      '--datepicker-padding-bottom': SCALES.pb(0),
      '--datepicker-padding-left': SCALES.pl(0),
      '--datepicker-margin-top': SCALES.mt(0),
      '--datepicker-margin-right': SCALES.mr(0),
      '--datepicker-margin-bottom': SCALES.mb(0),
      '--datepicker-margin-left': SCALES.ml(0),
      '--datepicker-text-color': theme.palette.foreground,
      '--datepicker-bg': theme.palette.background,
      '--datepicker-border-color': theme.palette.border,
      '--datepicker-radius': rounded ? '25px' : theme.layout.radius,
      '--datepicker-popup-radius': theme.layout.radius,
      '--datepicker-field-color': colors.color,
      '--datepicker-field-bg': colors.bgColor,
      '--datepicker-field-border': colors.borderColor,
      '--datepicker-field-hover-bg': colors.hoverBgColor,
      '--datepicker-field-hover-border': colors.hoverBorder,
      '--datepicker-focus-border-color': colors.focusBorder,
      '--datepicker-placeholder-color': colors.placeholderColor,
      '--datepicker-toggle-color': colors.iconColor,
      '--datepicker-toggle-hover-color': colors.color,
      '--datepicker-toggle-disabled-color': colors.iconColor,
      '--datepicker-shadow': theme.expressiveness.shadowMedium
    } as React.CSSProperties

    return (
      <div
        ref={rootRef}
        className={useClasses(styles.datepicker, className)}
        style={datepickerStyle}
      >
        <input
          ref={inputRef}
          type="text"
          autoComplete="off"
          inputMode="numeric"
          value={text}
          placeholder={placeholder}
          disabled={disabled}
          onChange={inputHandler}
          onBlur={blurHandler}
          className={styles.input}
          {...props}
        />
        <button
          ref={buttonRef}
          type="button"
          className={styles.toggle}
          aria-label={calendarLabel}
          aria-haspopup="dialog"
          aria-expanded={open}
          disabled={disabled}
          onClick={() => setOpen((last) => !last)}
        >
          <svg
            viewBox="0 0 24 24"
            width="1.25em"
            height="1.25em"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
          </svg>
        </button>
        {open && (
          <div
            role="dialog"
            aria-label={calendarLabel}
            className={styles.popup}
            onKeyDown={keyDownHandler}
          >
            <Calendar
              autoFocus
              value={selected}
              min={min}
              max={max}
              locale={locale}
              weekStartsOn={weekStartsOn}
              onChange={pick}
            />
          </div>
        )}
      </div>
    )
  }
)

DatePickerComponent.displayName = 'BolioUIDatePicker'
const DatePicker = withScale(DatePickerComponent)
export default DatePicker
