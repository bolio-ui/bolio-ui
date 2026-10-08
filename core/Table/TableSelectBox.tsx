import React, { useEffect, useRef } from 'react'
import styles from './TableSelectBox.module.css'

interface Props {
  checked: boolean
  // some, but not all, of the rows
  indeterminate?: boolean
  label: string
  onChange: () => void
}

// a native checkbox: the state in between is only a property of the input
function TableSelectBox({
  checked,
  indeterminate = false,
  label,
  onChange
}: Props) {
  const ref = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate
  }, [indeterminate])

  return (
    <input
      ref={ref}
      type="checkbox"
      className={styles.box}
      checked={checked}
      aria-label={label}
      onChange={onChange}
      // a click on the checkbox is not a click on the row
      onClick={(event) => event.stopPropagation()}
    />
  )
}

export default TableSelectBox
