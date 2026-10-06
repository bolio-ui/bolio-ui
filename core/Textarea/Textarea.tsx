import React, {
  useRef,
  useImperativeHandle,
  useEffect,
  useMemo,
  useState
} from 'react'
import useTheme from '../use-theme'
import { NormalTypes } from '../utils/prop-types'
import { getColors } from '../Input/styles'
import useScale, { withScale } from '../use-scale'
import useClasses from '../use-classes'
import type { AnyElement } from '../utils/types'
import styles from './Textarea.module.css'

export type TextareaResizes =
  'none' | 'both' | 'horizontal' | 'vertical' | 'initial' | 'inherit'
export type TextareaTypes = NormalTypes
interface Props {
  value?: string
  initialValue?: string
  placeholder?: string
  type?: TextareaTypes
  disabled?: boolean
  readOnly?: boolean
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onFocus?: (e: React.FocusEvent<HTMLTextAreaElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void
  className?: string
  resize?: TextareaResizes
  rounded?: boolean
  filled?: boolean
  light?: boolean
  ghost?: boolean
  subtle?: boolean
}

type NativeAttrs = Omit<React.TextareaHTMLAttributes<AnyElement>, keyof Props>
export type TextareaProps = Props & NativeAttrs

const TextareaComponent = React.forwardRef<
  HTMLTextAreaElement,
  React.PropsWithChildren<TextareaProps>
>(
  (
    {
      type = 'default' as TextareaTypes,
      disabled = false,
      readOnly = false,
      onFocus,
      onBlur,
      className = '',
      initialValue = '',
      onChange,
      value,
      placeholder,
      resize = 'none' as TextareaResizes,
      rounded = false,
      filled = false,
      light = false,
      ghost = false,
      subtle = false,
      ...props
    }: React.PropsWithChildren<TextareaProps>,
    ref: React.Ref<HTMLTextAreaElement | null>
  ) => {
    const theme = useTheme()
    const { SCALES } = useScale()
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    useImperativeHandle(ref, () => textareaRef.current as HTMLTextAreaElement)
    const isControlledComponent = useMemo(() => value !== undefined, [value])
    const [selfValue, setSelfValue] = useState<string>(initialValue)
    const [hover, setHover] = useState<boolean>(false)

    const colors = useMemo(
      () =>
        getColors(theme.palette, type, disabled, {
          filled,
          light,
          ghost,
          subtle
        }),
      [theme.palette, type, disabled, filled, light, ghost, subtle]
    )

    const classes = useClasses(
      styles.wrapper,
      { [styles.hover]: hover, [styles.disabled]: disabled },
      className
    )

    const changeHandler = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (disabled || readOnly) return
      setSelfValue(event.target.value)
      if (onChange) onChange(event)
    }
    const focusHandler = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setHover(true)
      if (onFocus) onFocus(e)
    }
    const blurHandler = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setHover(false)
      if (onBlur) onBlur(e)
    }

    useEffect(() => {
      if (isControlledComponent) {
        setSelfValue(value as string)
      }
    }, [isControlledComponent, value])

    const controlledValue = isControlledComponent
      ? { value: selfValue }
      : { defaultValue: initialValue }
    const textareaProps = {
      ...props,
      ...controlledValue
    }

    const wrapperStyle = {
      '--textarea-radius': rounded ? '25px' : theme.layout.radius,
      '--textarea-border': colors.borderColor,
      '--textarea-color': colors.color,
      '--textarea-hover-border': colors.hoverBorder,
      '--textarea-hover-bg': colors.hoverBgColor,
      '--textarea-focus-border': colors.focusBorder,
      '--textarea-bg': colors.bgColor,
      '--textarea-placeholder-color': colors.placeholderColor,
      '--textarea-font-family': theme.font.sans,
      '--textarea-font-size': SCALES.font(0.875),
      '--textarea-resize': resize,
      '--textarea-autofill-bg':
        colors.bgColor === 'transparent'
          ? theme.palette.background
          : colors.bgColor,
      '--textarea-autofill-color': colors.color,
      width: SCALES.width(1, 'initial'),
      height: SCALES.height(1, 'auto'),
      margin: `${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)} ${SCALES.ml(0)}`
    } as React.CSSProperties

    return (
      <div className={classes} style={wrapperStyle}>
        <textarea
          ref={textareaRef}
          disabled={disabled}
          placeholder={placeholder}
          readOnly={readOnly}
          onFocus={focusHandler}
          onBlur={blurHandler}
          onChange={changeHandler}
          {...textareaProps}
          className={styles.textarea}
          style={{
            padding: `${SCALES.pt(0.5)} ${SCALES.pr(0.5)} ${SCALES.pb(0.5)} ${SCALES.pl(0.5)}`,
            ...(textareaProps as { style?: React.CSSProperties }).style
          }}
        />
      </div>
    )
  }
)

TextareaComponent.displayName = 'BolioUITextarea'
const Textarea = withScale(TextareaComponent)
export default Textarea
