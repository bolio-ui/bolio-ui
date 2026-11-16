import { useEffect } from 'react'
import useLatest from '../utils/use-latest'

export type HotkeyItem = [string, (event: KeyboardEvent) => void]

export type UseHotkeysOptions = {
  /** Tags where typing must not trigger a hotkey. */
  ignoreTags?: string[]
  /** Call preventDefault on the matched event. */
  preventDefault?: boolean
}

const ALIASES: Record<string, string> = {
  esc: 'escape',
  space: ' ',
  up: 'arrowup',
  down: 'arrowdown',
  left: 'arrowleft',
  right: 'arrowright',
  plus: '+'
}

const isMac = () => /mac|iphone|ipad|ipod/i.test(navigator.platform)

const matches = (hotkey: string, event: KeyboardEvent) => {
  const parts = hotkey
    .toLowerCase()
    .split('+')
    .map((part) => part.trim())
  const key = ALIASES[parts[parts.length - 1]] || parts[parts.length - 1]
  const mods = parts.slice(0, -1)
  const wants = (name: string) => mods.includes(name)
  const mod = wants('mod')
  const meta = wants('meta') || (mod && isMac())
  const ctrl = wants('ctrl') || (mod && !isMac())
  return (
    event.key.toLowerCase() === key &&
    event.metaKey === meta &&
    event.ctrlKey === ctrl &&
    event.altKey === wants('alt') &&
    event.shiftKey === wants('shift')
  )
}

const isTyping = (target: EventTarget | null, ignoreTags: string[]) => {
  const element = target as HTMLElement | null
  if (!element || !element.tagName) return false
  return (
    element.isContentEditable ||
    ignoreTags.includes(element.tagName.toUpperCase())
  )
}

const DEFAULT_IGNORE = ['INPUT', 'TEXTAREA', 'SELECT']

const useHotkeys = (
  hotkeys: HotkeyItem[],
  { ignoreTags = DEFAULT_IGNORE, preventDefault = true }: UseHotkeysOptions = {}
) => {
  const latest = useLatest(hotkeys)

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (isTyping(event.target, ignoreTags)) return
      const item = latest.current.find(([hotkey]) => matches(hotkey, event))
      if (!item) return
      if (preventDefault) event.preventDefault()
      item[1](event)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ignoreTags.join(), preventDefault])
}

export default useHotkeys
