import React, { useContext } from 'react'
import useTheme from '../use-theme'
import useClasses from '../use-classes'
import { MenuContext, MenuListContext, MenuRadioContext } from './MenuContext'

type ItemType = 'default' | 'error'

interface BaseProps {
  icon?: React.ReactNode
  shortcut?: string
  disabled?: boolean
  type?: ItemType
  // keep the menu open after the item is chosen
  disableAutoClose?: boolean
}

type NativeAttrs = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  keyof BaseProps | 'role'
>

interface ItemBaseProps extends BaseProps {
  role: 'menuitem' | 'menuitemcheckbox' | 'menuitemradio'
  checked?: boolean
  // shows a check or a dot before the label
  indicator?: 'check' | 'dot'
  onChoose?: () => void
  trailing?: React.ReactNode
}

const Check = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true">
    <path
      d="M20 6 9 17l-5-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const Dot = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true">
    <circle cx="12" cy="12" r="4" fill="currentColor" />
  </svg>
)

// Shared by every kind of item and by the submenu trigger
export const MenuItemBase = React.forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<ItemBaseProps & NativeAttrs>
>(
  (
    {
      role,
      icon,
      shortcut,
      disabled = false,
      type = 'default',
      disableAutoClose = false,
      checked,
      indicator,
      onChoose,
      trailing,
      onClick,
      onMouseMove,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const theme = useTheme()
    const { close } = useContext(MenuContext)
    const { setOpenSub } = useContext(MenuListContext)
    const classes = useClasses('menu-item', type, className)

    const clickHandler = (event: React.MouseEvent<HTMLDivElement>) => {
      if (disabled) return
      onClick?.(event)
      if (event.defaultPrevented) return
      onChoose?.()
      if (!disableAutoClose) close(true)
    }

    // the pointer moves the focus, so keyboard and mouse share one highlight
    const mouseMoveHandler = (event: React.MouseEvent<HTMLDivElement>) => {
      onMouseMove?.(event)
      if (disabled || event.defaultPrevented) return
      if (!props['aria-haspopup']) setOpenSub(null)
      if (document.activeElement !== event.currentTarget)
        event.currentTarget.focus()
    }

    return (
      <div
        ref={ref}
        role={role}
        tabIndex={-1}
        aria-checked={role === 'menuitem' ? undefined : Boolean(checked)}
        aria-disabled={disabled || undefined}
        className={classes}
        onClick={clickHandler}
        onMouseMove={mouseMoveHandler}
        {...props}
      >
        {indicator && (
          <span className="indicator">
            {checked && (indicator === 'check' ? <Check /> : <Dot />)}
          </span>
        )}
        {icon && <span className="icon">{icon}</span>}
        <span className="label">{children}</span>
        {/* visual only: `aria-keyshortcuts` is how to announce it */}
        {shortcut && (
          <span className="shortcut" aria-hidden="true">
            {shortcut}
          </span>
        )}
        {trailing}
        <style jsx>{`
          .menu-item {
            display: flex;
            align-items: center;
            gap: 0.5em;
            box-sizing: border-box;
            min-height: 2.25em;
            padding: 0.375em 0.75em;
            border-radius: 4px;
            line-height: 1.25em;
            color: ${theme.palette.foreground};
            cursor: pointer;
            user-select: none;
            outline: none;
          }
          .menu-item:focus,
          .menu-item[aria-expanded='true'] {
            background-color: ${theme.palette.accents_2};
          }
          .menu-item.error {
            color: ${theme.palette.error};
          }
          .menu-item.error:focus {
            background-color: ${theme.palette.errorLight};
            color: ${theme.palette.errorDark};
          }
          .menu-item[aria-disabled='true'] {
            color: ${theme.palette.accents_4};
            cursor: not-allowed;
          }
          .indicator,
          .icon {
            display: inline-flex;
            flex-shrink: 0;
            align-items: center;
            justify-content: center;
            width: 1em;
          }
          .label {
            flex: 1;
            white-space: nowrap;
          }
          .shortcut {
            padding-left: 1.5em;
            font-size: 0.875em;
            color: ${theme.palette.accents_5};
          }
        `}</style>
      </div>
    )
  }
)
MenuItemBase.displayName = 'BolioUIMenuItemBase'

interface ItemProps extends BaseProps {
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void
}
export type MenuItemProps = ItemProps & NativeAttrs

export const MenuItem = React.forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<MenuItemProps>
>((props, ref) => <MenuItemBase ref={ref} role="menuitem" {...props} />)
MenuItem.displayName = 'BolioUIMenuItem'

interface CheckboxItemProps extends BaseProps {
  checked?: boolean
  onChange?: (checked: boolean) => void
}
export type MenuCheckboxItemProps = CheckboxItemProps &
  Omit<NativeAttrs, 'onChange'>

export const MenuCheckboxItem = React.forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<MenuCheckboxItemProps>
>(({ checked = false, onChange, disableAutoClose = true, ...props }, ref) => (
  <MenuItemBase
    ref={ref}
    role="menuitemcheckbox"
    indicator="check"
    checked={checked}
    disableAutoClose={disableAutoClose}
    onChoose={() => onChange?.(!checked)}
    {...props}
  />
))
MenuCheckboxItem.displayName = 'BolioUIMenuCheckboxItem'

interface RadioItemProps extends BaseProps {
  value: string
}
export type MenuRadioItemProps = RadioItemProps & NativeAttrs

export const MenuRadioItem = React.forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<MenuRadioItemProps>
>(({ value, disableAutoClose = true, ...props }, ref) => {
  const group = useContext(MenuRadioContext)
  return (
    <MenuItemBase
      ref={ref}
      role="menuitemradio"
      indicator="dot"
      checked={group.value === value}
      disableAutoClose={disableAutoClose}
      onChoose={() => group.onChange?.(value)}
      {...props}
    />
  )
})
MenuRadioItem.displayName = 'BolioUIMenuRadioItem'

interface RadioGroupProps {
  value?: string
  onChange?: (value: string) => void
}
export type MenuRadioGroupProps = RadioGroupProps &
  Omit<React.HTMLAttributes<HTMLDivElement>, keyof RadioGroupProps>

export const MenuRadioGroup = React.forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<MenuRadioGroupProps>
>(({ value, onChange, children, ...props }, ref) => (
  <MenuRadioContext.Provider value={{ value, onChange }}>
    <div ref={ref} role="group" {...props}>
      {children}
    </div>
  </MenuRadioContext.Provider>
))
MenuRadioGroup.displayName = 'BolioUIMenuRadioGroup'

export type MenuLabelProps = React.HTMLAttributes<HTMLDivElement>

export const MenuLabel = React.forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<MenuLabelProps>
>(({ className = '', children, ...props }, ref) => {
  const theme = useTheme()
  return (
    <div
      ref={ref}
      role="presentation"
      className={`menu-label ${className}`}
      {...props}
    >
      {children}
      <style jsx>{`
        .menu-label {
          padding: 0.375em 0.75em;
          font-size: 0.8125em;
          font-weight: 500;
          color: ${theme.palette.accents_5};
          user-select: none;
        }
      `}</style>
    </div>
  )
})
MenuLabel.displayName = 'BolioUIMenuLabel'

export type MenuDividerProps = React.HTMLAttributes<HTMLDivElement>

export const MenuDivider = React.forwardRef<HTMLDivElement, MenuDividerProps>(
  ({ className = '', ...props }, ref) => {
    const theme = useTheme()
    return (
      <div
        ref={ref}
        role="separator"
        className={`menu-divider ${className}`}
        {...props}
      >
        <style jsx>{`
          .menu-divider {
            height: 1px;
            margin: 0.25em -0.25em;
            background-color: ${theme.palette.border};
          }
        `}</style>
      </div>
    )
  }
)
MenuDivider.displayName = 'BolioUIMenuDivider'
