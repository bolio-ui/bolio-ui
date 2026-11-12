import React, { useEffect, useRef, useState } from 'react'
import useTheme from '../use-theme'
import { getColors } from '../Input/styles'
import type { NormalTypes } from '../utils/prop-types'
import useScale, { withScale } from '../use-scale'
import useClasses from '../use-classes'
import useClickAway from '../utils/use-click-away'
import useUncontrolled from '../use-uncontrolled'
import { getSurface } from '../utils/surface'
import Tree from '../Tree'
import type { TreeNodeData } from '../Tree'
import styles from './TreeSelect.module.css'

interface Props {
  data: TreeNodeData[]
  // value of the chosen leaf
  value?: string | null
  initialValue?: string | null
  onChange?: (value: string, node: TreeNodeData) => void
  placeholder?: string
  treeLabel?: string
  disabled?: boolean
  type?: NormalTypes
  rounded?: boolean
  filled?: boolean
  light?: boolean
  ghost?: boolean
  subtle?: boolean
  className?: string
}

type NativeAttrs = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  keyof Props | 'value' | 'defaultValue' | 'onChange' | 'type'
>
export type TreeSelectProps = Props & NativeAttrs

const find = (
  nodes: TreeNodeData[],
  value: string | null
): TreeNodeData | undefined => {
  for (const node of nodes) {
    if (node.value === value) return node
    const inside = node.children && find(node.children, value)
    if (inside) return inside
  }
}

// The values of the nodes that lead to a value, so the tree opens on it. It is
// null when the value is not in the tree.
const pathTo = (
  nodes: TreeNodeData[],
  value: string | null
): string[] | null => {
  for (const node of nodes) {
    if (node.value === value) return []
    const inside = node.children && pathTo(node.children, value)
    if (inside) return [node.value, ...inside]
  }
  return null
}

const TreeSelectComponent = React.forwardRef<
  HTMLButtonElement,
  TreeSelectProps
>(
  (
    {
      data,
      value: customValue,
      initialValue = null,
      onChange,
      placeholder = 'Select',
      treeLabel = 'Options',
      disabled = false,
      type = 'default',
      rounded = false,
      filled = false,
      light = false,
      ghost = false,
      subtle = false,
      className = '',
      style,
      ...props
    },
    ref
  ) => {
    const theme = useTheme()
    const surface = getSurface(theme)
    const { SCALES } = useScale()
    const colors = getColors(theme.palette, type, disabled, {
      filled,
      light,
      ghost,
      subtle
    })
    const [value, setValue] = useUncontrolled<string | null>({
      value: customValue,
      defaultValue: initialValue
    })
    const [open, setOpen] = useState(false)
    const rootRef = useRef<HTMLDivElement>(null)
    const buttonRef = useRef<HTMLButtonElement>(null)
    const popupRef = useRef<HTMLDivElement>(null)
    React.useImperativeHandle(ref, () => buttonRef.current as HTMLButtonElement)
    useClickAway(rootRef, () => setOpen(false))

    const chosen = value ? find(data, value) : undefined

    // The tree takes the focus when it opens.
    useEffect(() => {
      if (!open) return
      popupRef.current
        ?.querySelector<HTMLElement>('[role="treeitem"][tabindex="0"]')
        ?.focus()
    }, [open])

    const pick = (next: string, node: TreeNodeData) => {
      // a node with children only opens or closes
      if (node.children && node.children.length) return
      setValue(next)
      onChange?.(next, node)
      setOpen(false)
      buttonRef.current?.focus()
    }

    const keyDownHandler = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key !== 'Escape') return
      event.stopPropagation()
      setOpen(false)
      buttonRef.current?.focus()
    }

    const fieldStyle = {
      '--tree-select-font-size': SCALES.font(0.875),
      '--tree-select-height': SCALES.height(2.25),
      '--tree-select-width': SCALES.width(1, '17.5em'),
      '--tree-select-padding-top': SCALES.pt(0),
      '--tree-select-padding-right': SCALES.pr(0),
      '--tree-select-padding-bottom': SCALES.pb(0),
      '--tree-select-padding-left': SCALES.pl(0),
      '--tree-select-margin-top': SCALES.mt(0),
      '--tree-select-margin-right': SCALES.mr(0),
      '--tree-select-margin-bottom': SCALES.mb(0),
      '--tree-select-margin-left': SCALES.ml(0),
      '--tree-select-radius': rounded ? '25px' : theme.layout.radius,
      '--tree-select-popup-radius': theme.layout.radius,
      '--tree-select-color': colors.color,
      '--tree-select-bg': colors.bgColor,
      '--tree-select-border': colors.borderColor,
      '--tree-select-hover-bg': colors.hoverBgColor,
      '--tree-select-hover-border': colors.hoverBorder,
      '--tree-select-focus-border': colors.focusBorder,
      '--tree-select-placeholder': colors.placeholderColor,
      '--tree-select-popup-bg': surface.bg,
      '--tree-select-popup-border': theme.palette.border,
      '--tree-select-shadow': surface.shadow,
      ...style
    } as React.CSSProperties

    return (
      <div
        ref={rootRef}
        className={useClasses(styles.root, className)}
        style={fieldStyle}
      >
        <button
          {...props}
          ref={buttonRef}
          type="button"
          aria-haspopup="tree"
          aria-expanded={open}
          disabled={disabled}
          className={styles.field}
          onClick={() => setOpen(!open)}
        >
          <span className={chosen ? styles.value : styles.placeholder}>
            {chosen ? chosen.label : placeholder}
          </span>
          <svg
            viewBox="0 0 24 24"
            width="1.25em"
            height="1.25em"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className={styles.chevron}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
        {open && (
          <div
            ref={popupRef}
            className={styles.popup}
            onKeyDown={keyDownHandler}
          >
            <Tree
              aria-label={treeLabel}
              data={data}
              value={value}
              initialExpanded={(value && pathTo(data, value)) || []}
              onChange={pick}
            />
          </div>
        )}
      </div>
    )
  }
)

TreeSelectComponent.displayName = 'BolioUITreeSelect'
const TreeSelect = withScale(TreeSelectComponent)
export default TreeSelect
