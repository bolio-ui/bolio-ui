import type { CSSProperties } from 'react'
import React, {
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from 'react'
import type { NormalTypes } from '../utils/prop-types'
import useTheme from '../use-theme'
import useCurrentState from '../utils/use-current-state'
import useLatest from '../utils/use-latest'
import { pickChildByProps } from '../utils/collections'
import SelectIcon from './SelectIcon'
import SelectDropdown from './SelectDropdown'
import SelectMultipleValue from './SelectMultipleValue'
import Grid from '../Grid'
import type { SelectConfig } from './SelectContext'
import { SelectContext, getOptionId } from './SelectContext'
import { getColors } from '../Input/styles'
import Ellipsis from '../Shared/ellipsis'
import SelectInput from './SelectInput'
import useScale, { withScale } from '../use-scale'
import useClasses, { joinClasses } from '../use-classes'
import type { AnyElement } from '../utils/types'
import styles from './Select.module.css'

export type SelectRef = {
  focus: () => void
  blur: () => void
  scrollTo?: (options?: ScrollToOptions) => void
}
export type SelectTypes = NormalTypes
interface Props {
  disabled?: boolean
  type?: SelectTypes
  rounded?: boolean
  filled?: boolean
  light?: boolean
  ghost?: boolean
  subtle?: boolean
  value?: string | string[]
  initialValue?: string | string[]
  placeholder?: React.ReactNode | string
  icon?: React.ComponentType
  onChange?: (value: string | string[]) => void
  pure?: boolean
  multiple?: boolean
  clearable?: boolean
  className?: string
  dropdownClassName?: string
  dropdownStyle?: CSSProperties
  disableMatchWidth?: boolean
  onDropdownVisibleChange?: (visible: boolean) => void
  getPopupContainer?: () => HTMLElement | null
}

type NativeAttrs = Omit<React.HTMLAttributes<AnyElement>, keyof Props>
export type SelectProps = Props & NativeAttrs

const noop = () => {}

const SelectComponent = React.forwardRef<
  SelectRef,
  React.PropsWithChildren<SelectProps>
>(
  (
    {
      children,
      type = 'default' as SelectTypes,
      rounded = false,
      filled = false,
      light = false,
      ghost = false,
      subtle = false,
      disabled = false,
      initialValue: init,
      value: customValue,
      icon: Icon = SelectIcon as React.ComponentType,
      onChange,
      pure = false,
      multiple = false,
      clearable = true,
      placeholder,
      className = '',
      dropdownClassName,
      dropdownStyle,
      disableMatchWidth = false,
      getPopupContainer,
      onDropdownVisibleChange = noop,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledby,
      style,
      ...props
    }: React.PropsWithChildren<SelectProps>,
    selectRef
  ) => {
    const theme = useTheme()
    const { SCALES } = useScale()
    const ref = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const [visible, setVisible] = useState<boolean>(false)
    const [selectFocus, setSelectFocus] = useState<boolean>(false)
    const [activeValue, setActiveValue] = useState<string | undefined>()
    const listId = useId()
    const [value, setValue, valueRef] = useCurrentState<
      string | string[] | undefined
    >(() => {
      if (!multiple) return init
      if (Array.isArray(init)) return init
      return typeof init === 'undefined' ? [] : [init]
    })

    const isEmpty = useMemo(() => {
      if (!Array.isArray(value)) return !value
      return value.length === 0
    }, [value])

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

    // the options the keyboard can reach
    const enabledOptions = useMemo(
      () =>
        React.Children.toArray(children).flatMap((child) => {
          if (
            !React.isValidElement<{
              value?: string
              disabled?: boolean
              label?: boolean
              divider?: boolean
              children?: React.ReactNode
            }>(child)
          )
            return []
          const {
            value: optionValue,
            disabled,
            label,
            divider,
            children: content
          } = child.props
          if (optionValue === undefined || disabled || label || divider)
            return []
          // typing matches what the option shows, or its value when that is not text
          const text =
            typeof content === 'string' || typeof content === 'number'
              ? String(content)
              : optionValue
          return [{ value: optionValue, text: text.toLowerCase() }]
        }),
      [children]
    )
    const enabledValues = useMemo(
      () => enabledOptions.map((option) => option.value),
      [enabledOptions]
    )
    const latestEnabled = useLatest(enabledValues)

    // the keyboard starts on the chosen option, or on the first one
    const updateVisible = useCallback(
      (next: boolean) => {
        onDropdownVisibleChange(next)
        setVisible(next)
        if (!next) return setActiveValue(undefined)
        const chosen = ([] as string[]).concat(valueRef.current ?? [])
        setActiveValue(
          chosen.find((item) => latestEnabled.current.includes(item)) ??
            latestEnabled.current[0]
        )
      },
      [onDropdownVisibleChange, valueRef, latestEnabled]
    )

    const updateValue = useCallback(
      (next: string) => {
        setValue((last) => {
          if (!Array.isArray(last)) return next
          if (!last.includes(next)) return [...last, next]
          return last.filter((item) => item !== next)
        })
        if (onChange) onChange(valueRef.current as string | string[])
        if (!multiple) {
          updateVisible(false)
        }
      },
      [setValue, onChange, valueRef, multiple, updateVisible]
    )

    const initialValue: SelectConfig = useMemo(
      () => ({
        value,
        visible,
        updateValue,
        updateVisible,
        ref,
        disableAll: disabled,
        activeValue,
        listId,
        multiple
      }),
      [
        visible,
        disabled,
        ref,
        value,
        updateValue,
        updateVisible,
        activeValue,
        listId,
        multiple
      ]
    )

    const clickHandler = (event: React.MouseEvent<HTMLDivElement>) => {
      event.stopPropagation()
      event.nativeEvent.stopImmediatePropagation()
      event.preventDefault()
      if (disabled) return

      updateVisible(!visible)
      event.preventDefault()
    }
    const mouseDownHandler = (event: React.MouseEvent<HTMLDivElement>) => {
      /* istanbul ignore next */
      if (visible) {
        event.preventDefault()
      }
    }

    useEffect(() => {
      if (customValue === undefined) return
      setValue(customValue)
    }, [customValue, setValue])

    useImperativeHandle(
      selectRef,
      () => ({
        focus: () => inputRef.current?.focus(),
        blur: () => inputRef.current?.blur(),
        scrollTo: (options) => dropdownRef.current?.scrollTo(options)
      }),
      [inputRef, dropdownRef]
    )

    const selectedChild = useMemo(() => {
      const [, optionChildren] = pickChildByProps(children, 'value', value)
      return React.Children.map(optionChildren, (child) => {
        if (
          !React.isValidElement<{
            value: string
            preventAllEvents?: boolean
            children?: React.ReactNode
          }>(child)
        )
          return null
        const el = React.cloneElement(child, {
          preventAllEvents: true
        })
        if (!multiple) return el
        const content = child.props.children
        const name =
          typeof content === 'string' || typeof content === 'number'
            ? String(content)
            : child.props.value
        return (
          <SelectMultipleValue
            disabled={disabled}
            label={`Remove ${name}`}
            onClear={clearable ? () => updateValue(child.props.value) : null}
          >
            {el}
          </SelectMultipleValue>
        )
      })
    }, [value, children, multiple, clearable, disabled, updateValue])

    // letters typed within half a second find an option by its start
    const typed = useRef('')
    const typedTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
      undefined
    )
    useEffect(() => () => clearTimeout(typedTimer.current), [])

    const keyDownHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (disabled) return
      const { key } = event
      if (
        key.length === 1 &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.altKey &&
        (key !== ' ' || typed.current)
      ) {
        event.preventDefault()
        typed.current += key.toLowerCase()
        clearTimeout(typedTimer.current)
        typedTimer.current = setTimeout(() => (typed.current = ''), 500)
        // the same letter again goes on to the next option that starts with it
        const from =
          activeValue === undefined ? -1 : enabledValues.indexOf(activeValue)
        const start = typed.current.length === 1 ? from + 1 : Math.max(from, 0)
        const found = [
          ...enabledOptions.slice(start),
          ...enabledOptions.slice(0, start)
        ].find((option) => option.text.startsWith(typed.current))
        if (!found) return
        if (!visible) updateVisible(true)
        setActiveValue(found.value)
        return
      }
      const options = enabledValues
      const move = (to: number) => {
        event.preventDefault()
        if (options.length)
          setActiveValue(options[Math.min(options.length - 1, Math.max(0, to))])
      }
      const current =
        activeValue === undefined ? -1 : options.indexOf(activeValue)

      if (key === 'ArrowDown' || key === 'ArrowUp') {
        if (!visible) {
          event.preventDefault()
          return updateVisible(true)
        }
        if (key === 'ArrowDown') move(current + 1)
        else move(current < 0 ? options.length - 1 : current - 1)
      } else if (key === 'Home' && visible) {
        move(0)
      } else if (key === 'End' && visible) {
        move(options.length - 1)
      } else if (key === 'Enter' || key === ' ') {
        event.preventDefault()
        if (!visible) updateVisible(true)
        else if (activeValue !== undefined) updateValue(activeValue)
      } else if (key === 'Escape' && visible) {
        event.preventDefault()
        updateVisible(false)
      }
    }

    // keeps the option the keyboard is on inside the list
    useEffect(() => {
      if (activeValue === undefined) return
      document
        .getElementById(getOptionId(listId, activeValue))
        ?.scrollIntoView?.({ block: 'nearest' })
    }, [activeValue, listId])

    const onInputBlur = () => {
      updateVisible(false)
      setSelectFocus(false)
    }
    const classes = useClasses(
      styles.select,
      {
        [styles.active]: selectFocus || visible,
        [styles.multiple]: multiple
      },
      className
    )

    const selectStyle = {
      '--select-cursor': disabled ? 'not-allowed' : 'pointer',
      '--select-border-color': colors.borderColor,
      '--select-radius': rounded ? '25px' : theme.layout.radius,
      '--select-bg-color': colors.bgColor,
      '--select-font-size': SCALES.font(0.875),
      '--select-height': SCALES.height(2.25),
      '--select-width': SCALES.width(1, 'initial'),
      '--select-padding-top': SCALES.pt(0),
      '--select-padding-right': SCALES.pr(0.334),
      '--select-padding-bottom': SCALES.pb(0),
      '--select-padding-left': SCALES.pl(0.875),
      '--select-margin-top': SCALES.mt(0),
      '--select-margin-right': SCALES.mr(0),
      '--select-margin-bottom': SCALES.mb(0),
      '--select-margin-left': SCALES.ml(0),
      '--select-multiple-padding-top': SCALES.pt(0.334),
      '--select-hover-border': colors.hoverBorder,
      '--select-hover-bg-color': colors.hoverBgColor,
      '--select-focus-border': colors.focusBorder,
      '--select-placeholder-color': colors.placeholderColor,
      '--select-icon-color': colors.iconColor,
      '--select-color': colors.color,
      '--select-placeholder-font-size': SCALES.font(0.875),
      '--select-icon-right': theme.layout.gapQuarter,
      '--select-icon-rotate': visible ? '180deg' : '0deg',
      ...style
    } as React.CSSProperties

    return (
      <SelectContext.Provider value={initialValue}>
        <div
          className={classes}
          ref={ref}
          onClick={clickHandler}
          onMouseDown={mouseDownHandler}
          {...props}
          style={selectStyle}
        >
          <SelectInput
            ref={inputRef}
            ariaLabel={
              ariaLabel ||
              (typeof placeholder === 'string' ? placeholder : undefined)
            }
            ariaLabelledby={ariaLabelledby}
            visible={visible}
            onBlur={onInputBlur}
            onFocus={() => setSelectFocus(true)}
            onKeyDown={keyDownHandler}
            controls={listId}
            activeDescendant={
              activeValue === undefined
                ? undefined
                : getOptionId(listId, activeValue)
            }
          />
          {isEmpty && (
            <span className={joinClasses(styles.value, styles.placeholder)}>
              <Ellipsis height="var(--select-height)">{placeholder}</Ellipsis>
            </span>
          )}
          {value && !multiple && (
            <span className={styles.value}>{selectedChild}</span>
          )}
          {value && multiple && (
            <Grid.Container gap={0.5}>{selectedChild}</Grid.Container>
          )}
          <SelectDropdown
            ref={dropdownRef}
            visible={visible}
            ariaLabel={
              ariaLabel ||
              (typeof placeholder === 'string' ? placeholder : undefined)
            }
            ariaLabelledby={ariaLabelledby}
            colors={colors}
            className={dropdownClassName}
            dropdownStyle={dropdownStyle}
            disableMatchWidth={disableMatchWidth}
            getPopupContainer={getPopupContainer}
          >
            {children}
          </SelectDropdown>
          {!pure && (
            <div className={styles.icon}>
              <Icon />
            </div>
          )}
        </div>
      </SelectContext.Provider>
    )
  }
)

SelectComponent.displayName = 'BolioUISelect'
const Select = withScale(SelectComponent)
export default Select
