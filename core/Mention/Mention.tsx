import React, {
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import useTheme from '../use-theme'
import { getColors } from '../Input/styles'
import { NormalTypes } from '../utils/prop-types'
import useScale, { withScale } from '../use-scale'
import useClasses, { joinClasses } from '../use-classes'
import { getSurface } from '../utils/surface'
import styles from './Mention.module.css'

export type MentionOption = {
  value: string
  label?: string
  disabled?: boolean
}

interface Props {
  options: MentionOption[]
  // character that opens the list; the text after it filters the options
  trigger?: string
  value?: string
  initialValue?: string
  onChange?: (text: string) => void
  onSelect?: (option: MentionOption) => void
  placeholder?: string
  rows?: number
  disabled?: boolean
  type?: NormalTypes
  emptyText?: string
  className?: string
}

type NativeAttrs = Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  keyof Props | 'defaultValue' | 'onSelect'
>
export type MentionProps = Props & NativeAttrs

const getLabel = (option: MentionOption) => option.label ?? option.value

const escapeRegExp = (text: string) =>
  text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const MentionComponent = React.forwardRef<HTMLTextAreaElement, MentionProps>(
  (
    {
      options,
      trigger = '@',
      value: customValue,
      initialValue = '',
      onChange,
      onSelect,
      placeholder,
      rows = 3,
      disabled = false,
      type = 'default',
      emptyText = 'No results',
      className = '',
      onKeyDown,
      onBlur,
      style,
      ...props
    },
    ref
  ) => {
    const theme = useTheme()
    const surface = getSurface(theme)
    const { SCALES } = useScale()
    const colors = getColors(theme.palette, type, disabled, {})
    const baseId = useId()
    const listId = `${baseId}-list`
    const optionId = (index: number) => `${baseId}-option-${index}`

    const field = useRef<HTMLTextAreaElement | null>(null)
    const setRef = (node: HTMLTextAreaElement | null) => {
      field.current = node
      if (typeof ref === 'function') ref(node)
      else if (ref) ref.current = node
    }

    const isControlled = customValue !== undefined
    const [selfValue, setSelfValue] = useState(initialValue)
    const text = isControlled ? customValue : selfValue
    const [caret, setCaret] = useState(text.length)
    // Escape closes the list until the user types again
    const [dismissed, setDismissed] = useState(false)
    const [activeIndex, setActiveIndex] = useState(-1)
    const pendingCaret = useRef<number | null>(null)

    // the word being written, if it starts with the trigger
    const token = useMemo(() => {
      const t = escapeRegExp(trigger)
      const match = new RegExp(`(^|\\s)${t}([^\\s${t}]*)$`).exec(
        text.slice(0, caret)
      )
      return match
        ? { query: match[2], start: caret - match[2].length - trigger.length }
        : null
    }, [text, caret, trigger])

    const visible = useMemo(
      () =>
        token
          ? options.filter((option) =>
              getLabel(option).toLowerCase().includes(token.query.toLowerCase())
            )
          : [],
      [options, token]
    )
    const open = !!token && !dismissed && !disabled
    const expanded = open && visible.length > 0

    useEffect(() => {
      setActiveIndex(
        open ? visible.findIndex((option) => !option.disabled) : -1
      )
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, token?.query])

    useEffect(() => {
      if (activeIndex < 0) return
      document
        .getElementById(optionId(activeIndex))
        ?.scrollIntoView?.({ block: 'nearest' })
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeIndex])

    // put the caret after the inserted mention, once the new text is rendered
    useLayoutEffect(() => {
      if (pendingCaret.current === null || !field.current) return
      field.current.setSelectionRange(
        pendingCaret.current,
        pendingCaret.current
      )
      pendingCaret.current = null
    }, [text])

    const update = (next: string) => {
      if (!isControlled) setSelfValue(next)
      if (onChange) onChange(next)
    }

    const choose = (option: MentionOption) => {
      if (option.disabled || !token) return
      const inserted = `${trigger}${option.value} `
      const next = text.slice(0, token.start) + inserted + text.slice(caret)
      const position = token.start + inserted.length
      pendingCaret.current = position
      setCaret(position)
      update(next)
      if (onSelect) onSelect(option)
    }

    const changeHandler = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCaret(event.target.selectionStart)
      setDismissed(false)
      update(event.target.value)
    }

    const move = (direction: 1 | -1) => {
      const count = visible.length
      let index = activeIndex
      for (let step = 0; step < count; step++) {
        index = (index + direction + count) % count
        if (!visible[index].disabled) return setActiveIndex(index)
      }
    }

    const keyDownHandler = (
      event: React.KeyboardEvent<HTMLTextAreaElement>
    ) => {
      if (onKeyDown) onKeyDown(event)
      if (event.defaultPrevented || !expanded) return
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault()
        move(event.key === 'ArrowDown' ? 1 : -1)
      } else if (
        (event.key === 'Enter' || event.key === 'Tab') &&
        activeIndex >= 0
      ) {
        event.preventDefault()
        choose(visible[activeIndex])
      } else if (event.key === 'Escape') {
        event.preventDefault()
        setDismissed(true)
      }
    }

    // the caret moves with the arrow keys and the mouse as well as with typing
    const syncCaret = (event: React.SyntheticEvent<HTMLTextAreaElement>) => {
      const next = event.currentTarget.selectionStart
      if (next !== caret) {
        setCaret(next)
        setDismissed(false)
      }
    }

    const blurHandler = (event: React.FocusEvent<HTMLTextAreaElement>) => {
      if (onBlur) onBlur(event)
      setDismissed(true)
    }

    const mentionStyle = {
      '--mention-font-size': SCALES.font(0.875),
      '--mention-width': SCALES.width(1, '100%'),
      '--mention-height': SCALES.height(1, 'auto'),
      '--mention-margin-top': SCALES.mt(0),
      '--mention-margin-right': SCALES.mr(0),
      '--mention-margin-bottom': SCALES.mb(0),
      '--mention-margin-left': SCALES.ml(0),
      '--mention-text-color': theme.palette.foreground,
      '--mention-bg': surface.bg,
      '--mention-border-color': theme.palette.border,
      '--mention-radius': theme.layout.radius,
      '--mention-field-color': colors.color,
      '--mention-field-bg': colors.bgColor,
      '--mention-field-border': colors.borderColor,
      '--mention-field-hover-bg': colors.hoverBgColor,
      '--mention-field-hover-border': colors.hoverBorder,
      '--mention-focus-border-color': colors.focusBorder,
      '--mention-placeholder-color': colors.placeholderColor,
      '--mention-shadow': surface.shadow,
      '--mention-active-bg': surface.hover,
      '--mention-empty-color': theme.palette.accents_5,
      ...style
    } as React.CSSProperties

    return (
      <div
        className={useClasses(styles.mention, className)}
        style={mentionStyle}
      >
        <textarea
          ref={setRef}
          aria-autocomplete="list"
          aria-controls={expanded ? listId : undefined}
          aria-activedescendant={
            expanded && activeIndex >= 0 ? optionId(activeIndex) : undefined
          }
          value={text}
          rows={rows}
          placeholder={placeholder}
          disabled={disabled}
          onChange={changeHandler}
          onKeyDown={keyDownHandler}
          onKeyUp={syncCaret}
          onClick={syncCaret}
          onSelect={syncCaret}
          onBlur={blurHandler}
          className={styles.field}
          {...props}
        />
        {expanded && (
          <ul id={listId} role="listbox" className={styles.list}>
            {visible.map((option, index) => (
              <li
                key={option.value}
                id={optionId(index)}
                role="option"
                aria-selected={index === activeIndex}
                aria-disabled={option.disabled || undefined}
                className={joinClasses(styles.option, {
                  [styles.active]: index === activeIndex,
                  [styles.disabled]: option.disabled
                })}
                onMouseDown={(event) => {
                  // keep the focus in the field
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

MentionComponent.displayName = 'BolioUIMention'
const Mention = withScale(MentionComponent)
export default Mention
