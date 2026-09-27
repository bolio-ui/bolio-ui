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
  type: selfType = 'default' as ButtonDropdownItemTypes,
  style,
  ...props
}: ButtonDropdownItemProps) {
  const theme = useTheme()

  const { type: parentType, disabled, loading } = useButtonDropdown()
  const type = main ? parentType : selfType
  const colors = getColor(theme.palette, type, disabled)
  const clickHandler = (event: MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return
    if (onClick) onClick(event)
  }

  const cursor = useMemo(() => {
    if (loading) return 'default'
    return disabled ? 'not-allowed' : 'pointer'
  }, [loading, disabled])

  const buttonStyle = {
    cursor,
    backgroundColor: colors.bgColor,
    color: colors.color,
    '--dropdown-item-hover-border': colors.hoverBorder,
    '--dropdown-item-hover-bg': colors.hoverBgColor,
    ...style
  } as React.CSSProperties

  return (
    <button
      className={`${styles.button} ${className}`.trim()}
      onClick={clickHandler}
      {...props}
      style={buttonStyle}
    >
      {loading ? <Loading /> : children}
    </button>
  )
}

ButtonDropdownItem.displayName = 'BolioUIButtonDropdownItem'
export default ButtonDropdownItem
