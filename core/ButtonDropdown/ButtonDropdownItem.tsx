import React, { MouseEvent, useMemo } from 'react'
import useTheme from '../use-theme'
import { getColor } from './styles'
import { useButtonDropdown } from './ButtonDropdownContext'
import Loading from '../Loading'
import { NormalTypes } from '../utils/prop-types'

export type ButtonDropdownItemTypes = NormalTypes

interface Props {
  main?: boolean
  type?: ButtonDropdownItemTypes
  onClick?: React.MouseEventHandler<HTMLElement>
  className?: string
}

type NativeAttrs = Omit<React.ButtonHTMLAttributes<any>, keyof Props>
export type ButtonDropdownItemProps = Props & NativeAttrs

function ButtonDropdownItem({
  children,
  onClick,
  className = '',
  main = false,
  type: selfType = 'default' as ButtonDropdownItemTypes,
  ...props
}: ButtonDropdownItemProps) {
  const theme = useTheme()

  const { type: parentType, disabled, loading } = useButtonDropdown()
  const type = main ? parentType : selfType
  const colors = getColor(theme.palette, type, disabled)
  const clickHandler = (event: MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return
    onClick && onClick(event)
  }

  const cursor = useMemo(() => {
    if (loading) return 'default'
    return disabled ? 'not-allowed' : 'pointer'
  }, [loading, disabled])

  return (
    <button className={className} onClick={clickHandler} {...props}>
      {loading ? <Loading /> : children}
      <style jsx>{`
        button {
          position: relative;
          -webkit-appearance: button;
          text-rendering: auto;
          display: inline-flex;
          flex: 1;
          justify-content: center;
          align-items: center;
          vertical-align: middle;
          text-align: center;
          cursor: ${cursor};
          box-sizing: border-box;
          margin: 0;
          border: none;
          background-color: ${colors.bgColor};
          color: ${colors.color};
          width: 100%;
          height: var(--bolio-ui-dropdown-height);
          min-width: var(--bolio-ui-dropdown-min-width);
          padding: var(--bolio-ui-dropdown-padding);
          font-size: var(--bolio-ui-dropdown-font-size);
          font-weight: bold;
        }

        button:hover {
          border-color: ${colors.hoverBorder};
          background-color: ${colors.hoverBgColor};
        }
      `}</style>
    </button>
  )
}

ButtonDropdownItem.displayName = 'BolioUIButtonDropdownItem'
export default ButtonDropdownItem
