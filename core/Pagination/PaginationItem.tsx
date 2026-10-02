import React, { useMemo } from 'react'
import useTheme from '../use-theme'
import { addColorAlpha } from '../utils/color'
import useClasses from '../use-classes'
import type { AnyElement } from '../utils/types'
import styles from './PaginationItem.module.css'

interface Props {
  active?: boolean
  disabled?: boolean
  onClick?: (e: React.MouseEvent) => void
}

type NativeAttrs = Omit<React.ButtonHTMLAttributes<AnyElement>, keyof Props>
export type PaginationItemProps = Props & NativeAttrs

function PaginationItem({
  active,
  children,
  disabled,
  onClick,
  style,
  ...props
}: PaginationItemProps) {
  const theme = useTheme()

  const [hover, activeHover] = useMemo(
    () => [
      addColorAlpha(theme.palette.primary, 0.1),
      addColorAlpha(theme.palette.primary, 0.8)
    ],
    [theme.palette.primary]
  )

  const classes = useClasses(styles.button, {
    [styles.active]: active,
    [styles.disabled]: disabled
  })

  const clickHandler = (event: React.MouseEvent) => {
    if (disabled) return
    if (onClick) onClick(event)
  }

  const buttonStyle = {
    '--pagination-color': theme.palette.primary,
    '--pagination-radius': theme.layout.radius,
    '--pagination-bg': theme.palette.background,
    '--pagination-hover-bg': hover,
    '--pagination-active-bg': theme.palette.primary,
    '--pagination-active-color': theme.palette.background,
    '--pagination-active-shadow': theme.expressiveness.shadowSmall,
    '--pagination-active-hover-bg': activeHover,
    '--pagination-active-hover-shadow': theme.expressiveness.shadowMedium,
    '--pagination-disabled-color': theme.palette.accents_4,
    '--pagination-disabled-hover-bg': theme.palette.accents_2,
    ...style
  } as React.CSSProperties

  return (
    <li className={styles.li}>
      <button
        className={classes}
        aria-current={active ? 'page' : undefined}
        onClick={clickHandler}
        {...props}
        style={buttonStyle}
      >
        {children}
      </button>
    </li>
  )
}

PaginationItem.displayName = 'BolioUIPaginationItem'
export default PaginationItem
