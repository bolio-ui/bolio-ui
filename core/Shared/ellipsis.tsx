import React from 'react'
import styles from './ellipsis.module.css'

export type EllipsisProps = {
  height: string
}

const Ellipsis: React.FC<React.PropsWithChildren<EllipsisProps>> = ({
  children,
  height
}) => {
  return (
    <span className={styles.ellipsis} style={{ lineHeight: height }}>
      {children}
    </span>
  )
}

export default React.memo(Ellipsis)
