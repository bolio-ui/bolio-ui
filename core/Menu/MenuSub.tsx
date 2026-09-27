import React, { useContext, useId, useRef } from 'react'
import { MenuListContext } from './MenuContext'
import MenuList, { MenuFocus } from './MenuList'
import { MenuItemBase } from './MenuItem'

interface Props {
  label: React.ReactNode
  icon?: React.ReactNode
  disabled?: boolean
}

type NativeAttrs = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  keyof Props | 'role'
>
export type MenuSubProps = Props & NativeAttrs

const Chevron = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true">
    <path
      d="m9 18 6-6-6-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

// The ref and the native props go to the item that opens the submenu
const MenuSub = React.forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<MenuSubProps>
>(({ label, icon, disabled = false, children, ...props }, ref) => {
  const baseId = useId()
  const triggerId = `${baseId}-trigger`
  const listId = `${baseId}-menu`
  const { openSub, setOpenSub } = useContext(MenuListContext)
  const open = openSub === listId
  const focus = useRef<MenuFocus>('list')
  const triggerRef = useRef<HTMLDivElement | null>(null)

  const setRefs = (element: HTMLDivElement | null) => {
    triggerRef.current = element
    if (typeof ref === 'function') ref(element)
    else if (ref) ref.current = element
  }

  const openWith = (next: MenuFocus) => {
    focus.current = next
    setOpenSub(listId)
  }

  const leave = () => {
    setOpenSub(null)
    triggerRef.current?.focus()
  }

  return (
    <div className="menu-sub" role="none">
      <MenuItemBase
        ref={setRefs}
        id={triggerId}
        role="menuitem"
        icon={icon}
        disabled={disabled}
        disableAutoClose
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        // Enter, Space and ArrowRight click the item, with detail 0
        onClick={(event) => {
          const fromKeyboard = event.detail === 0
          if (!open) return openWith(fromKeyboard ? 'first' : 'list')
          // already open by the pointer: the keyboard moves into it
          if (fromKeyboard)
            document
              .getElementById(listId)
              ?.querySelector<HTMLElement>(
                '[role^="menuitem"]:not([aria-disabled="true"])'
              )
              ?.focus()
        }}
        onMouseEnter={() => !disabled && !open && openWith('list')}
        trailing={
          <span className="chevron">
            <Chevron />
          </span>
        }
        {...props}
      >
        {label}
      </MenuItemBase>
      {open && (
        <MenuList
          id={listId}
          labelledBy={triggerId}
          focus={focus.current}
          onLeave={leave}
          isSub
        >
          {children}
        </MenuList>
      )}
      <style jsx>{`
        .menu-sub {
          position: relative;
        }
        .chevron {
          display: inline-flex;
          margin-left: auto;
          padding-left: 1em;
        }
      `}</style>
    </div>
  )
})

MenuSub.displayName = 'BolioUIMenuSub'
export default MenuSub
