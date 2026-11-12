import React, { useEffect, useRef, useState } from 'react'
import useTheme from '../use-theme'
import { getColors } from '../Input/styles'
import type { NormalTypes } from '../utils/prop-types'
import useScale, { withScale } from '../use-scale'
import useClasses, { joinClasses } from '../use-classes'
import useClickAway from '../utils/use-click-away'
import useUncontrolled from '../use-uncontrolled'
import { getSurface } from '../utils/surface'
import styles from './Cascader.module.css'

export interface CascaderOption {
  value: string
  label: React.ReactNode
  disabled?: boolean
  children?: CascaderOption[]
}

interface Props {
  data: CascaderOption[]
  // values from the first column to the chosen option
  value?: string[]
  initialValue?: string[]
  onChange?: (path: string[], options: CascaderOption[]) => void
  placeholder?: string
  listLabel?: string
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
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  keyof Props | 'value' | 'defaultValue' | 'onChange' | 'type'
>
export type CascaderProps = Props & NativeAttrs

const noValue: string[] = []

// The options a path of values leads through, as far as it exists.
const optionsOf = (data: CascaderOption[], path: string[]) => {
  const options: CascaderOption[] = []
  let level = data
  for (const value of path) {
    const option = level.find((item) => item.value === value)
    if (!option) break
    options.push(option)
    level = option.children || []
  }
  return options
}

const CascaderComponent = React.forwardRef<HTMLButtonElement, CascaderProps>(
  (
    {
      data,
      value: customValue,
      initialValue = noValue,
      onChange,
      placeholder = 'Select',
      listLabel = 'Options',
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
    const surface = getSurface(theme)
    const { SCALES } = useScale()
    const colors = getColors(theme.palette, type, disabled, {
      filled,
      light,
      ghost,
      subtle
    })
    const [value, setValue] = useUncontrolled<string[]>({
      value: customValue,
      defaultValue: initialValue
    })
    const chosen = optionsOf(data, value)

    const [open, setOpen] = useState(false)
    // the options that are open, from the first column: a column appears for
    // each of them
    const [active, setActive] = useState<string[]>(noValue)
    const [focus, setFocus] = useState({ column: 0, row: 0 })
    const shouldFocus = useRef(false)
    const rootRef = useRef<HTMLDivElement>(null)
    const buttonRef = useRef<HTMLButtonElement>(null)
    const options = useRef(new Map<string, HTMLButtonElement>())
    React.useImperativeHandle(ref, () => buttonRef.current as HTMLButtonElement)
    useClickAway(rootRef, () => setOpen(false))

    const columns: CascaderOption[][] = [data]
    for (const option of optionsOf(data, active)) {
      if (!option.children || option.children.length === 0) break
      columns.push(option.children)
    }

    useEffect(() => {
      if (!open || !shouldFocus.current) return
      shouldFocus.current = false
      options.current.get(`${focus.column}:${focus.row}`)?.focus()
    })

    const openList = () => {
      const parents = value.slice(0, -1)
      const column = Math.min(parents.length, optionsOf(data, parents).length)
      const level = optionsOf(data, parents.slice(0, column))
      const list =
        column === 0 ? data : level[level.length - 1]?.children || data
      const row = Math.max(
        list.findIndex((item) => item.value === value[column]),
        0
      )
      setActive(parents)
      setFocus({ column, row })
      shouldFocus.current = true
      setOpen(true)
    }

    const close = () => {
      setOpen(false)
      buttonRef.current?.focus()
    }

    const enter = (column: number, row: number) => {
      const option = columns[column][row]
      if (!option || option.disabled) return
      const path = [...active.slice(0, column), option.value]
      setFocus({ column, row })
      if (option.children && option.children.length) return setActive(path)
      setValue(path)
      onChange?.(path, optionsOf(data, path))
      close()
    }

    const move = (column: number, row: number) => {
      const list = columns[column]
      if (!list) return
      setFocus({ column, row })
      shouldFocus.current = true
    }

    const keyDownHandler = (
      event: React.KeyboardEvent,
      column: number,
      row: number
    ) => {
      const list = columns[column]
      const step = (direction: 1 | -1) => {
        let next = row + direction
        while (list[next] && list[next].disabled) next += direction
        return list[next] ? next : row
      }
      const option = list[row]
      const actions: Record<string, () => void> = {
        ArrowDown: () => move(column, step(1)),
        ArrowUp: () => move(column, step(-1)),
        Home: () => move(column, 0),
        End: () => move(column, list.length - 1),
        ArrowRight: () => {
          if (!option || option.disabled || !option.children?.length) return
          setActive([...active.slice(0, column), option.value])
          setFocus({ column: column + 1, row: 0 })
          shouldFocus.current = true
        },
        ArrowLeft: () => {
          if (column === 0) return
          const parent = active[column - 1]
          setActive(active.slice(0, column - 1))
          move(
            column - 1,
            Math.max(
              columns[column - 1].findIndex((item) => item.value === parent),
              0
            )
          )
        },
        Enter: () => enter(column, row),
        ' ': () => enter(column, row),
        Escape: close
      }
      const action = actions[event.key]
      if (!action) return
      event.preventDefault()
      event.stopPropagation()
      action()
    }

    const fieldStyle = {
      '--cascader-font-size': SCALES.font(0.875),
      '--cascader-height': SCALES.height(2.25),
      '--cascader-width': SCALES.width(1, '17.5em'),
      '--cascader-padding-top': SCALES.pt(0),
      '--cascader-padding-right': SCALES.pr(0),
      '--cascader-padding-bottom': SCALES.pb(0),
      '--cascader-padding-left': SCALES.pl(0),
      '--cascader-margin-top': SCALES.mt(0),
      '--cascader-margin-right': SCALES.mr(0),
      '--cascader-margin-bottom': SCALES.mb(0),
      '--cascader-margin-left': SCALES.ml(0),
      '--cascader-radius': rounded ? '25px' : theme.layout.radius,
      '--cascader-popup-radius': theme.layout.radius,
      '--cascader-color': colors.color,
      '--cascader-bg': colors.bgColor,
      '--cascader-border': colors.borderColor,
      '--cascader-hover-bg': colors.hoverBgColor,
      '--cascader-hover-border': colors.hoverBorder,
      '--cascader-focus-border': colors.focusBorder,
      '--cascader-placeholder': colors.placeholderColor,
      '--cascader-popup-bg': surface.bg,
      '--cascader-popup-hover': surface.hover,
      '--cascader-popup-border': theme.palette.border,
      '--cascader-shadow': surface.shadow,
      '--cascader-selected-bg': theme.palette.primary,
      '--cascader-disabled-color': theme.palette.accents_3,
      ...style
    } as React.CSSProperties

    return (
      <div
        ref={rootRef}
        className={useClasses(styles.root, className)}
        style={fieldStyle}
      >
        <button
          {...props}
          ref={buttonRef}
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          disabled={disabled}
          className={styles.field}
          onClick={() => (open ? setOpen(false) : openList())}
        >
          <span className={chosen.length ? styles.value : styles.placeholder}>
            {chosen.length
              ? chosen.map((option, index) => (
                  <React.Fragment key={option.value}>
                    {index > 0 && ' / '}
                    {option.label}
                  </React.Fragment>
                ))
              : placeholder}
          </span>
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
            className={styles.chevron}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
        {open && (
          <div className={styles.popup}>
            {columns.map((list, column) => (
              <div
                key={column}
                role="listbox"
                aria-label={`${listLabel} ${column + 1}`}
                className={styles.column}
              >
                {list.map((option, row) => {
                  const isActive = active[column] === option.value
                  const isChosen = value[column] === option.value
                  const hasChildren = Boolean(option.children?.length)
                  return (
                    <button
                      key={option.value}
                      ref={(element) => {
                        const key = `${column}:${row}`
                        if (element) options.current.set(key, element)
                        else options.current.delete(key)
                      }}
                      type="button"
                      role="option"
                      aria-selected={isChosen}
                      aria-haspopup={hasChildren ? 'listbox' : undefined}
                      aria-expanded={hasChildren ? isActive : undefined}
                      aria-disabled={option.disabled || undefined}
                      tabIndex={
                        focus.column === column && focus.row === row ? 0 : -1
                      }
                      className={joinClasses(styles.option, {
                        [styles.active]: isActive,
                        [styles.chosen]: isChosen
                      })}
                      onClick={() => enter(column, row)}
                      onKeyDown={(event) => keyDownHandler(event, column, row)}
                    >
                      <span className={styles.label}>{option.label}</span>
                      {hasChildren && (
                        <span className={styles.arrow} aria-hidden="true">
                          ›
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }
)

CascaderComponent.displayName = 'BolioUICascader'
const Cascader = withScale(CascaderComponent)
export default Cascader
