import React, { useEffect, useId, useMemo, useState } from 'react'
import useTheme from '../use-theme'
import useScale, { withScale } from '../use-scale'
import useClasses, { joinClasses } from '../use-classes'
import styles from './Combobox.module.css'

export type ComboboxOption = {
  value: string
  label?: string
  disabled?: boolean
}

interface Props {
  options: ComboboxOption[]
  value?: string | null
  initialValue?: string | null
  onChange?: (value: string | null) => void
  onInputChange?: (text: string) => void
  placeholder?: string
  disabled?: boolean
  emptyText?: string
  filter?: (option: ComboboxOption, text: string) => boolean
  className?: string
}

type NativeAttrs = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  keyof Props | 'value' | 'defaultValue' | 'onChange' | 'type' | 'role'
>
export type ComboboxProps = Props & NativeAttrs

const getLabel = (option?: ComboboxOption) =>
  option ? (option.label ?? option.value) : ''

const defaultFilter = (option: ComboboxOption, text: string) =>
  getLabel(option).toLowerCase().includes(text.trim().toLowerCase())

const firstEnabled = (options: ComboboxOption[]) =>
  options.findIndex((option) => !option.disabled)

const ComboboxComponent = React.forwardRef<HTMLInputElement, ComboboxProps>(
  (
    {
      options,
      value: customValue,
      initialValue = null,
      onChange,
      onInputChange,
      placeholder,
      disabled = false,
      emptyText = 'No results',
      filter = defaultFilter,
      className = '',
      onKeyDown,
      onBlur,
      ...props
    },
    ref
  ) => {
    const theme = useTheme()
    const { SCALES } = useScale()
    const baseId = useId()
    const listId = `${baseId}-list`
    const optionId = (index: number) => `${baseId}-option-${index}`

    const isControlled = customValue !== undefined
    const [selfValue, setSelfValue] = useState<string | null>(initialValue)
    const selected = isControlled ? customValue : selfValue
    const selectedOption = options.find((option) => option.value === selected)
    const selectedLabel = getLabel(selectedOption)

    const [text, setText] = useState(selectedLabel)
    const [open, setOpen] = useState(false)
    const [activeIndex, setActiveIndex] = useState(-1)

    useEffect(() => {
      setText(selectedLabel)
    }, [selectedLabel])

    // Once an option is chosen, show every option again until the user types.
    const query = selectedOption && text === selectedLabel ? '' : text
    const visible = useMemo(
      () => options.filter((option) => filter(option, query)),
      [options, filter, query]
    )
    const expanded = open && visible.length > 0

    useEffect(() => {
      setActiveIndex(open ? firstEnabled(visible) : -1)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, query])

    useEffect(() => {
      if (activeIndex < 0) return
      const element = document.getElementById(optionId(activeIndex))
      element?.scrollIntoView?.({ block: 'nearest' })
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeIndex])

    const choose = (option: ComboboxOption) => {
      if (option.disabled) return
      if (!isControlled) setSelfValue(option.value)
      setText(getLabel(option))
      setOpen(false)
      if (onChange) onChange(option.value)
    }

    const inputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
      const next = event.target.value
      setText(next)
      setOpen(true)
      if (onInputChange) onInputChange(next)
      if (next === '' && selected !== null) {
        if (!isControlled) setSelfValue(null)
        if (onChange) onChange(null)
      }
    }

    const move = (direction: 1 | -1) => {
      const count = visible.length
      if (!count) return
      let index =
        activeIndex === -1 ? (direction === 1 ? -1 : count) : activeIndex
      for (let step = 0; step < count; step++) {
        index = (index + direction + count) % count
        if (!visible[index].disabled) return setActiveIndex(index)
      }
    }

    const keyDownHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (onKeyDown) onKeyDown(event)
      if (event.defaultPrevented) return
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault()
        if (!open) return setOpen(true)
        return move(event.key === 'ArrowDown' ? 1 : -1)
      }
      if (event.key === 'Enter' && expanded && activeIndex >= 0) {
        event.preventDefault()
        return choose(visible[activeIndex])
      }
      if (event.key === 'Escape' && open) {
        event.preventDefault()
        setOpen(false)
      }
    }

    const blurHandler = (event: React.FocusEvent<HTMLInputElement>) => {
      if (onBlur) onBlur(event)
      setOpen(false)
      setText(selectedLabel)
    }

    const comboboxStyle = {
      '--combobox-font-size': SCALES.font(1),
      '--combobox-width': SCALES.width(1, 'initial'),
      '--combobox-height': SCALES.height(1, 'auto'),
      '--combobox-padding-top': SCALES.pt(0),
      '--combobox-padding-right': SCALES.pr(0),
      '--combobox-padding-bottom': SCALES.pb(0),
      '--combobox-padding-left': SCALES.pl(0),
      '--combobox-margin-top': SCALES.mt(0),
      '--combobox-margin-right': SCALES.mr(0),
      '--combobox-margin-bottom': SCALES.mb(0),
      '--combobox-margin-left': SCALES.ml(0),
      '--combobox-text-color': theme.palette.foreground,
      '--combobox-bg': theme.palette.background,
      '--combobox-border-color': theme.palette.border,
      '--combobox-radius': theme.layout.radius,
      '--combobox-focus-border-color': theme.palette.primary,
      '--combobox-disabled-color': theme.palette.accents_4,
      '--combobox-disabled-bg': theme.palette.accents_1,
      '--combobox-shadow': theme.expressiveness.shadowMedium,
      '--combobox-active-bg': theme.palette.accents_2,
      '--combobox-empty-color': theme.palette.accents_5
    } as React.CSSProperties

    return (
      <div
        className={useClasses(styles.combobox, className)}
        style={comboboxStyle}
      >
        <input
          ref={ref}
          type="text"
          role="combobox"
          autoComplete="off"
          aria-autocomplete="list"
          aria-expanded={expanded}
          aria-controls={expanded ? listId : undefined}
          aria-activedescendant={
            expanded && activeIndex >= 0 ? optionId(activeIndex) : undefined
          }
          value={text}
          placeholder={placeholder}
          disabled={disabled}
          onChange={inputHandler}
          onKeyDown={keyDownHandler}
          onBlur={blurHandler}
          className={styles.input}
          {...props}
        />
        {expanded && (
          <ul id={listId} role="listbox" className={styles.list}>
            {visible.map((option, index) => (
              <li
                key={option.value}
                id={optionId(index)}
                role="option"
                aria-selected={option.value === selected}
                aria-disabled={option.disabled || undefined}
                className={joinClasses(styles.option, {
                  [styles.active]: index === activeIndex,
                  [styles.selected]: option.value === selected,
                  [styles.disabled]: option.disabled
                })}
                onMouseDown={(event) => {
                  event.preventDefault()
                  choose(option)
                }}
                onMouseMove={() => !option.disabled && setActiveIndex(index)}
              >
                {getLabel(option)}
              </li>
            ))}
          </ul>
        )}
        {open && visible.length === 0 && (
          <div className={styles.empty}>{emptyText}</div>
        )}
        <div role="status" className={styles.srOnly}>
          {expanded
            ? `${visible.length} result${
                visible.length === 1 ? '' : 's'
              } available`
            : ''}
        </div>
      </div>
    )
  }
)

ComboboxComponent.displayName = 'BolioUICombobox'
const Combobox = withScale(ComboboxComponent)
export default Combobox
