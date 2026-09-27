import React, { useCallback, useMemo, useState } from 'react'
import useTheme from '../use-theme'
import useCurrentState from '../utils/use-current-state'
import { FieldsetContext, FieldItem } from './FieldsetContext'
import logWarning from '../utils/log-warning'
import useScale, { withScale } from '../use-scale'
import useClasses, { joinClasses } from '../use-classes'
import type { AnyElement } from '../utils/types'
import styles from './FieldsetGroup.module.css'

interface Props {
  value: string
  className?: string
  onChange?: (value: string) => void
}

type NativeAttrs = Omit<React.HTMLAttributes<AnyElement>, keyof Props>
export type FieldsetGroupProps = Props & NativeAttrs

function FieldsetGroupComponent({
  className = '',
  children,
  value,
  onChange,
  style,
  ...props
}: React.PropsWithChildren<FieldsetGroupProps>) {
  const theme = useTheme()
  const { SCALES } = useScale()
  const [selfVal, setSelfVal] = useState<string>(value)
  const [items, setItems, ref] = useCurrentState<FieldItem[]>([])
  const classes = useClasses('group', className)

  const register = useCallback(
    (newItem: FieldItem) => {
      const hasItem = ref.current.find((item) => item.value === newItem.value)
      if (hasItem) {
        logWarning('The "value" of each "Fieldset" must be unique.', 'Fieldset')
      }
      setItems([...ref.current, newItem])
    },
    [ref, setItems]
  )

  const providerValue = useMemo(
    () => ({
      currentValue: selfVal,
      inGroup: true,
      register
    }),
    [selfVal, register]
  )

  const clickHandle = useCallback(
    (nextValue: string) => {
      setSelfVal(nextValue)
      if (onChange) onChange(nextValue)
    },
    [onChange]
  )

  const groupStyle = {
    width: SCALES.width(1, 'auto'),
    height: SCALES.height(1, 'auto'),
    padding: `${SCALES.pt(0)} ${SCALES.pr(0)} ${SCALES.pb(0)} ${SCALES.pl(0)}`,
    margin: `${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)} ${SCALES.ml(0)}`,
    '--fieldset-group-color': theme.palette.accents_3,
    '--fieldset-group-bg': theme.palette.accents_1,
    '--fieldset-group-border': theme.palette.border,
    '--fieldset-group-radius': theme.layout.radius,
    '--fieldset-group-active-bg': theme.palette.background,
    '--fieldset-group-active-color': theme.palette.foreground,
    ...style
  } as React.CSSProperties

  return (
    <FieldsetContext.Provider value={providerValue}>
      <div className={classes} {...props} style={groupStyle}>
        <div className={styles.groupTabs} style={{ fontSize: SCALES.font(1) }}>
          {items.map((item) => (
            <button
              onClick={() => clickHandle(item.value)}
              key={item.value}
              className={joinClasses(styles.button, {
                [styles.active]: selfVal === item.value
              })}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className={styles.groupContent}>{children}</div>
      </div>
    </FieldsetContext.Provider>
  )
}

FieldsetGroupComponent.displayName = 'BolioUIFieldsetGroup'
const FieldsetGroup = withScale(FieldsetGroupComponent)
export default FieldsetGroup
