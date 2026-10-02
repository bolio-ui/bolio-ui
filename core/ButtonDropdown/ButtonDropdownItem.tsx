import React, { MouseEvent, useMemo } from 'react'
import useTheme from '../use-theme'
import { getColor } from './styles'
import { useButtonDropdown } from './ButtonDropdownContext'
import Loading from '../Loading'
import { NormalTypes } from '../utils/prop-types'
import type { AnyElement } from '../utils/types'
import styles from './ButtonDropdownItem.module.css'

export type ButtonDropdownItemTypes = NormalTypes

interface Props {
  main?: boolean
  icon?: React.ReactNode
  type?: ButtonDropdownItemTypes
  onClick?: React.MouseEventHandler<HTMLElement>
  className?: string
}

type NativeAttrs = Omit<React.ButtonHTMLAttributes<AnyElement>, keyof Props>
export type ButtonDropdownItemProps = Props & NativeAttrs

function ButtonDropdownItem({
  children,
  onClick,
  className = '',
  main = false,
  icon,
  type: selfType,
  style,
  ...props
}: ButtonDropdownItemProps) {
  const theme = useTheme()

  const {
    type: parentType,
    disabled,
    loading,
    align,
    close
  } = useButtonDropdown()
  // an item takes the color of its dropdown unless it sets its own `type`
  const type = main ? parentType : (selfType ?? parentType)
  const colors = getColor(theme.palette, type, disabled)
  const clickHandler = (event: MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return
    if (onClick) onClick(event)
    close?.()
  }

  const cursor = useMemo(() => {
    if (loading) return 'default'
    return disabled ? 'not-allowed' : 'pointer'
  }, [loading, disabled])

  // Items in the list look like Combobox options: no fill, tinted on hover.
  // Only the main item keeps the filled button look.
  const buttonStyle = {
    cursor,
    color: main || type !== 'default' ? colors.color : theme.palette.foreground,
    '--dropdown-item-hover-border': colors.hoverBorder,
    '--dropdown-item-hover-bg': main
      ? colors.hoverBgColor
      : type === 'default'
        ? theme.palette.accents_2
        : `color-mix(in srgb, ${colors.color} 12%, transparent)`,
    ...(main && {
      backgroundColor: colors.bgColor,
      justifyContent: align === 'center' ? 'center' : `flex-${align}`
    }),
    ...style
  } as React.CSSProperties

  return (
    <button
      className={`${styles.button} ${main ? '' : styles.option} ${className}`.trim()}
      onClick={clickHandler}
      {...props}
      style={buttonStyle}
    >
      {loading ? (
        <Loading />
      ) : (
        <>
          {icon && <span className={styles.icon}>{icon}</span>}
          {children}
        </>
      )}
    </button>
  )
}

ButtonDropdownItem.displayName = 'BolioUIButtonDropdownItem'
export default ButtonDropdownItem
