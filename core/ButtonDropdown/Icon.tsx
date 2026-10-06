import React from 'react'
import styles from './Icon.module.css'

interface Props {
  color?: string
  height?: string
}

function ButtonDropdownIcon({ color, height }: Props) {
  return (
    <svg
      stroke={color}
      style={{ color }}
      viewBox="0 0 24 24"
      width={height}
      height={height}
      strokeWidth="1.5"
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

ButtonDropdownIcon.displayName = 'BolioUIButtonDropdownIcon'
export default ButtonDropdownIcon
