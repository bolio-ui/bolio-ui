import React, { CSSProperties, useImperativeHandle, useRef } from 'react'
import useTheme from '../use-theme'
import { useSelectContext } from './SelectContext'
import Dropdown from '../Shared/dropdown'
import type { InputColor } from '../Input/styles'
import useClasses from '../use-classes'
import type { AnyElement } from '../utils/types'
import styles from './SelectDropdown.module.css'

interface Props {
  visible: boolean
  colors: InputColor
  className?: string
  dropdownStyle?: CSSProperties
  disableMatchWidth?: boolean
  getPopupContainer?: () => HTMLElement | null
}

type NativeAttrs = Omit<React.HTMLAttributes<AnyElement>, keyof Props>
export type SelectDropdownProps = Props & NativeAttrs

const SelectDropdown = React.forwardRef<
  HTMLDivElement | null,
  React.PropsWithChildren<SelectDropdownProps>
>(
  (
    {
      visible,
      colors,
      children,
      className = '',
      dropdownStyle = {},
      disableMatchWidth,
      getPopupContainer
    }: React.PropsWithChildren<SelectDropdownProps>,
    dropdownRef
  ) => {
    const theme = useTheme()
    const internalDropdownRef = useRef<HTMLDivElement | null>(null)
    const { ref } = useSelectContext()
    const classes = useClasses(styles.selectDropdown, className)

    useImperativeHandle<HTMLDivElement | null, HTMLDivElement | null>(
      dropdownRef,
      () => internalDropdownRef.current
    )

    return (
      <Dropdown
        parent={ref}
        visible={visible}
        disableMatchWidth={disableMatchWidth}
        getPopupContainer={getPopupContainer}
      >
        <div
          ref={internalDropdownRef}
          className={classes}
          style={
            {
              '--select-dropdown-radius': theme.layout.radius,
              '--select-dropdown-shadow': theme.expressiveness.shadowMedium,
              '--select-dropdown-bg': colors.bgColor,
              '--select-dropdown-border': colors.borderColor,
              '--select-dropdown-color': colors.color,
              ...dropdownStyle
            } as React.CSSProperties
          }
        >
          {children}
        </div>
      </Dropdown>
    )
  }
)

SelectDropdown.displayName = 'BolioUISelectDropdown'
export default SelectDropdown
