import React, { useEffect, useRef } from 'react'
import styles from './ButtonDrip.module.css'

interface Props {
  x: number
  y: number
  onCompleted: () => void
  color: string
}

export type ButtonDrip = Props

const ButtonDrip: React.FC<ButtonDrip> = ({
  x = 0,
  y = 0,
  color,
  onCompleted
}: ButtonDrip) => {
  const dripRef = useRef<HTMLDivElement>(null)

  const top = Number.isNaN(+y) ? 0 : y - 10
  const left = Number.isNaN(+x) ? 0 : x - 10

  useEffect(() => {
    const drip = dripRef.current
    if (!drip) return
    drip.addEventListener('animationend', onCompleted)
    return () => drip.removeEventListener('animationend', onCompleted)
  })

  return (
    <div ref={dripRef} className={styles.drip}>
      <svg width="20" height="20" viewBox="0 0 20 20" style={{ top, left }}>
        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
          <g fill={color}>
            <rect width="100%" height="100%" rx="10" />
          </g>
        </g>
      </svg>
    </div>
  )
}

ButtonDrip.displayName = 'BolioUItButtonDrip'
export default ButtonDrip
