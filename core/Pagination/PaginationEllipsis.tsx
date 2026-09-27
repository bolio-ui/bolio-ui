import React, { useState } from 'react'
import PaginationItem from './PaginationItem'
import styles from './PaginationEllipsis.module.css'

interface Props {
  isBefore?: boolean
  onClick?: (e: React.MouseEvent) => void
}

function PaginationEllipsis({ isBefore, onClick }: Props) {
  const [showMore, setShowMore] = useState(false)

  return (
    <PaginationItem
      onClick={(e) => onClick && onClick(e)}
      onMouseEnter={() => setShowMore(true)}
      onMouseLeave={() => setShowMore(false)}
    >
      {showMore ? (
        <svg
          className={styles.svg}
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          shapeRendering="geometricPrecision"
          style={{ transform: `rotate(${isBefore ? '180deg' : '0deg'})` }}
        >
          <path d="M13 17l5-5-5-5" />
          <path d="M6 17l5-5-5-5" />
        </svg>
      ) : (
        <svg
          className={styles.svg}
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          shapeRendering="geometricPrecision"
        >
          <circle cx="12" cy="12" r="1" fill="currentColor" />
          <circle cx="19" cy="12" r="1" fill="currentColor" />
          <circle cx="5" cy="12" r="1" fill="currentColor" />
        </svg>
      )}
    </PaginationItem>
  )
}

PaginationEllipsis.displayName = 'BolioUIPaginationEllipsis'
export default PaginationEllipsis
