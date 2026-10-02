import React, { useMemo } from 'react'
import useTheme from '../use-theme'
import { useSelectContext } from './SelectContext'
import logWarning from '../utils/log-warning'
import Ellipsis from '../Shared/ellipsis'
import useScale, { withScale } from '../use-scale'
import useClasses from '../use-classes'
import type { AnyElement } from '../utils/types'
import styles from './SelectOption.module.css'

interface Props {
  value?: string
  disabled?: boolean
  className?: string
  divider?: boolean
  label?: boolean
  preventAllEvents?: boolean
}

type NativeAttrs = Omit<React.HTMLAttributes<AnyElement>, keyof Props>
export type SelectOptionProps = Props & NativeAttrs

function SelectOptionComponent({
  value: identValue = '',
  className = '',
  children,
  disabled = false,
  divider = false,
  label = false,
  preventAllEvents = false,
  style,
  ...props
}: React.PropsWithChildren<SelectOptionProps>) {
  const theme = useTheme()
  const { SCALES } = useScale()

  const { updateValue, value, disableAll } = useSelectContext()

  const isDisabled = useMemo(
    () => disabled || disableAll,
    [disabled, disableAll]
  )
  const isLabel = useMemo(() => label || divider, [label, divider])
  const classes = useClasses(
    styles.option,
    { [styles.divider]: divider, [styles.label]: label },
    className
  )

  if (!isLabel && identValue === undefined) {
    logWarning('The props "value" is required.', 'Select Option')
  }

  const selected = useMemo(() => {
    if (!value) return false
    if (typeof value === 'string') {
      return identValue === value
    }
    return value.includes(`${identValue}`)
  }, [identValue, value])

  const bgColor = useMemo(() => {
    if (isDisabled) return theme.palette.accents_3
    return selected ? theme.palette.accents_3 : theme.palette.accents_2
  }, [selected, isDisabled, theme.palette])

  const hoverBgColor = useMemo(() => {
    if (isDisabled || isLabel || selected) return bgColor
    return theme.palette.accents_1
  }, [selected, isDisabled, theme.palette, isLabel, bgColor])

  const color = useMemo(() => {
    if (isDisabled) return theme.palette.accents_4
    return selected ? theme.palette.foreground : theme.palette.accents_5
  }, [selected, isDisabled, theme.palette])

  const clickHandler = (event: React.MouseEvent<HTMLDivElement>) => {
    if (preventAllEvents) return
    event.stopPropagation()
    event.nativeEvent.stopImmediatePropagation()
    event.preventDefault()
    if (isDisabled || isLabel) return
    if (updateValue) updateValue(identValue)
  }

  const optionStyle = {
    '--select-option-bg': bgColor,
    '--select-option-color': color,
    '--select-option-cursor': isDisabled ? 'not-allowed' : 'pointer',
    '--select-font-size': SCALES.font(0.75),
    '--select-option-width': SCALES.width(1, '100%'),
    '--select-option-height': SCALES.height(2.25),
    '--select-option-padding-top': SCALES.pt(0),
    '--select-option-padding-right': SCALES.pr(0.667),
    '--select-option-padding-bottom': SCALES.pb(0),
    '--select-option-padding-left': SCALES.pl(0.667),
    '--select-option-margin-top': SCALES.mt(0),
    '--select-option-margin-right': SCALES.mr(0),
    '--select-option-margin-bottom': SCALES.mb(0),
    '--select-option-margin-left': SCALES.ml(0),
    '--select-option-hover-bg': hoverBgColor,
    '--select-option-hover-color': theme.palette.accents_7,
    '--select-option-divider-border': theme.palette.accents_3,
    '--select-option-divider-height': SCALES.height(1, 0),
    '--select-option-divider-padding-top': SCALES.pt(0),
    '--select-option-divider-padding-right': SCALES.pr(0),
    '--select-option-divider-padding-bottom': SCALES.pb(0),
    '--select-option-divider-padding-left': SCALES.pl(0),
    '--select-option-divider-margin-top': SCALES.mt(0.5),
    '--select-option-divider-margin-right': SCALES.mr(0),
    '--select-option-divider-margin-bottom': SCALES.mb(0.5),
    '--select-option-divider-margin-left': SCALES.ml(0),
    '--select-option-label-color': theme.palette.accents_7,
    '--select-option-label-font-size': SCALES.font(0.875),
    ...style
  } as React.CSSProperties

  return (
    <div
      className={classes}
      onClick={clickHandler}
      style={optionStyle}
      {...props}
    >
      <Ellipsis height={SCALES.height(2.25)}>{children}</Ellipsis>
    </div>
  )
}

SelectOptionComponent.displayName = 'BolioUISelectOption'
const SelectOption = withScale(SelectOptionComponent)
export default SelectOption
