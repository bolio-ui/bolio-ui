import React, {
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from 'react'
import useTheme from '../use-theme'
import InputLabel from './InputLabel'
import InputBlockLabel from './InputBlockLabel'
import InputIcon from './InputIcon'
import InputClearIcon from './InputIconClear'
import { getColors } from './styles'
import { Props, defaultProps } from './InputProps'
import useScale, { withScale } from '../use-scale'
import useClasses from '../use-classes'
import useDefaultProps from '../utils/use-default-props'
import type { AnyElement } from '../utils/types'
import styles from './Input.module.css'

type NativeAttrs = Omit<React.InputHTMLAttributes<AnyElement>, keyof Props>
export type InputProps = Props & NativeAttrs

const simulateChangeEvent = (
  el: HTMLInputElement,
  event: React.MouseEvent<HTMLDivElement>
): React.ChangeEvent<HTMLInputElement> => {
  return {
    ...event,
    target: el,
    currentTarget: el
  }
}

const InputComponent = React.forwardRef<
  HTMLInputElement,
  React.PropsWithChildren<InputProps>
>((inputComponentProps: React.PropsWithChildren<InputProps>, ref) => {
  const {
    label,
    labelRight,
    type,
    htmlType,
    icon,
    iconRight,
    iconClickable,
    onIconClick,
    initialValue,
    onChange,
    readOnly,
    value,
    onClearClick,
    clearable,
    className,
    onBlur,
    onFocus,
    autoComplete,
    placeholder,
    children,
    disabled,
    rounded,
    backgroundColor,
    borderColor,
    hoverBorder,
    error,
    errorMessage,
    ...props
  } = useDefaultProps(inputComponentProps, defaultProps)
  const theme = useTheme()
  const { SCALES } = useScale()

  const inputRef = useRef<HTMLInputElement>(null)
  useImperativeHandle(ref, () => inputRef.current as HTMLInputElement)

  const generatedId = useId()
  const inputId = props.id || generatedId
  const errorId = `${inputId}-error`
  const describedBy =
    [props['aria-describedby'], error && errorMessage ? errorId : undefined]
      .filter(Boolean)
      .join(' ') || undefined

  const [selfValue, setSelfValue] = useState<string>('')
  const [hover, setHover] = useState<boolean>(false)
  const isControlledComponent = useMemo(() => value !== undefined, [value])
  const labelClasses = useMemo(
    () => (labelRight ? styles.rightLabel : label ? styles.leftLabel : ''),
    [label, labelRight]
  )

  const iconClasses = useMemo(
    () => (iconRight ? styles.rightIcon : icon ? styles.leftIcon : ''),
    [icon, iconRight]
  )

  const colors = useMemo(
    () => getColors(theme.palette, type, disabled),
    [theme.palette, type, disabled]
  )

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled || readOnly) return
    setSelfValue(event.target.value)
    if (onChange) onChange(event)
  }

  const clearHandler = (event: React.MouseEvent<HTMLDivElement>) => {
    setSelfValue('')
    if (onClearClick) onClearClick(event)
    /* istanbul ignore next */
    if (!inputRef.current) return

    const changeEvent = simulateChangeEvent(inputRef.current, event)
    changeEvent.target.value = ''
    if (onChange) onChange(changeEvent)
    inputRef.current.focus()
  }

  const focusHandler = (e: React.FocusEvent<HTMLInputElement>) => {
    setHover(true)
    if (onFocus) onFocus(e)
  }

  const blurHandler = (e: React.FocusEvent<HTMLInputElement>) => {
    setHover(false)
    if (onBlur) onBlur(e)
  }

  const iconClickHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return
    if (onIconClick) onIconClick(e)
  }

  const iconProps = {
    clickable: iconClickable,
    onClick: iconClickHandler
  }

  useEffect(() => {
    if (isControlledComponent) {
      setSelfValue(value as string)
    }
  }, [isControlledComponent, value])

  const controlledValue = isControlledComponent
    ? { value: selfValue }
    : { defaultValue: initialValue }
  const inputProps = {
    ...props,
    ...controlledValue
  }

  const withLabelStyle: React.CSSProperties = {
    '--input-height': SCALES.height(2.25),
    fontSize: SCALES.font(0.875),
    width: SCALES.width(1, 'initial'),
    padding: `${SCALES.pt(0)} ${SCALES.pr(0)} ${SCALES.pb(0)} ${SCALES.pl(0)}`,
    margin: `${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)} ${SCALES.ml(0)}`
  } as React.CSSProperties

  const inputWrapperStyle = {
    borderRadius: rounded ? '25px' : theme.layout.radius,
    border: `1px solid ${borderColor ? borderColor : colors.borderColor}`,
    background: backgroundColor ? backgroundColor : colors.bgColor,
    '--input-hover-border': hoverBorder ? hoverBorder : colors.hoverBorder,
    '--input-hover-bg': backgroundColor ? backgroundColor : colors.hoverBgColor
  } as React.CSSProperties

  const inputStyle = {
    fontSize: SCALES.font(0.875),
    color: colors.color,
    '--input-placeholder-color': theme.palette.accents_6,
    '--input-autofill-bg': theme.palette.background,
    '--input-color': colors.color
  } as React.CSSProperties

  return (
    <div className={styles.withLabel} style={withLabelStyle}>
      {children && (
        <InputBlockLabel htmlFor={inputId}>{children}</InputBlockLabel>
      )}
      <div
        className={useClasses(styles.inputContainer, className)}
        style={{ width: SCALES.width(1, 'initial') }}
      >
        {label && <InputLabel>{label}</InputLabel>}
        <div
          className={useClasses(
            styles.inputWrapper,
            { [styles.hover]: hover, [styles.disabled]: disabled },
            labelClasses
          )}
          style={inputWrapperStyle}
        >
          {icon && <InputIcon icon={icon} {...iconProps} />}
          <input
            type={htmlType}
            ref={inputRef}
            className={useClasses(
              styles.input,
              { [styles.disabled]: disabled },
              iconClasses
            )}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            onFocus={focusHandler}
            onBlur={blurHandler}
            onChange={changeHandler}
            autoComplete={autoComplete}
            {...inputProps}
            id={inputId}
            aria-invalid={error || undefined}
            aria-describedby={describedBy}
            style={{
              ...inputStyle,
              ...(inputProps as { style?: React.CSSProperties }).style
            }}
          />
          {clearable && (
            <InputClearIcon
              visible={Boolean(
                inputRef.current && inputRef.current.value !== ''
              )}
              disabled={disabled || readOnly}
              onClick={clearHandler}
            />
          )}
          {iconRight && <InputIcon icon={iconRight} {...iconProps} />}
        </div>
        {labelRight && <InputLabel isRight={true}>{labelRight}</InputLabel>}
      </div>
      {error && (
        <InputBlockLabel error={error} id={errorId}>
          {errorMessage}
        </InputBlockLabel>
      )}
    </div>
  )
})

InputComponent.displayName = 'BolioUIInput'
const Input = withScale(InputComponent)
export default Input
