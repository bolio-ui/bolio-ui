import React, {
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState
} from 'react'
import useTheme from '../use-theme'
import useScale, { withScale } from '../use-scale'
import useClasses from '../use-classes'
import useClickAway from '../utils/use-click-away'
import InputBlockLabel from '../Input/InputBlockLabel'
import { getColors } from '../Input/styles'
import { NormalTypes } from '../utils/prop-types'
import ColorPicker from '../ColorPicker'
import { normalizeHex } from '../ColorPicker/color-utils'
import styles from './ColorInput.module.css'

interface Props {
  // "#rrggbb", or "#rgb"
  value?: string
  initialValue?: string
  // called with "#rrggbb" in lowercase
  onChange?: (hex: string) => void
  // colors to pick with one click in the popover
  swatches?: Array<string>
  placeholder?: string
  disabled?: boolean
  type?: NormalTypes
  rounded?: boolean
  filled?: boolean
  light?: boolean
  ghost?: boolean
  subtle?: boolean
  // name of the color button and of its dialog
  pickerLabel?: string
  className?: string
}

type NativeAttrs = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  keyof Props | 'value' | 'defaultValue' | 'onChange' | 'type'
>
export type ColorInputProps = Props & NativeAttrs

const ColorInputComponent = React.forwardRef<
  HTMLInputElement,
  React.PropsWithChildren<ColorInputProps>
>(
  (
    {
      value: customValue,
      initialValue = '#000000',
      onChange,
      swatches,
      placeholder = '#000000',
      disabled = false,
      type = 'default',
      rounded = false,
      filled = false,
      light = false,
      ghost = false,
      subtle = false,
      pickerLabel = 'Choose color',
      className = '',
      children,
      onBlur,
      ...props
    },
    ref
  ) => {
    const theme = useTheme()
    const { SCALES } = useScale()
    const generatedId = useId()
    const inputId = props.id || generatedId
    const colors = getColors(theme.palette, type, disabled, {
      filled,
      light,
      ghost,
      subtle
    })

    const isControlled = customValue !== undefined
    const [selfHex, setSelfHex] = useState(
      normalizeHex(initialValue) || '#000000'
    )
    const hex =
      (isControlled ? normalizeHex(customValue) : selfHex) || '#000000'
    const [text, setText] = useState(hex)
    const [open, setOpen] = useState(false)
    useEffect(() => setText(hex), [hex])

    const rootRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const buttonRef = useRef<HTMLButtonElement>(null)
    const popupRef = useRef<HTMLDivElement>(null)
    useImperativeHandle(ref, () => inputRef.current as HTMLInputElement)
    useClickAway(rootRef, () => setOpen(false))

    // the focus goes into the picker when it opens
    useEffect(() => {
      if (open)
        popupRef.current?.querySelector<HTMLElement>('[role="slider"]')?.focus()
    }, [open])

    const commit = (next: string) => {
      if (next === hex) return
      if (!isControlled) setSelfHex(next)
      if (onChange) onChange(next)
    }

    // A short code like "#abc" waits for the blur, so it is not rewritten as
    // "#aabbcc" while a longer one is being typed.
    const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
      setText(event.target.value)
      const typed = /^#?[0-9a-f]{6}$/i.test(event.target.value.trim())
        ? normalizeHex(event.target.value)
        : null
      if (typed) commit(typed)
    }

    const blurHandler = (event: React.FocusEvent<HTMLInputElement>) => {
      if (onBlur) onBlur(event)
      const typed = normalizeHex(text)
      if (typed) commit(typed)
      // the field shows the color the input has, which a parent may refuse
      setText(hex)
    }

    const keyDownHandler = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key !== 'Escape') return
      event.stopPropagation()
      setOpen(false)
      buttonRef.current?.focus()
    }

    const colorInputStyle = {
      '--colorinput-height': SCALES.height(2.25),
      '--colorinput-width': SCALES.width(1, 'initial'),
      '--colorinput-font-size': SCALES.font(0.875),
      '--colorinput-margin': `${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)} ${SCALES.ml(0)}`,
      '--colorinput-border': colors.borderColor,
      '--colorinput-radius': rounded ? '25px' : theme.layout.radius,
      '--colorinput-popup-radius': theme.layout.radius,
      '--colorinput-bg': colors.bgColor,
      '--colorinput-hover-border': colors.hoverBorder,
      '--colorinput-hover-bg': colors.hoverBgColor,
      '--colorinput-focus-border': colors.focusBorder,
      '--colorinput-placeholder': colors.placeholderColor,
      '--colorinput-color': colors.color,
      '--colorinput-popup-bg': theme.palette.background,
      '--colorinput-popup-border': theme.palette.border,
      '--colorinput-shadow': theme.expressiveness.shadowMedium
    } as React.CSSProperties

    return (
      <div
        ref={rootRef}
        className={useClasses(styles.colorinput, className)}
        style={colorInputStyle}
      >
        {children && (
          <InputBlockLabel htmlFor={inputId}>{children}</InputBlockLabel>
        )}
        <div
          className={useClasses(styles.field, {
            [styles.disabled]: disabled
          })}
        >
          <button
            ref={buttonRef}
            type="button"
            className={styles.swatch}
            style={{ backgroundColor: hex }}
            aria-label={pickerLabel}
            aria-haspopup="dialog"
            aria-expanded={open}
            disabled={disabled}
            onClick={() => setOpen((last) => !last)}
          />
          <input
            ref={inputRef}
            type="text"
            autoComplete="off"
            spellCheck={false}
            value={text}
            placeholder={placeholder}
            disabled={disabled}
            onChange={changeHandler}
            onBlur={blurHandler}
            className={styles.input}
            {...props}
            id={inputId}
          />
        </div>
        {open && (
          <div
            ref={popupRef}
            role="dialog"
            aria-label={pickerLabel}
            className={styles.popup}
            onKeyDown={keyDownHandler}
          >
            <ColorPicker
              value={hex}
              onChange={commit}
              swatches={swatches}
              hexInput={false}
            />
          </div>
        )}
      </div>
    )
  }
)

ColorInputComponent.displayName = 'BolioUIColorInput'
const ColorInput = withScale(ColorInputComponent)
export default ColorInput
