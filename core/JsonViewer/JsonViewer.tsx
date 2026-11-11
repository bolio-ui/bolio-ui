import React, { useEffect, useMemo, useRef, useState } from 'react'
import useTheme from '../use-theme'
import useScale, { withScale } from '../use-scale'
import useClasses, { joinClasses } from '../use-classes'
import CopyButton from '../CopyButton'
import styles from './JsonViewer.module.css'

export type JsonPath = Array<string | number>

interface Props {
  value: unknown
  // how many levels start open, the root always does
  defaultExpandDepth?: number
  allExpanded?: boolean
  // names the tree, and is written before the root value
  rootName?: string
  sortKeys?: boolean
  // children shown before a "N more" row
  maxDisplayLength?: number
  withControls?: boolean
  withCopyButton?: boolean
  copyLabel?: string
  copiedLabel?: string
  expandAllLabel?: string
  collapseAllLabel?: string
  onValueSelect?: (path: JsonPath, value: unknown) => void
  className?: string
}

type NativeAttrs = Omit<React.HTMLAttributes<HTMLDivElement>, keyof Props>
export type JsonViewerProps = Props & NativeAttrs

type Kind = 'object' | 'array' | 'string' | 'number' | 'boolean' | 'null'

interface Row {
  id: string
  path: JsonPath
  label?: string | number
  value: unknown
  kind: Kind
  depth: number
  size: number
  open: boolean
  // the position among its siblings, for assistive technology
  position: number
  total: number
  parent?: string
  // a closing bracket or a "N more" row, neither one can be focused
  closing?: string
  more?: number
}

const kindOf = (value: unknown): Kind => {
  if (value === null) return 'null'
  if (Array.isArray(value)) return 'array'
  const type = typeof value
  if (type === 'object') return 'object'
  if (type === 'string' || type === 'number' || type === 'boolean') return type
  return 'string'
}

const idOf = (path: JsonPath) => JSON.stringify(path)

const entriesOf = (value: unknown, sortKeys: boolean) => {
  if (Array.isArray(value))
    return value.map((item, index) => [index, item] as const)
  const list = Object.entries(value as Record<string, unknown>)
  if (sortKeys) list.sort(([a], [b]) => a.localeCompare(b))
  return list
}

const display = (value: unknown, kind: Kind) =>
  kind === 'string'
    ? JSON.stringify(value)
    : kind === 'null'
      ? 'null'
      : String(value)

const JsonViewerComponent = React.forwardRef<HTMLDivElement, JsonViewerProps>(
  (
    {
      value,
      defaultExpandDepth = 1,
      allExpanded = false,
      rootName,
      sortKeys = false,
      maxDisplayLength = 100,
      withControls = false,
      withCopyButton = false,
      copyLabel = 'Copy JSON',
      copiedLabel = 'Copied',
      expandAllLabel = 'Expand all',
      collapseAllLabel = 'Collapse all',
      onValueSelect,
      className = '',
      style,
      'aria-label': ariaLabel,
      ...props
    },
    ref
  ) => {
    const theme = useTheme()
    const { SCALES } = useScale()

    // Every container path, to open or close them all at once
    const containers = useMemo(() => {
      const list: string[] = []
      const walk = (item: unknown, path: JsonPath) => {
        const kind = kindOf(item)
        if (kind !== 'object' && kind !== 'array') return
        list.push(idOf(path))
        entriesOf(item, false).forEach(([key, child]) =>
          walk(child, [...path, key])
        )
      }
      walk(value, [])
      return list
    }, [value])

    const [expanded, setExpanded] = useState<Set<string>>(() => {
      const open = new Set<string>()
      const walk = (item: unknown, path: JsonPath, depth: number) => {
        const kind = kindOf(item)
        if (kind !== 'object' && kind !== 'array') return
        if (depth < defaultExpandDepth) open.add(idOf(path))
        entriesOf(item, false).forEach(([key, child]) =>
          walk(child, [...path, key], depth + 1)
        )
      }
      walk(value, [], 0)
      // the root is always open
      open.add(idOf([]))
      return open
    })

    const rows = useMemo(() => {
      const list: Row[] = []
      const walk = (
        item: unknown,
        path: JsonPath,
        label: string | number | undefined,
        depth: number,
        position: number,
        total: number,
        parent: string | undefined
      ) => {
        const kind = kindOf(item)
        const id = idOf(path)
        const container = kind === 'object' || kind === 'array'
        const entries = container ? entriesOf(item, sortKeys) : []
        // an empty container has nothing to open
        const open =
          container && entries.length > 0 && (allExpanded || expanded.has(id))
        list.push({
          id,
          path,
          label,
          value: item,
          kind,
          depth,
          size: entries.length,
          open,
          position,
          total,
          parent
        })
        if (!open) return
        entries
          .slice(0, maxDisplayLength)
          .forEach(([key, child], index) =>
            walk(
              child,
              [...path, key],
              key,
              depth + 1,
              index + 1,
              entries.length,
              id
            )
          )
        if (entries.length > maxDisplayLength)
          list.push({
            id: `${id}#more`,
            path,
            value: undefined,
            kind,
            depth: depth + 1,
            size: 0,
            open: false,
            position: 0,
            total: 0,
            more: entries.length - maxDisplayLength
          })
        list.push({
          id: `${id}#end`,
          path,
          value: undefined,
          kind,
          depth,
          size: 0,
          open: false,
          position: 0,
          total: 0,
          closing: kind === 'array' ? ']' : '}'
        })
      }
      walk(value, [], rootName, 0, 1, 1, undefined)
      return list
    }, [value, expanded, allExpanded, sortKeys, maxDisplayLength, rootName])

    const focusable = rows.filter(
      (row) => !row.closing && row.more === undefined
    )
    const [focused, setFocused] = useState(idOf([]))
    const current = focusable.some((row) => row.id === focused)
      ? focused
      : focusable[0]?.id
    const refs = useRef(new Map<string, HTMLDivElement>())
    const moveFocus = useRef(false)

    useEffect(() => {
      if (!moveFocus.current) return
      moveFocus.current = false
      refs.current.get(current)?.focus()
    }, [current, rows])

    const toggle = (row: Row, open: boolean) => {
      setExpanded((last) => {
        const next = new Set(last)
        if (open) next.add(row.id)
        else next.delete(row.id)
        return next
      })
    }

    const goTo = (id: string | undefined) => {
      if (!id) return
      moveFocus.current = true
      setFocused(id)
    }

    const select = (row: Row) => {
      if (row.kind === 'object' || row.kind === 'array') {
        // the root cannot be closed
        if (row.id !== idOf([])) toggle(row, !row.open)
      } else if (onValueSelect) onValueSelect(row.path, row.value)
    }

    const keyDown = (event: React.KeyboardEvent, row: Row) => {
      const at = focusable.findIndex((item) => item.id === row.id)
      const container = row.kind === 'object' || row.kind === 'array'
      const handled = (fn: () => void) => {
        event.preventDefault()
        fn()
      }
      switch (event.key) {
        case 'ArrowDown':
          return handled(() => goTo(focusable[at + 1]?.id))
        case 'ArrowUp':
          return handled(() => goTo(focusable[at - 1]?.id))
        case 'Home':
          return handled(() => goTo(focusable[0]?.id))
        case 'End':
          return handled(() => goTo(focusable[focusable.length - 1]?.id))
        case 'ArrowRight':
          return handled(() => {
            if (!container || row.size === 0) return
            if (!row.open) toggle(row, true)
            else goTo(focusable[at + 1]?.id)
          })
        case 'ArrowLeft':
          return handled(() => {
            if (container && row.open && row.id !== idOf([])) toggle(row, false)
            else goTo(row.parent)
          })
        case 'Enter':
        case ' ':
          return handled(() => select(row))
      }
    }

    const palette = theme.palette
    const rootStyle = {
      '--json-font-size': SCALES.font(0.8125),
      '--json-text-color': palette.foreground,
      '--json-key-color': palette.accents_6,
      '--json-punctuation-color': palette.accents_5,
      '--json-string-color': palette.success,
      '--json-number-color': palette.info,
      '--json-boolean-color': palette.secondary,
      '--json-null-color': palette.accents_5,
      '--json-hover-bg': palette.accents_1,
      '--json-border-color': palette.border,
      '--json-focus-color': palette.primary,
      '--json-radius': theme.layout.radius,
      width: SCALES.width(1, '100%'),
      padding: `${SCALES.pt(0)} ${SCALES.pr(0)} ${SCALES.pb(0)} ${SCALES.pl(0)}`,
      margin: `${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)} ${SCALES.ml(0)}`,
      ...style
    } as React.CSSProperties

    const text = useMemo(() => {
      try {
        return JSON.stringify(value, null, 2) ?? ''
      } catch {
        return ''
      }
    }, [value])

    const renderRow = (row: Row) => {
      const indent = { paddingLeft: `${row.depth * 1.25}em` }
      if (row.closing)
        return (
          <div
            key={row.id}
            className={styles.row}
            style={indent}
            aria-hidden="true"
          >
            <span className={styles.punctuation}>{row.closing}</span>
          </div>
        )
      if (row.more !== undefined)
        return (
          <div key={row.id} className={styles.row} style={indent}>
            <span className={styles.punctuation}>…</span>
            {row.more} more {row.more === 1 ? 'item' : 'items'}
          </div>
        )
      const container = row.kind === 'object' || row.kind === 'array'
      const bracket = row.kind === 'array' ? ['[', ']'] : ['{', '}']
      return (
        <div
          key={row.id}
          ref={(element) => {
            if (element) refs.current.set(row.id, element)
            else refs.current.delete(row.id)
          }}
          role="treeitem"
          aria-level={row.depth + 1}
          aria-posinset={row.position}
          aria-setsize={row.total}
          aria-expanded={container && row.size > 0 ? row.open : undefined}
          tabIndex={row.id === current ? 0 : -1}
          className={joinClasses(styles.row, styles.item)}
          style={indent}
          onFocus={() => setFocused(row.id)}
          onClick={() => {
            setFocused(row.id)
            select(row)
          }}
          onKeyDown={(event) => keyDown(event, row)}
        >
          <span className={styles.chevron} aria-hidden="true">
            {container && row.size > 0 ? (row.open ? '▾' : '▸') : ''}
          </span>
          {row.label !== undefined && (
            <>
              <span className={styles.key}>
                {typeof row.label === 'number'
                  ? row.label
                  : JSON.stringify(row.label)}
              </span>
              <span className={styles.punctuation}>: </span>
            </>
          )}
          {container ? (
            row.open ? (
              <span className={styles.punctuation}>{bracket[0]}</span>
            ) : (
              <>
                <span className={styles.punctuation}>
                  {bracket[0]}
                  {row.size > 0 ? '…' : ''}
                  {bracket[1]}
                </span>
                <span className={styles.size}>
                  {row.size} {row.size === 1 ? 'item' : 'items'}
                </span>
              </>
            )
          ) : (
            <span className={styles[row.kind]}>
              {display(row.value, row.kind)}
            </span>
          )}
        </div>
      )
    }

    return (
      <div
        ref={ref}
        className={useClasses(styles.viewer, className)}
        style={rootStyle}
        {...props}
      >
        {(withControls || withCopyButton) && (
          <div className={styles.toolbar}>
            {withControls && (
              <>
                <button
                  type="button"
                  className={styles.tool}
                  onClick={() => setExpanded(new Set(containers))}
                >
                  {expandAllLabel}
                </button>
                <button
                  type="button"
                  className={styles.tool}
                  onClick={() => setExpanded(new Set([idOf([])]))}
                >
                  {collapseAllLabel}
                </button>
              </>
            )}
            {withCopyButton && (
              <CopyButton value={text}>
                {({ copied, copy }) => (
                  <button type="button" className={styles.tool} onClick={copy}>
                    {copied ? copiedLabel : copyLabel}
                  </button>
                )}
              </CopyButton>
            )}
          </div>
        )}
        <div
          role="tree"
          aria-label={ariaLabel || rootName || 'JSON'}
          className={styles.tree}
        >
          {rows.map(renderRow)}
        </div>
      </div>
    )
  }
)

JsonViewerComponent.displayName = 'BolioUIJsonViewer'
const JsonViewer = withScale(JsonViewerComponent)
export default JsonViewer
