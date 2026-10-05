import React, { useRef, useState } from 'react'
import useTheme from '../use-theme'
import useScale, { withScale } from '../use-scale'
import useClasses from '../use-classes'
import { getColors } from '../Input/styles'
import { NormalTypes } from '../utils/prop-types'
import styles from './PinInput.module.css'

interface Props {
  // number of boxes
  length?: number
  value?: string
  initialValue?: string
  onChange?: (value: string) => void
  // called when every box is filled
  onComplete?: (value: string) => void
  // digits only
  numeric?: boolean
  // hides the characters, like a password
  mask?: boolean
  boxLabel?: (index: number, length: number) => string
  disabled?: boolean
  error?: boolean
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
  keyof Props | 'defaultValue'
>
export type PinInputProps = Props & NativeAttrs

const defaultBoxLabel = (index: number, length: number) =>
  `Character ${index + 1} of ${length}`

const PinInputComponent = React.forwardRef<HTMLDivElement, PinInputProps>(
  (
    {
      length = 6,
      value: customValue,
      initialValue = '',
      onChange,
      onComplete,
      numeric = false,
      mask = false,
      boxLabel = defaultBoxLabel,
      disabled = false,
      error = false,
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
    const colors = getColors(theme.palette, error ? 'error' : type, disabled, {
      filled,
      light,
      ghost,
      subtle
    })

    const isControlled = customValue !== undefined
    const [selfValue, setSelfValue] = useState(initialValue.slice(0, length))
    const value = isControlled ? customValue : selfValue
    const boxes = useRef<Array<HTMLInputElement | null>>([])
    // the focus handler runs before the render of a new value
    const latest = useRef(value)
    latest.current = value

    const focusBox = (index: number) =>
      boxes.current[Math.max(0, Math.min(index, length - 1))]?.focus()

    const commit = (next: string) => {
      if (next === value) return
      latest.current = next
      if (!isControlled) setSelfValue(next)
      if (onChange) onChange(next)
      if (onComplete && next.length === length) onComplete(next)
    }

    // the value has no gaps, so a box past its end acts as the first empty one
    const remove = (index: number) =>
      commit(value.slice(0, index) + value.slice(index + 1))

    const changeHandler =
      (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const typed = event.target.value
        if (typed === '') return remove(index)
        const chars = typed
          .split('')
          .filter((char) => !numeric || /\d/.test(char))
        if (!chars.length) return
        // a single character replaces the one in the box, and a paste or an
        // autofill fills the boxes from this one on
        const at = Math.min(index, value.length)
        const rest = chars.length === 1 ? value.slice(at + 1) : ''
        commit((value.slice(0, at) + chars.join('') + rest).slice(0, length))
        focusBox(at + chars.length)
      }

    const keyDownHandler =
      (index: number) => (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Backspace') {
          event.preventDefault()
          if (index < value.length) return remove(index)
          if (index > 0) {
            remove(index - 1)
            focusBox(index - 1)
          }
        } else if (event.key === 'ArrowLeft') {
          event.preventDefault()
          focusBox(index - 1)
        } else if (event.key === 'ArrowRight') {
          event.preventDefault()
          focusBox(index + 1)
        }
      }

    const focusHandler =
      (index: number) => (event: React.FocusEvent<HTMLInputElement>) => {
        if (index > latest.current.length)
          return focusBox(latest.current.length)
        event.target.select()
      }

    const pinStyle = {
      '--pin-size': SCALES.height(2.75),
      '--input-border': colors.borderColor,
      '--input-radius': rounded ? '25px' : theme.layout.radius,
      '--input-bg': colors.bgColor,
      '--input-hover-border': colors.hoverBorder,
      '--input-hover-bg': colors.hoverBgColor,
      '--input-focus-border': colors.focusBorder,
      '--input-color': colors.color,
      fontSize: SCALES.font(1),
      margin: `${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)} ${SCALES.ml(0)}`,
      ...style
    } as React.CSSProperties

    return (
      <div
        ref={ref}
        role="group"
        className={useClasses(styles.pin, className)}
        {...props}
        style={pinStyle}
      >
        {Array.from({ length }, (_, index) => (
          <input
            key={index}
            ref={(node) => {
              boxes.current[index] = node
            }}
            type={mask ? 'password' : 'text'}
            inputMode={numeric ? 'numeric' : 'text'}
            autoComplete={index === 0 ? 'one-time-code' : 'off'}
            aria-label={boxLabel(index, length)}
            aria-invalid={error || undefined}
            className={styles.box}
            value={value[index] ?? ''}
            disabled={disabled}
            onChange={changeHandler(index)}
            onKeyDown={keyDownHandler(index)}
            onFocus={focusHandler(index)}
          />
        ))}
      </div>
    )
  }
)

PinInputComponent.displayName = 'BolioUIPinInput'
const PinInput = withScale(PinInputComponent)
export default PinInput
