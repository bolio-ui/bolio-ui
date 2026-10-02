import React from 'react'
import styles from './SelectIcon.module.css'

function SelectIconComponent() {
  return (
    <svg
      viewBox="0 0 24 24"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      shapeRendering="geometricPrecision"
      className={styles.icon}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}

SelectIconComponent.displayName = 'BolioUISelectIcon'
const SelectIcon = React.memo(SelectIconComponent)
export default SelectIcon
