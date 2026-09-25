import React, { useContext, useEffect, useRef, useState } from 'react'
import useTheme from '../use-theme'
import useScale from '../use-scale'
import { MenuContext, MenuListContext } from './MenuContext'

export type MenuFocus = 'first' | 'last' | 'list'

interface Props {
  id: string
  labelledBy?: string
  // where the focus goes when the list opens
  focus: MenuFocus
  // Escape, and ArrowLeft in a submenu; the root closes the whole menu
  onLeave: () => void
  isSub?: boolean
  className?: string
}

const TYPEAHEAD_RESET = 500

const MenuList: React.FC<React.PropsWithChildren<Props>> = ({
  id,
  labelledBy,
  focus,
  onLeave,
  isSub = false,
  className = '',
  children
}) => {
  const theme = useTheme()
  const { SCALES } = useScale()
  const { close } = useContext(MenuContext)
  const listRef = useRef<HTMLDivElement>(null)
  const [openSub, setOpenSub] = useState<string | null>(null)
  const typed = useRef({ text: '', at: 0 })

  // items of this level only: submenus are nested lists with their own items
  const getItems = () =>
    Array.from(
      listRef.current?.querySelectorAll<HTMLElement>('[role^="menuitem"]') ?? []
    ).filter(
      (item) =>
        item.closest('[role="menu"]') === listRef.current &&
        item.getAttribute('aria-disabled') !== 'true'
    )

  useEffect(() => {
    if (focus === 'list') return listRef.current?.focus()
    const items = getItems()
    const target = focus === 'first' ? items[0] : items[items.length - 1]
    ;(target ?? listRef.current)?.focus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const typeahead = (key: string, items: HTMLElement[], index: number) => {
    const now = Date.now()
    const text =
      now - typed.current.at > TYPEAHEAD_RESET
        ? key.toLowerCase()
        : typed.current.text + key.toLowerCase()
    typed.current = { text, at: now }
    // repeating one letter walks through the items that start with it
    const search = [...text].every((char) => char === text[0]) ? text[0] : text
    const start = search === text && text.length > 1 ? index : index + 1
    const ordered = [...items.slice(start), ...items.slice(0, start)]
    const match = ordered.find((item) =>
      item.textContent?.trim().toLowerCase().startsWith(search)
    )
    match?.focus()
  }

  const keyDownHandler = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement
    // keys from a nested submenu are handled by that submenu
    if (target.closest('[role="menu"]') !== listRef.current) return
    const items = getItems()
    const index = items.indexOf(target)
    const focusAt = (next: number) => {
      event.preventDefault()
      items[(next + items.length) % items.length]?.focus()
    }

    switch (event.key) {
      case 'ArrowDown':
        return focusAt(index + 1)
      case 'ArrowUp':
        return focusAt(index < 0 ? items.length - 1 : index - 1)
      case 'Home':
        return focusAt(0)
      case 'End':
        return focusAt(items.length - 1)
      case 'Enter':
      case ' ':
        event.preventDefault()
        if (index >= 0) items[index].click()
        return
      case 'ArrowRight':
        if (index >= 0 && items[index].hasAttribute('aria-haspopup')) {
          event.preventDefault()
          items[index].click()
        }
        return
      case 'ArrowLeft':
        if (!isSub) return
        event.preventDefault()
        return onLeave()
      case 'Escape':
        event.preventDefault()
        event.stopPropagation()
        return onLeave()
      case 'Tab':
        event.preventDefault()
        return close(true)
    }

    const isCharacter =
      event.key.length === 1 &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.altKey
    if (isCharacter) typeahead(event.key, items, index)
  }

  return (
    <MenuListContext.Provider value={{ openSub, setOpenSub }}>
      <div
        ref={listRef}
        id={id}
        role="menu"
        tabIndex={-1}
        aria-labelledby={labelledBy}
        aria-orientation="vertical"
        className={`menu-list ${isSub ? 'sub' : ''} ${className}`}
        onKeyDown={keyDownHandler}
      >
        {children}
        <style jsx>{`
          .menu-list {
            box-sizing: border-box;
            min-width: 12em;
            padding: 0.25em;
            font-size: ${SCALES.font(0.875)};
            color: ${theme.palette.foreground};
            background-color: ${theme.palette.background};
            border: 1px solid ${theme.palette.border};
            border-radius: ${theme.layout.radius};
            box-shadow: ${theme.expressiveness.shadowMedium};
            outline: none;
          }
          .sub {
            position: absolute;
            top: calc(-0.25em - 1px);
            left: calc(100% + 0.25em);
            z-index: 1;
            font-size: 1em;
          }
        `}</style>
      </div>
    </MenuListContext.Provider>
  )
}

export default MenuList
