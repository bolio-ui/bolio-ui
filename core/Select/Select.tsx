import React, {
  CSSProperties,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from 'react'
import { NormalTypes } from '../utils/prop-types'
import useTheme from '../use-theme'
import useCurrentState from '../utils/use-current-state'
import { pickChildByProps } from '../utils/collections'
import SelectIcon from './SelectIcon'
import SelectDropdown from './SelectDropdown'
import SelectMultipleValue from './SelectMultipleValue'
import Grid from '../Grid'
import { SelectContext, SelectConfig } from './SelectContext'
import { getColors } from './styles'
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
      () => getColors(theme.palette, type, disabled),
      [theme.palette, type, disabled]
    )

    const updateVisible = useCallback(
      (next: boolean) => {
        onDropdownVisibleChange(next)
        setVisible(next)
      },
      [onDropdownVisibleChange]
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
        disableAll: disabled
      }),
      [visible, disabled, ref, value, updateValue, updateVisible]
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
          !React.isValidElement<{ value: string; preventAllEvents?: boolean }>(
            child
          )
        )
          return null
        const el = React.cloneElement(child, {
          preventAllEvents: true
        })
        if (!multiple) return el
        return (
          <SelectMultipleValue
            disabled={disabled}
            onClear={clearable ? () => updateValue(child.props.value) : null}
          >
            {el}
          </SelectMultipleValue>
        )
      })
    }, [value, children, multiple, clearable, disabled, updateValue])

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
      '--select-radius': theme.layout.radius,
      '--select-bg-color': colors.bgColor,
      '--select-font-size': SCALES.font(0.875),
      '--select-height': SCALES.height(2.25),
      '--select-width': SCALES.width(1, 'initial'),
      '--select-padding-top': SCALES.pt(0),
      '--select-padding-right': SCALES.pr(0.334),
      '--select-padding-bottom': SCALES.pb(0),
      '--select-padding-left': SCALES.pl(0.667),
      '--select-margin-top': SCALES.mt(0),
      '--select-margin-right': SCALES.mr(0),
      '--select-margin-bottom': SCALES.mb(0),
      '--select-margin-left': SCALES.ml(0),
      '--select-multiple-padding-top': SCALES.pt(0.334),
      '--select-hover-border': colors.hoverBorder,
      '--select-hover-bg-color': colors.hoverBgColor,
      '--select-color': colors.color,
      '--select-placeholder-font-size': SCALES.font(0.775),
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
