import React, { useEffect, useImperativeHandle, useRef } from 'react'
import styles from './SelectInput.module.css'

export type SelectInputProps = {
  visible: boolean
  onBlur: () => void
  onFocus: () => void
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void
  // the list the field controls and the option the keyboard is on
  controls?: string
  activeDescendant?: string
  ariaLabel?: string
  ariaLabelledby?: string
}

const SelectInput = React.forwardRef<HTMLInputElement | null, SelectInputProps>(
  (
    {
      visible,
      onBlur,
      onFocus,
      onKeyDown,
      controls,
      activeDescendant,
      ariaLabel,
      ariaLabelledby
    },
    inputRef
  ) => {
    const ref = useRef<HTMLInputElement | null>(null)
    useImperativeHandle<HTMLInputElement | null, HTMLInputElement | null>(
      inputRef,
      () => ref.current
    )

    useEffect(() => {
      if (visible) {
        ref.current?.focus()
      }
    }, [visible])

    return (
      <input
        ref={ref}
        type="search"
        role="combobox"
        aria-haspopup="listbox"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        readOnly
        unselectable="on"
        aria-expanded={visible}
        aria-controls={visible ? controls : undefined}
        aria-activedescendant={visible ? activeDescendant : undefined}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
        onFocus={onFocus}
        className={styles.input}
      />
    )
  }
)

SelectInput.displayName = 'BolioUISelectInput'
export default SelectInput
