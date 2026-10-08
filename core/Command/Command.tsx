import React, { useEffect, useMemo, useState } from 'react'
import useTheme from '../use-theme'
import Modal from '../Modal'
import Input from '../Input'
import useClasses from '../use-classes'
import styles from './Command.module.css'
import { getSurface } from '../utils/surface'

export interface CommandItem {
  value: string
  label: string
  icon?: React.ReactNode
  // shortcut or short note shown on the right
  hint?: React.ReactNode
  onSelect?: () => void
}

interface Props {
  visible?: boolean
  onClose?: () => void
  items: CommandItem[]
  placeholder?: string
  emptyText?: string
  className?: string
}

export type CommandProps = Props

const Command: React.FC<CommandProps> = ({
  visible,
  onClose,
  items,
  placeholder = 'Type a command or search',
  emptyText = 'No results. Try another word.',
  className = ''
}) => {
  const theme = useTheme()
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    return term
      ? items.filter((item) => item.label.toLowerCase().includes(term))
      : items
  }, [items, query])

  useEffect(() => {
    if (!visible) return
    setQuery('')
    setActive(0)
  }, [visible])

  const select = (item?: CommandItem) => {
    if (!item) return
    item.onSelect?.()
    onClose?.()
  }

  const keyDownHandler = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      const step = event.key === 'ArrowDown' ? 1 : -1
      const count = filtered.length
      if (count) setActive((last) => (last + step + count) % count)
    } else if (event.key === 'Enter') {
      event.preventDefault()
      select(filtered[active])
    }
  }

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      aria-label="Command"
      wrapClassName={useClasses(styles.command, className)}
    >
      <div onKeyDown={keyDownHandler}>
        <Input
          autoFocus
          width="100%"
          placeholder={placeholder}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setActive(0)
          }}
          role="combobox"
          aria-expanded
          aria-controls="bolioui-command-list"
          aria-label={placeholder}
        />
        <div id="bolioui-command-list" role="listbox" className={styles.list}>
          {filtered.length === 0 && (
            <div
              className={styles.empty}
              style={{ color: theme.palette.accents_5 }}
            >
              {emptyText}
            </div>
          )}
          {filtered.map((item, index) => (
            <div
              key={item.value}
              role="option"
              aria-selected={index === active}
              className={styles.item}
              style={{
                backgroundColor:
                  index === active ? getSurface(theme).hover : undefined
              }}
              onMouseEnter={() => setActive(index)}
              onClick={() => select(item)}
            >
              {item.icon && <span className={styles.icon}>{item.icon}</span>}
              <span className={styles.label}>{item.label}</span>
              {item.hint && (
                <span
                  className={styles.hint}
                  style={{ color: theme.palette.accents_5 }}
                >
                  {item.hint}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </Modal>
  )
}

Command.displayName = 'BolioUICommand'
export default Command
