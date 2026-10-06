import React from 'react'
import styles from './Icon.module.css'

export function LinkIconComponent() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="0.9375em"
      height="0.9375em"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      shapeRendering="geometricPrecision"
      className={styles.icon}
    >
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
      <path d="M15 3h6v6" />
      <path d="M10 14L21 3" />
    </svg>
  )
}

LinkIconComponent.displayName = 'BolioUILinkIcon'
const LinkIcon = React.memo(LinkIconComponent)
export default LinkIcon
