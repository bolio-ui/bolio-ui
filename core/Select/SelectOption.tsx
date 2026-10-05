import React, { useMemo } from 'react'
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
  const { SCALES } = useScale()

  const { updateValue, value, disableAll } = useSelectContext()

  const isDisabled = useMemo(
    () => disabled || disableAll,
    [disabled, disableAll]
  )
  const isLabel = useMemo(() => label || divider, [label, divider])
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

  const classes = useClasses(
    styles.option,
    {
      [styles.divider]: divider,
      [styles.label]: label,
      [styles.selected]: selected,
      [styles.disabled]: isDisabled
    },
    className
  )

  const clickHandler = (event: React.MouseEvent<HTMLDivElement>) => {
    if (preventAllEvents) return
    event.stopPropagation()
    event.nativeEvent.stopImmediatePropagation()
    event.preventDefault()
    if (isDisabled || isLabel) return
    if (updateValue) updateValue(identValue)
  }

  const optionStyle = {
    '--select-option-cursor': isDisabled ? 'not-allowed' : 'pointer',
    '--select-font-size': SCALES.font(0.875),
    '--select-option-width': SCALES.width(1, '100%'),
    '--select-option-height': SCALES.height(2.25),
    '--select-option-padding-top': SCALES.pt(0),
    '--select-option-padding-right': SCALES.pr(0.75),
    '--select-option-padding-bottom': SCALES.pb(0),
    '--select-option-padding-left': SCALES.pl(0.75),
    '--select-option-margin-top': SCALES.mt(0),
    '--select-option-margin-right': SCALES.mr(0),
    '--select-option-margin-bottom': SCALES.mb(0),
    '--select-option-margin-left': SCALES.ml(0),
    '--select-option-divider-height': SCALES.height(1, 0),
    '--select-option-divider-padding-top': SCALES.pt(0),
    '--select-option-divider-padding-right': SCALES.pr(0),
    '--select-option-divider-padding-bottom': SCALES.pb(0),
    '--select-option-divider-padding-left': SCALES.pl(0),
    '--select-option-divider-margin-top': SCALES.mt(0.5),
    '--select-option-divider-margin-right': SCALES.mr(0),
    '--select-option-divider-margin-bottom': SCALES.mb(0.5),
    '--select-option-divider-margin-left': SCALES.ml(0),
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
