import React from 'react'
import useTheme from '../use-theme'
import useClasses from '../use-classes'
import styles from './InputIconClear.module.css'

interface Props {
  visible: boolean
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void
  disabled?: boolean
}

function InputIconClear({ onClick, disabled, visible }: Props) {
  const theme = useTheme()
  const classes = useClasses(styles.clearIcon, { [styles.visible]: visible })

  const clickHandler = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    event.nativeEvent.stopImmediatePropagation()
    if (onClick) onClick(event)
  }

  const iconStyle = {
    cursor: disabled ? 'not-allowed' : 'pointer',
    color: theme.palette.accents_3,
    '--clear-icon-hover-color': disabled
      ? theme.palette.accents_3
      : theme.palette.foreground
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
