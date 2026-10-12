import React from 'react'
import useTheme from '../use-theme'
import { joinClasses } from '../use-classes'
import styles from './SelectIconClear.module.css'

interface Props {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  // the accessible name of the button
  label?: string
}

function SelectIconClear({ onClick, label = 'Clear' }: Props) {
  const theme = useTheme()

  const clickHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()
    event.nativeEvent.stopImmediatePropagation()
    if (onClick) onClick(event)
  }

  return (
    <button
      type="button"
      aria-label={label}
      onClick={clickHandler}
      className={joinClasses('clear-icon', styles.clearIcon)}
      style={
        {
          '--select-clear-icon-color': theme.palette.accents_5,
          '--select-clear-icon-hover-color': theme.palette.foreground
        } as React.CSSProperties
      }
    >
      <svg
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        shapeRendering="geometricPrecision"
      >
        <path d="M18 6L6 18" />
        <path d="M6 6l12 12" />
      </svg>
    </button>
  )
}

const MemoSelectIconClear = React.memo(SelectIconClear)

export default MemoSelectIconClear
