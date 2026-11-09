import React, { useEffect, useMemo, useRef, useState } from 'react'
import useTheme from '../use-theme'
import useScale, { withScale } from '../use-scale'
import useClasses, { joinClasses } from '../use-classes'
import styles from './EmojiPicker.module.css'

export interface EmojiItem {
  emoji: string
  name: string
  keywords?: string[]
}

export interface EmojiCategory {
  id: string
  label: string
  // shown in the category bar, the first emoji when missing
  icon?: string
  emojis: EmojiItem[]
}

interface Props {
  data: EmojiCategory[]
  onEmojiSelect?: (emoji: EmojiItem, category: EmojiCategory) => void
  columns?: number
  emojiSize?: number
  height?: number
  withSearch?: boolean
  searchLabel?: string
  searchPlaceholder?: string
  withCategoryNav?: boolean
  categoriesLabel?: string
  withPreview?: boolean
  emptyContent?: React.ReactNode
  autoFocus?: boolean
  className?: string
}

type NativeAttrs = Omit<React.HTMLAttributes<HTMLDivElement>, keyof Props>
export type EmojiPickerProps = Props & NativeAttrs

const keyOf = (category: string, index: number) => `${category}:${index}`

const EmojiPickerComponent = React.forwardRef<HTMLDivElement, EmojiPickerProps>(
  (
    {
      data,
      onEmojiSelect,
      columns = 8,
      emojiSize = 24,
      height = 300,
      withSearch = true,
      searchLabel = 'Search emoji',
      searchPlaceholder = 'Search emoji',
      withCategoryNav = true,
      categoriesLabel = 'Categories',
      withPreview = true,
      emptyContent = 'No emoji found',
      autoFocus = false,
      className = '',
      style,
      ...props
    },
    ref
  ) => {
    const theme = useTheme()
    const { SCALES } = useScale()
    const [query, setQuery] = useState('')
    const [focused, setFocused] = useState<string | undefined>()
    const [preview, setPreview] = useState<EmojiItem | undefined>()
    // asks the effect below to move the DOM focus, even to the same emoji
    const [focusTick, setFocusTick] = useState(0)
    const buttons = useRef(new Map<string, HTMLButtonElement>())
    const scroller = useRef<HTMLDivElement>(null)
    const search = useRef<HTMLInputElement>(null)
    const moveFocus = useRef(false)

    const categories = useMemo(() => {
      const text = query.trim().toLowerCase()
      return data
        .map((category) => ({
          ...category,
          emojis: text
            ? category.emojis.filter(
                (item) =>
                  item.name.toLowerCase().includes(text) ||
                  (item.keywords || []).some((word) =>
                    word.toLowerCase().includes(text)
                  )
              )
            : category.emojis
        }))
        .filter((category) => category.emojis.length > 0)
    }, [data, query])

    // the one emoji that is in the tab order
    const first = categories[0] ? keyOf(categories[0].id, 0) : undefined
    const exists = (key?: string) =>
      Boolean(
        key &&
        categories.some((category) =>
          category.emojis.some((_, index) => keyOf(category.id, index) === key)
        )
      )
    const current = exists(focused) ? focused : first

    useEffect(() => {
      if (autoFocus && search.current) search.current.focus()
    }, [autoFocus])

    useEffect(() => {
      if (!moveFocus.current || !current) return
      moveFocus.current = false
      buttons.current.get(current)?.focus()
    }, [current, focusTick])

    const go = (key: string | undefined) => {
      if (!key) return
      moveFocus.current = true
      setFocused(key)
      setFocusTick((tick) => tick + 1)
    }

    // arrows walk the grid of the category, and cross into the next or
    // previous category on the same column
    const target = (categoryAt: number, index: number, key: string) => {
      const category = categories[categoryAt]
      const length = category.emojis.length
      const column = index % columns
      if (key === 'ArrowLeft') {
        if (index > 0) return keyOf(category.id, index - 1)
        const before = categories[categoryAt - 1]
        return before && keyOf(before.id, before.emojis.length - 1)
      }
      if (key === 'ArrowRight') {
        if (index < length - 1) return keyOf(category.id, index + 1)
        const after = categories[categoryAt + 1]
        return after && keyOf(after.id, 0)
      }
      if (key === 'ArrowDown') {
        if (index + columns < length) return keyOf(category.id, index + columns)
        const after = categories[categoryAt + 1]
        return (
          after && keyOf(after.id, Math.min(column, after.emojis.length - 1))
        )
      }
      if (key === 'ArrowUp') {
        if (index - columns >= 0) return keyOf(category.id, index - columns)
        const before = categories[categoryAt - 1]
        if (!before) return undefined
        const lastRow =
          Math.floor((before.emojis.length - 1) / columns) * columns
        return keyOf(
          before.id,
          Math.min(lastRow + column, before.emojis.length - 1)
        )
      }
      if (key === 'Home') return first
      if (key === 'End') {
        const last = categories[categories.length - 1]
        return keyOf(last.id, last.emojis.length - 1)
      }
      return undefined
    }

    const select = (item: EmojiItem, category: EmojiCategory) => {
      if (onEmojiSelect) onEmojiSelect(item, category)
    }

    const gotoCategory = (id: string) => {
      const section = scroller.current?.querySelector<HTMLElement>(
        `[data-category="${id}"]`
      )
      if (section && scroller.current)
        scroller.current.scrollTop =
          section.offsetTop - scroller.current.offsetTop
    }

    const palette = theme.palette
    const rootStyle = {
      '--emoji-columns': columns,
      '--emoji-size': `${emojiSize}px`,
      '--emoji-height': `${height}px`,
      '--emoji-text-color': palette.foreground,
      '--emoji-muted-color': palette.accents_5,
      '--emoji-border-color': palette.border,
      '--emoji-bg': palette.background,
      '--emoji-hover-bg': palette.accents_2,
      '--emoji-focus-color': palette.primary,
      '--emoji-radius': theme.layout.radius,
      margin: `${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)} ${SCALES.ml(0)}`,
      padding: `${SCALES.pt(0)} ${SCALES.pr(0)} ${SCALES.pb(0)} ${SCALES.pl(0)}`,
      ...style
    } as React.CSSProperties

    return (
      <div
        ref={ref}
        className={useClasses(styles.picker, className)}
        style={rootStyle}
        {...props}
      >
        {withSearch && (
          <input
            ref={search}
            type="search"
            className={styles.search}
            aria-label={searchLabel}
            placeholder={searchPlaceholder}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'ArrowDown') {
                event.preventDefault()
                go(first)
              }
              if (event.key === 'Enter' && categories[0]) {
                event.preventDefault()
                select(categories[0].emojis[0], categories[0])
              }
            }}
          />
        )}
        {withCategoryNav && categories.length > 0 && (
          <div
            role="toolbar"
            aria-label={categoriesLabel}
            className={styles.nav}
          >
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                className={styles.category}
                aria-label={category.label}
                title={category.label}
                onClick={() => gotoCategory(category.id)}
              >
                {category.icon || category.emojis[0].emoji}
              </button>
            ))}
          </div>
        )}
        <div ref={scroller} className={styles.scroller}>
          {categories.length === 0 && (
            <div className={styles.empty} role="status">
              {emptyContent}
            </div>
          )}
          {categories.map((category, categoryAt) => (
            <section
              key={category.id}
              data-category={category.id}
              aria-label={category.label}
            >
              <h3 className={styles.title}>{category.label}</h3>
              <div className={styles.grid}>
                {category.emojis.map((item, index) => {
                  const key = keyOf(category.id, index)
                  return (
                    <button
                      key={key}
                      ref={(element) => {
                        if (element) buttons.current.set(key, element)
                        else buttons.current.delete(key)
                      }}
                      type="button"
                      className={joinClasses(styles.emoji)}
                      aria-label={item.name}
                      tabIndex={key === current ? 0 : -1}
                      onClick={() => select(item, category)}
                      onMouseEnter={() => setPreview(item)}
                      onFocus={() => {
                        setFocused(key)
                        setPreview(item)
                      }}
                      onKeyDown={(event) => {
                        const next = target(categoryAt, index, event.key)
                        if (
                          [
                            'ArrowLeft',
                            'ArrowRight',
                            'ArrowUp',
                            'ArrowDown',
                            'Home',
                            'End'
                          ].includes(event.key)
                        ) {
                          event.preventDefault()
                          go(next)
                        }
                      }}
                    >
                      {item.emoji}
                    </button>
                  )
                })}
              </div>
            </section>
          ))}
        </div>
        {withPreview && (
          <div className={styles.preview} aria-hidden="true">
            {preview ? (
              <>
                <span className={styles.big}>{preview.emoji}</span>
                {preview.name}
              </>
            ) : (
              ' '
            )}
          </div>
        )}
      </div>
    )
  }
)

EmojiPickerComponent.displayName = 'BolioUIEmojiPicker'
const EmojiPicker = withScale(EmojiPickerComponent)
export default EmojiPicker
