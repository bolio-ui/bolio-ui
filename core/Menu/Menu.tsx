import React, { useId, useRef, useState } from 'react'
import { withScale } from '../use-scale'
import useClasses from '../use-classes'
import useClickAway from '../utils/use-click-away'
import Dropdown from '../Shared/dropdown'
import { MenuContext } from './MenuContext'
import MenuList, { MenuFocus } from './MenuList'

type TriggerProps = {
  id?: string
  onClick?: (event: React.MouseEvent<HTMLElement>) => void
  onKeyDown?: (event: React.KeyboardEvent<HTMLElement>) => void
}

interface Props {
  // the element that opens the menu, usually a Button
  trigger: React.ReactElement<TriggerProps>
  visible?: boolean
  initialVisible?: boolean
  onVisibleChange?: (visible: boolean) => void
  getPopupContainer?: () => HTMLElement | null
  className?: string
}

type NativeAttrs = Omit<React.HTMLAttributes<HTMLDivElement>, keyof Props>
export type MenuProps = Props & NativeAttrs

const MenuComponent = React.forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<MenuProps>
>(
  (
    {
      trigger,
      visible: customVisible,
      initialVisible = false,
      onVisibleChange,
      getPopupContainer,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const baseId = useId()
    const menuId = `${baseId}-menu`
    const triggerId = trigger.props.id || `${baseId}-trigger`
    const wrapperRef = useRef<HTMLDivElement | null>(null)
    const focus = useRef<MenuFocus>('list')

    const isControlled = customVisible !== undefined
    const [selfVisible, setSelfVisible] = useState(initialVisible)
    const visible = isControlled ? customVisible : selfVisible

    const setVisible = (next: boolean) => {
      if (next === visible) return
      if (!isControlled) setSelfVisible(next)
      onVisibleChange?.(next)
    }

    const close = (returnFocus: boolean) => {
      setVisible(false)
      if (returnFocus) document.getElementById(triggerId)?.focus()
    }

    const setRefs = (element: HTMLDivElement | null) => {
      wrapperRef.current = element
      if (typeof ref === 'function') ref(element)
      else if (ref) ref.current = element
    }

    useClickAway(wrapperRef, () => visible && setVisible(false))

    const clickHandler = (event: React.MouseEvent<HTMLElement>) => {
      trigger.props.onClick?.(event)
      if (event.defaultPrevented) return
      // a click from Enter or Space has no pointer position (detail 0)
      focus.current = event.detail === 0 ? 'first' : 'list'
      setVisible(!visible)
    }

    const keyDownHandler = (event: React.KeyboardEvent<HTMLElement>) => {
      trigger.props.onKeyDown?.(event)
      if (event.defaultPrevented) return
      if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
      event.preventDefault()
      focus.current = event.key === 'ArrowDown' ? 'first' : 'last'
      setVisible(true)
    }

    return (
      <MenuContext.Provider value={{ close }}>
        <div ref={setRefs} className={useClasses('menu', className)} {...props}>
          {React.cloneElement(trigger, {
            id: triggerId,
            'aria-haspopup': 'menu',
            'aria-expanded': visible,
            'aria-controls': visible ? menuId : undefined,
            onClick: clickHandler,
            onKeyDown: keyDownHandler
          } as TriggerProps)}
          <Dropdown
            parent={wrapperRef}
            visible={visible}
            disableMatchWidth
            getPopupContainer={getPopupContainer}
          >
            <MenuList
              id={menuId}
              labelledBy={triggerId}
              focus={focus.current}
              onLeave={() => close(true)}
            >
              {children}
            </MenuList>
          </Dropdown>
          <style jsx>{`
            .menu {
              display: inline-block;
            }
          `}</style>
        </div>
      </MenuContext.Provider>
    )
  }
)

MenuComponent.displayName = 'BolioUIMenu'
const Menu = withScale(MenuComponent)
export default Menu
