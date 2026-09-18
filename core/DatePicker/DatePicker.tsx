import React, { useEffect, useImperativeHandle, useRef, useState } from 'react'
import useTheme from '../use-theme'
import useScale, { withScale } from '../use-scale'
import useClasses from '../use-classes'
import useClickAway from '../utils/use-click-away'
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
      calendarLabel = 'Choose date',
      className = '',
      onBlur,
      ...props
    },
    ref
  ) => {
    const theme = useTheme()
    const { SCALES } = useScale()

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
      onChange && onChange(date)
    }

    const inputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
      const next = event.target.value
      setText(next)
      if (next === '') return commit(null)
      const date = fromISO(next)
      if (date && isInRange(date)) commit(date)
    }

    const blurHandler = (event: React.FocusEvent<HTMLInputElement>) => {
      onBlur && onBlur(event)
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

    return (
      <div ref={rootRef} className={useClasses('datepicker', className)}>
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
          {...props}
        />
        <button
          ref={buttonRef}
          type="button"
          className="toggle"
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
            className="popup"
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
        <style jsx>{`
          .datepicker {
            position: relative;
            display: inline-block;
            font-size: ${SCALES.font(1)};
            width: ${SCALES.width(1, 'initial')};
            height: ${SCALES.height(1, 'auto')};
            padding: ${SCALES.pt(0)} ${SCALES.pr(0)} ${SCALES.pb(0)}
              ${SCALES.pl(0)};
            margin: ${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)}
              ${SCALES.ml(0)};
          }
          input {
            box-sizing: border-box;
            width: 100%;
            min-width: 12.5em;
            height: 2.5em;
            padding: 0 2.75em 0 0.875em;
            font: inherit;
            color: ${theme.palette.foreground};
            background-color: ${theme.palette.background};
            border: 1px solid ${theme.palette.border};
            border-radius: ${theme.layout.radius};
            outline: none;
            transition: border-color 0.15s ease;
          }
          input:focus {
            border-color: ${theme.palette.primary};
          }
          input:disabled {
            cursor: not-allowed;
            color: ${theme.palette.accents_4};
            background-color: ${theme.palette.accents_1};
          }
          .toggle {
            position: absolute;
            top: 0;
            right: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 2.5em;
            height: 2.5em;
            color: ${theme.palette.accents_5};
            cursor: pointer;
            background: transparent;
            border: 0;
            border-radius: ${theme.layout.radius};
          }
          .toggle:hover:not(:disabled) {
            color: ${theme.palette.foreground};
          }
          .toggle:focus-visible {
            outline: 2px solid ${theme.palette.primary};
            outline-offset: -2px;
          }
          .toggle:disabled {
            cursor: not-allowed;
            color: ${theme.palette.accents_3};
          }
          .popup {
            position: absolute;
            top: calc(100% + 4px);
            left: 0;
            z-index: 1100;
            padding: 0.75em;
            background-color: ${theme.palette.background};
            border: 1px solid ${theme.palette.border};
            border-radius: ${theme.layout.radius};
            box-shadow: ${theme.expressiveness.shadowMedium};
          }
        `}</style>
      </div>
    )
  }
)

DatePickerComponent.displayName = 'BolioUIDatePicker'
const DatePicker = withScale(DatePickerComponent)
export default DatePicker
