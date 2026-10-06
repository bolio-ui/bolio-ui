import React from 'react'
import styles from './Blockholder.module.css'

export interface Props {
  className?: string
  width?: string
  height?: string
  alt?: string
}

const PlaceholderBlock: React.FC<Props> = ({
  className = '',
  width = '100%',
  height = '100%',
  alt = 'block placeholder',
  ...props
}) => {
  return (
    <div
      className={`${styles.block} ${className}`}
      style={{ width, height }}
      {...props}
    >
      <img
        className={styles.img}
        alt={alt}
        src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
      />
    </div>
  )
}

export default PlaceholderBlock
