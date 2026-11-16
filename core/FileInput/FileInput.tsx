import React, { useImperativeHandle, useRef } from 'react'
import useTheme from '../use-theme'
import { getColors } from '../Input/styles'
import type { NormalTypes } from '../utils/prop-types'
import useScale, { withScale } from '../use-scale'
import useClasses from '../use-classes'
import useUncontrolled from '../use-uncontrolled'
import styles from './FileInput.module.css'

export type FileInputValue = File | File[] | null

interface Props {
  // a File, or an array of them with `multiple`
  value?: FileInputValue
  initialValue?: FileInputValue
  onChange?: (value: FileInputValue) => void
  multiple?: boolean
  accept?: string
  placeholder?: string
  clearable?: boolean
  clearLabel?: string
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
  React.InputHTMLAttributes<HTMLInputElement>,
  keyof Props | 'value' | 'defaultValue' | 'onChange' | 'type'
>
export type FileInputProps = Props & NativeAttrs

const toList = (value: FileInputValue) =>
  value ? (Array.isArray(value) ? value : [value]) : []

const FileInputComponent = React.forwardRef<HTMLInputElement, FileInputProps>(
  (
    {
      value: customValue,
      initialValue = null,
      onChange,
      multiple = false,
      accept,
      placeholder = 'Select a file',
      clearable = false,
      clearLabel = 'Clear',
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
    const input = useRef<HTMLInputElement>(null)
    useImperativeHandle(ref, () => input.current as HTMLInputElement)

    const [value, setValue] = useUncontrolled<FileInputValue>({
      value: customValue,
      defaultValue: initialValue,
      onChange
    })
    const files = toList(value)

    const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
      const picked = Array.from(event.target.files || [])
      if (picked.length === 0) return
      setValue(multiple ? picked : picked[0])
    }

    const clear = () => {
      if (input.current) input.current.value = ''
      setValue(multiple ? [] : null)
    }

    const fieldStyle = {
      '--file-input-font-size': SCALES.font(0.875),
      '--file-input-height': SCALES.height(2.25),
      '--file-input-width': SCALES.width(1, '17.5em'),
      '--file-input-padding-top': SCALES.pt(0),
      '--file-input-padding-right': SCALES.pr(0),
      '--file-input-padding-bottom': SCALES.pb(0),
      '--file-input-padding-left': SCALES.pl(0),
      '--file-input-margin-top': SCALES.mt(0),
      '--file-input-margin-right': SCALES.mr(0),
      '--file-input-margin-bottom': SCALES.mb(0),
      '--file-input-margin-left': SCALES.ml(0),
      '--file-input-radius': rounded ? '25px' : theme.layout.radius,
      '--file-input-color': colors.color,
      '--file-input-bg': colors.bgColor,
      '--file-input-border': colors.borderColor,
      '--file-input-hover-bg': colors.hoverBgColor,
      '--file-input-hover-border': colors.hoverBorder,
      '--file-input-focus-border': colors.focusBorder,
      '--file-input-placeholder': colors.placeholderColor,
      ...style
    } as React.CSSProperties

    return (
      <div className={useClasses(styles.root, className)} style={fieldStyle}>
        <input
          {...props}
          ref={input}
          type="file"
          multiple={multiple}
          accept={accept}
          disabled={disabled}
          tabIndex={-1}
          aria-hidden="true"
          className={styles.native}
          onChange={changeHandler}
        />
        <button
          type="button"
          disabled={disabled}
          aria-label={props['aria-label']}
          className={styles.field}
          onClick={() => input.current?.click()}
        >
          <span className={files.length ? styles.names : styles.placeholder}>
            {files.length
              ? files.map((file) => file.name).join(', ')
              : placeholder}
          </span>
        </button>
        {clearable && files.length > 0 && !disabled && (
          <button
            type="button"
            aria-label={clearLabel}
            className={styles.clear}
            onClick={clear}
          >
            <svg
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              width="1em"
              height="1em"
              aria-hidden="true"
            >
              <path d="M18 6L6 18" />
              <path d="M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    )
  }
)

FileInputComponent.displayName = 'BolioUIFileInput'
const FileInput = withScale(FileInputComponent)
export default FileInput
