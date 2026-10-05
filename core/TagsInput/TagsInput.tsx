import React, { useId, useState } from 'react'
import useTheme from '../use-theme'
import useScale, { withScale } from '../use-scale'
import useClasses from '../use-classes'
import InputBlockLabel from '../Input/InputBlockLabel'
import { getColors } from '../Input/styles'
import { NormalTypes } from '../utils/prop-types'
import styles from './TagsInput.module.css'

interface Props {
  value?: Array<string>
  initialValue?: Array<string>
  onChange?: (tags: Array<string>) => void
  // tags past this number are ignored
  max?: number
  allowDuplicates?: boolean
  type?: NormalTypes
  rounded?: boolean
  filled?: boolean
  light?: boolean
  ghost?: boolean
  subtle?: boolean
  disabled?: boolean
  readOnly?: boolean
  error?: boolean
  errorMessage?: string
  className?: string
}

type NativeAttrs = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  keyof Props | 'defaultValue' | 'type'
>
export type TagsInputProps = Props & NativeAttrs

const noTags: Array<string> = []

const TagsInputComponent = React.forwardRef<
  HTMLInputElement,
  React.PropsWithChildren<TagsInputProps>
>(
  (
    {
      value: customValue,
      initialValue = noTags,
      onChange,
      max,
      allowDuplicates = false,
      type = 'default',
      rounded = false,
      filled = false,
      light = false,
      ghost = false,
      subtle = false,
      disabled = false,
      readOnly = false,
      error = false,
      errorMessage,
      className = '',
      children,
      style,
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

    const isControlled = customValue !== undefined
    const [selfValue, setSelfValue] = useState<Array<string>>(initialValue)
    const tags = isControlled ? customValue : selfValue
    const [text, setText] = useState('')
    const locked = disabled || readOnly

    const commit = (next: Array<string>) => {
      if (!isControlled) setSelfValue(next)
      onChange?.(next)
    }

    const add = (entries: Array<string>) => {
      const next = [...tags]
      entries
        .map((entry) => entry.trim())
        .filter(Boolean)
        .forEach((entry) => {
          if (max !== undefined && next.length >= max) return
          if (!allowDuplicates && next.includes(entry)) return
          next.push(entry)
        })
      if (next.length !== tags.length) commit(next)
    }

    const remove = (index: number) => {
      if (locked) return
      commit(tags.filter((_, i) => i !== index))
    }

    // a comma ends a tag, typed or pasted
    const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
      const parts = event.target.value.split(',')
      if (parts.length === 1) return setText(parts[0])
      add(parts.slice(0, -1))
      setText(parts[parts.length - 1])
    }

    const keyDownHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
      onKeyDown?.(event)
      if (event.defaultPrevented || locked) return
      if (event.key === 'Enter' && text.trim()) {
        event.preventDefault()
        add([text])
        setText('')
      } else if (event.key === 'Backspace' && !text && tags.length) {
        remove(tags.length - 1)
      }
    }

    const blurHandler = (event: React.FocusEvent<HTMLInputElement>) => {
      onBlur?.(event)
      if (locked || !text) return
      add([text])
      setText('')
    }

    const rootStyle: React.CSSProperties = {
      '--input-height': SCALES.height(2.25),
      fontSize: SCALES.font(0.875),
      width: SCALES.width(1, '100%'),
      margin: `${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)} ${SCALES.ml(0)}`,
      ...style
    } as React.CSSProperties

    const fieldStyle = {
      '--input-border': colors.borderColor,
      '--input-radius': rounded ? '25px' : theme.layout.radius,
      '--input-bg': colors.bgColor,
      '--input-hover-border': colors.hoverBorder,
      '--input-hover-bg': colors.hoverBgColor,
      '--input-focus-border': colors.focusBorder,
      '--input-placeholder-color': colors.placeholderColor,
      '--input-color': colors.color,
      '--tag-bg': theme.palette.accents_2,
      '--tag-color': disabled
        ? theme.palette.accents_4
        : theme.palette.foreground,
      '--tag-remove-color': colors.iconColor,
      '--tag-remove-hover-color': colors.color
    } as React.CSSProperties

    return (
      <div
        className={useClasses(styles.withLabel, className)}
        style={rootStyle}
      >
        {children && (
          <InputBlockLabel htmlFor={inputId}>{children}</InputBlockLabel>
        )}
        <div
          className={useClasses(styles.field, {
            [styles.disabled]: disabled
          })}
          style={fieldStyle}
          // a click on the empty space of the field focuses the input
          onClick={(event) =>
            event.currentTarget.querySelector('input')?.focus()
          }
        >
          {tags.map((tag, index) => (
            <span key={`${tag}-${index}`} className={styles.tag}>
              {tag}
              <button
                type="button"
                className={styles.remove}
                aria-label={`Remove ${tag}`}
                disabled={locked}
                onClick={() => remove(index)}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="1em"
                  height="1em"
                  aria-hidden="true"
                >
                  <path
                    d="M6 6l12 12M18 6L6 18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </span>
          ))}
          <input
            ref={ref}
            type="text"
            autoComplete="off"
            value={text}
            disabled={disabled}
            readOnly={readOnly}
            onChange={changeHandler}
            onKeyDown={keyDownHandler}
            onBlur={blurHandler}
            {...props}
            id={inputId}
            aria-invalid={error || undefined}
            aria-describedby={describedBy}
            className={styles.input}
          />
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

TagsInputComponent.displayName = 'BolioUITagsInput'
const TagsInput = withScale(TagsInputComponent)
export default TagsInput
