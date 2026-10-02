import React from 'react'
import useClasses from '../use-classes'
import styles from './InputIconClear.module.css'

interface Props {
  visible: boolean
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void
  disabled?: boolean
  hoverColor: string
}

function InputIconClear({ onClick, disabled, visible, hoverColor }: Props) {
  const classes = useClasses(styles.clearIcon, { [styles.visible]: visible })

  const clickHandler = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    event.nativeEvent.stopImmediatePropagation()
    if (onClick) onClick(event)
  }

  const iconStyle = {
    cursor: disabled ? 'not-allowed' : 'pointer',
    '--clear-icon-hover-color': hoverColor
  } as React.CSSProperties

  return (
    <div onClick={clickHandler} className={classes} style={iconStyle}>
      <svg
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        shapeRendering="geometricPrecision"
        className={styles.svg}
      >
        <path d="M18 6L6 18" />
        <path d="M6 6l12 12" />
      </svg>
    </div>
  )
}

const MemoInputIconClear = React.memo(InputIconClear)

export default MemoInputIconClear
