import React from 'react'
import { useSegmentedControlContext } from './SegmentedControlContext'
import type { SegmentedControlValue } from './SegmentedControlContext'
import useClasses from '../use-classes'
import styles from './SegmentedControlItem.module.css'

interface Props {
  value: SegmentedControlValue
  disabled?: boolean
  className?: string
}

type NativeAttrs = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  keyof Props | 'type' | 'name' | 'checked' | 'onChange'
>
export type SegmentedControlItemProps = Props & NativeAttrs

const SegmentedControlItem = React.forwardRef<
  HTMLInputElement,
  React.PropsWithChildren<SegmentedControlItemProps>
>(
  (
    { value, disabled = false, className = '', children, style, ...props },
    ref
  ) => {
    const group = useSegmentedControlContext()

    return (
      <label className={useClasses(styles.item, className)} style={style}>
        <input
          ref={ref}
          type="radio"
          className={styles.input}
          name={group.name}
          value={value}
          checked={group.value === value}
          disabled={disabled || group.disabled}
          onChange={() => group.select?.(value)}
          {...props}
        />
        <span className={styles.text}>{children}</span>
      </label>
    )
  }
)

SegmentedControlItem.displayName = 'BolioUISegmentedControlItem'
export default SegmentedControlItem
