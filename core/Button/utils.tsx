import React, { ReactNode } from 'react'
import ButtonIcon from './ButtonIcon'
import { ButtonProps } from './Button'
import { ButtonGroupConfig } from '../ButtonGroup/ButtonGroupContext'

export const getButtonChildrenWithIcon = (
  auto = false,
  children: ReactNode,
  icons: {
    icon?: React.ReactNode
    iconRight?: React.ReactNode
  }
) => {
  const { icon, iconRight } = icons
  const hasIcon = icon || iconRight
  const isRight = Boolean(iconRight)
  const paddingForAutoMode = auto
    ? `calc(var(--bolio-ui-button-height) / 2 + var(--bolio-ui-button-icon-padding) * .5)`
    : 0

  if (!hasIcon) return <div className="text">{children}</div>
  if (React.Children.count(children) === 0) {
    return (
      <ButtonIcon isRight={isRight} isSingle>
        {hasIcon}
      </ButtonIcon>
    )
  }
  return (
    <>
      <ButtonIcon isRight={isRight}>{hasIcon}</ButtonIcon>
      <div
        className="text"
        style={
          isRight
            ? { paddingRight: paddingForAutoMode }
            : { paddingLeft: paddingForAutoMode }
        }
      >
        {children}
      </div>
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
