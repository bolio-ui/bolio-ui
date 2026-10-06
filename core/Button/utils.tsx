import React, { ReactNode } from 'react'
import ButtonIcon from './ButtonIcon'
import { ButtonProps } from './Button'
import { ButtonGroupConfig } from '../ButtonGroup/ButtonGroupContext'

export const getButtonChildrenWithIcon = (
  children: ReactNode,
  icons: {
    icon?: React.ReactNode
    iconRight?: React.ReactNode
  }
) => {
  const { icon, iconRight } = icons
  const hasIcon = icon || iconRight
  const isRight = Boolean(iconRight)

  if (!hasIcon) return <div className="text">{children}</div>
  if (React.Children.count(children) === 0) {
    return <ButtonIcon>{hasIcon}</ButtonIcon>
  }
  return (
    <>
      {!isRight && <ButtonIcon>{hasIcon}</ButtonIcon>}
      <div className="text">{children}</div>
      {isRight && <ButtonIcon>{hasIcon}</ButtonIcon>}
    </>
  )
}

export const filterPropsWithGroup = <
  T extends React.PropsWithChildren<ButtonProps>
>(
  props: T,
  config: ButtonGroupConfig
): T => {
  if (!config.isButtonGroup) return props
  return {
    ...props,
    auto: true,
    shadow: false,
    ghost: config.ghost || props.ghost,
    type: config.type || props.type,
    disabled: config.disabled || props.disabled
  }
}
