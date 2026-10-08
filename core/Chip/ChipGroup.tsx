import React, { useId, useMemo, useState } from 'react'
import useClasses from '../use-classes'
import { ChipContext } from './ChipContext'
import type { ChipValue } from './ChipContext'
import styles from './ChipGroup.module.css'

interface Props {
  // the values of the checked chips; a single chip at a time without `multiple`
  value?: Array<ChipValue>
  initialValue?: Array<ChipValue>
  onChange?: (value: Array<ChipValue>) => void
  multiple?: boolean
  disabled?: boolean
  className?: string
}

type NativeAttrs = Omit<React.HTMLAttributes<HTMLDivElement>, keyof Props>
export type ChipGroupProps = Props & NativeAttrs

const ChipGroup = React.forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<ChipGroupProps>
>(
  (
    {
      value: customValue,
      initialValue = [],
      onChange,
      multiple = false,
      disabled = false,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const name = useId()
    const [selfValue, setSelfValue] = useState(initialValue)
    const value = customValue !== undefined ? customValue : selfValue

    const providerValue = useMemo(
      () => ({
        name,
        multiple,
        value,
        disabled,
        toggle: (chip: ChipValue) => {
          const next = !multiple
            ? [chip]
            : value.includes(chip)
              ? value.filter((v) => v !== chip)
              : [...value, chip]
          setSelfValue(next)
          if (onChange) onChange(next)
        }
      }),
      [name, multiple, value, disabled, onChange]
    )

    return (
      <ChipContext.Provider value={providerValue}>
        <div
          ref={ref}
          role={multiple ? 'group' : 'radiogroup'}
          className={useClasses(styles.group, className)}
          {...props}
        >
          {children}
        </div>
      </ChipContext.Provider>
    )
  }
)

ChipGroup.displayName = 'BolioUIChipGroup'
export default ChipGroup
