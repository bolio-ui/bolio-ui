import React, { useEffect, useId, useMemo, useState } from 'react'
import useTheme from '../use-theme'
import useScale, { withScale } from '../use-scale'
import useClasses from '../use-classes'

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
  option ? option.label ?? option.value : ''

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
      onChange && onChange(option.value)
    }

    const inputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
      const next = event.target.value
      setText(next)
      setOpen(true)
      onInputChange && onInputChange(next)
      if (next === '' && selected !== null) {
        if (!isControlled) setSelfValue(null)
        onChange && onChange(null)
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
      onKeyDown && onKeyDown(event)
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
      onBlur && onBlur(event)
      setOpen(false)
      setText(selectedLabel)
    }

    return (
      <div className={useClasses('combobox', className)}>
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
          {...props}
        />
        {expanded && (
          <ul id={listId} role="listbox">
            {visible.map((option, index) => (
              <li
                key={option.value}
                id={optionId(index)}
                role="option"
                aria-selected={option.value === selected}
                aria-disabled={option.disabled || undefined}
                className={useClasses({
                  active: index === activeIndex,
                  selected: option.value === selected,
                  disabled: option.disabled
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
          <div className="empty">{emptyText}</div>
        )}
        <div role="status" className="sr-only">
          {expanded
            ? `${visible.length} result${
                visible.length === 1 ? '' : 's'
              } available`
            : ''}
        </div>
        <style jsx>{`
          .combobox {
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
            padding: 0 0.875em;
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
          ul,
          .empty {
            position: absolute;
            top: calc(100% + 4px);
            left: 0;
            right: 0;
            z-index: 1100;
            box-sizing: border-box;
            background-color: ${theme.palette.background};
            border: 1px solid ${theme.palette.border};
            border-radius: ${theme.layout.radius};
            box-shadow: ${theme.expressiveness.shadowMedium};
          }
          ul {
            max-height: 15em;
            overflow-y: auto;
            margin: 0;
            padding: 0.25em;
            list-style: none;
          }
          li {
            padding: 0.5em 0.75em;
            border-radius: 4px;
            cursor: pointer;
            color: ${theme.palette.foreground};
          }
          li.active {
            background-color: ${theme.palette.accents_2};
          }
          li.selected {
            font-weight: 600;
          }
          li.disabled {
            cursor: not-allowed;
            color: ${theme.palette.accents_4};
          }
          .empty {
            padding: 0.75em;
            color: ${theme.palette.accents_5};
          }
          .sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            margin: -1px;
            padding: 0;
            overflow: hidden;
            clip: rect(0 0 0 0);
            white-space: nowrap;
            border: 0;
          }
        `}</style>
      </div>
    )
  }
)

ComboboxComponent.displayName = 'BolioUICombobox'
const Combobox = withScale(ComboboxComponent)
export default Combobox
