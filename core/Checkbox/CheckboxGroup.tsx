import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { CheckboxContext } from './CheckboxContext'
import logWarning from '../utils/log-warning'
import useScale, { withScale } from '../use-scale'
import useClasses from '../use-classes'
import type { AnyElement } from '../utils/types'
import styles from './CheckboxGroup.module.css'

interface Props {
  value: string[]
  disabled?: boolean
  onChange?: (values: string[]) => void
  className?: string
}

type NativeAttrs = Omit<React.HTMLAttributes<AnyElement>, keyof Props>
export type CheckboxGroupProps = Props & NativeAttrs

// Without `value` the group starts empty and keeps its own state. It has to
// be the same array on every render: the effect below sets the state
// whenever `value` changes, and a new array each time made it loop
const noValue: string[] = []

function CheckboxGroupComponent({
  disabled = false,
  onChange,
  value,
  children,
  className = '',
  style,
  ...props
}: CheckboxGroupProps) {
  const { SCALES } = useScale()

  const [selfVal, setSelfVal] = useState<string[]>([])
  const classes = useClasses(styles.group, className)

  if (!value) {
    value = noValue
    logWarning('Props "value" is required.', 'Checkbox Group')
  }

  const updateState = useCallback(
    (val: string, checked: boolean) => {
      const removed = selfVal.filter((v) => v !== val)
      const next = checked ? [...removed, val] : removed
      setSelfVal(next)
      if (onChange) onChange(next)
    },
    [selfVal, onChange]
  )

  const providerValue = useMemo(() => {
    return {
      updateState,
      disabledAll: disabled,
      inGroup: true,
      values: selfVal
    }
  }, [updateState, disabled, selfVal])

  useEffect(() => {
    setSelfVal(value)
  }, [value])

  const groupStyle = {
    width: SCALES.width(1, 'auto'),
    height: SCALES.height(1, 'auto'),
    padding: `${SCALES.pt(0)} ${SCALES.pr(0)} ${SCALES.pb(0)} ${SCALES.pl(0)}`,
    margin: `${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)} ${SCALES.ml(0)}`,
    '--checkbox-group-gap': `calc(${SCALES.font(1)} * 2)`,
    '--checkbox-group-item-size': SCALES.font(1),
    ...style
  } as React.CSSProperties

  return (
    <CheckboxContext.Provider value={providerValue}>
      <div className={classes} {...props} style={groupStyle}>
        {children}
      </div>
    </CheckboxContext.Provider>
  )
}

CheckboxGroupComponent.displayName = 'BolioUICheckboxGroup'
const CheckboxGroup = withScale(CheckboxGroupComponent)

export default CheckboxGroup
