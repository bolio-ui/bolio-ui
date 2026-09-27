import React from 'react'
import styles from './CollapseIcon.module.css'

interface Props {
  active?: boolean
}

function CollapseIcon({ active }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      shapeRendering="geometricPrecision"
      className={styles.svg}
      style={{ color: 'currentColor', transform: `rotateZ(${active ? '-180deg' : '0'})` }}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}

const MemoCollapseIcon = React.memo(CollapseIcon)

export default MemoCollapseIcon
