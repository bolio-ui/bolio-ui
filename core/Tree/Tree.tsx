import React, { useCallback, useMemo, useRef, useState } from 'react'
import useTheme from '../use-theme'
import useScale, { withScale } from '../use-scale'
import useClasses from '../use-classes'
import { TreeContext } from './TreeContext'
import type { TreeNodeData } from './TreeContext'
import TreeNode from './TreeNode'
import styles from './Tree.module.css'

export type { TreeNodeData } from './TreeContext'

interface Props {
  data: Array<TreeNodeData>
  // selected node, to control it
  value?: string | null
  initialValue?: string | null
  onChange?: (value: string, node: TreeNodeData) => void
  // open nodes, to control them
  expanded?: Array<string>
  initialExpanded?: Array<string>
  onExpandedChange?: (expanded: Array<string>) => void
  className?: string
}

type NativeAttrs = Omit<
  React.HTMLAttributes<HTMLUListElement>,
  keyof Props | 'defaultValue'
>
export type TreeProps = Props & NativeAttrs

const noExpanded: Array<string> = []

interface Visible {
  node: TreeNodeData
  parent: TreeNodeData | null
}

const TreeComponent = React.forwardRef<HTMLUListElement, TreeProps>(
  (
    {
      data,
      value: customValue,
      initialValue = null,
      onChange,
      expanded: customExpanded,
      initialExpanded = noExpanded,
      onExpandedChange,
      className = '',
      style,
      onKeyDown,
      onFocus,
      ...props
    },
    ref
  ) => {
    const theme = useTheme()
    const { SCALES } = useScale()

    const [selfValue, setSelfValue] = useState<string | null>(initialValue)
    const selected = customValue !== undefined ? customValue : selfValue
    const [selfExpanded, setSelfExpanded] =
      useState<Array<string>>(initialExpanded)
    const expanded =
      customExpanded !== undefined ? customExpanded : selfExpanded
    const [focused, setFocused] = useState<string>()
    const items = useRef(new Map<string, HTMLLIElement>())

    // the nodes in view, top to bottom
    const visible = useMemo(() => {
      const list: Array<Visible> = []
      const walk = (nodes: Array<TreeNodeData>, parent: TreeNodeData | null) =>
        nodes.forEach((node) => {
          list.push({ node, parent })
          if (node.children && expanded.includes(node.value))
            walk(node.children, node)
        })
      walk(data, null)
      return list
    }, [data, expanded])
    const enabled = visible.filter(({ node }) => !node.disabled)

    // roving tabindex: the focused node, else the selected one, else the first
    const tabbable = (
      [focused, selected]
        .map((value) => enabled.find(({ node }) => node.value === value))
        .find(Boolean) || enabled[0]
    )?.node.value

    const setExpanded = (next: Array<string>) => {
      if (customExpanded === undefined) setSelfExpanded(next)
      if (onExpandedChange) onExpandedChange(next)
    }

    const toggle = (node: TreeNodeData) =>
      setExpanded(
        expanded.includes(node.value)
          ? expanded.filter((value) => value !== node.value)
          : [...expanded, node.value]
      )

    const select = (node: TreeNodeData) => {
      if (node.value === selected) return
      setSelfValue(node.value)
      if (onChange) onChange(node.value, node)
    }

    const activate = (node: TreeNodeData) => {
      if (node.disabled) return
      select(node)
      if (node.children && node.children.length) toggle(node)
    }

    const register = useCallback(
      (value: string, element: HTMLLIElement | null) => {
        if (element) items.current.set(value, element)
        else items.current.delete(value)
      },
      []
    )

    const focusNode = (target?: Visible) => {
      if (target) items.current.get(target.node.value)?.focus()
    }

    const keyDownHandler = (event: React.KeyboardEvent<HTMLUListElement>) => {
      if (onKeyDown) onKeyDown(event)
      if (event.defaultPrevented) return
      const element = (event.target as HTMLElement).closest(
        '[role="treeitem"]'
      ) as HTMLElement | null
      const current = enabled.find(
        ({ node }) => node.value === element?.dataset.value
      )
      if (!current) return
      const index = enabled.indexOf(current)
      const { node, parent } = current
      const hasChildren = Boolean(node.children && node.children.length)
      const isOpen = hasChildren && expanded.includes(node.value)

      const actions: Record<string, () => void> = {
        ArrowDown: () => focusNode(enabled[index + 1]),
        ArrowUp: () => focusNode(enabled[index - 1]),
        Home: () => focusNode(enabled[0]),
        End: () => focusNode(enabled[enabled.length - 1]),
        ArrowRight: () => {
          if (!hasChildren) return
          if (!isOpen) return toggle(node)
          focusNode(enabled.find((item) => item.parent === node))
        },
        ArrowLeft: () => {
          if (isOpen) return toggle(node)
          focusNode(enabled.find((item) => item.node === parent))
        },
        Enter: () => activate(node),
        ' ': () => activate(node)
      }
      const action = actions[event.key]
      if (!action) return
      event.preventDefault()
      action()
    }

    const focusHandler = (event: React.FocusEvent<HTMLUListElement>) => {
      if (onFocus) onFocus(event)
      const value = (event.target as HTMLElement).closest<HTMLElement>(
        '[role="treeitem"]'
      )?.dataset.value
      if (value !== undefined) setFocused(value)
    }

    const config = { selected, expanded, tabbable, activate, register }

    const treeStyle = {
      margin: `${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)} ${SCALES.ml(0)}`,
      width: SCALES.width(1, 'auto'),
      fontSize: SCALES.font(0.875),
      '--tree-color': theme.palette.accents_6,
      '--tree-hover-bg': theme.palette.accents_1,
      '--tree-selected-color': theme.palette.foreground,
      '--tree-selected-bg': theme.palette.accents_2,
      '--tree-icon-color': theme.palette.accents_5,
      '--tree-disabled-color': theme.palette.accents_4,
      '--tree-focus': theme.palette.primary,
      '--tree-radius': theme.layout.radius,
      ...style
    } as React.CSSProperties

    return (
      <TreeContext.Provider value={config}>
        <ul
          ref={ref}
          role="tree"
          className={useClasses(styles.tree, className)}
          {...props}
          style={treeStyle}
          onKeyDown={keyDownHandler}
          onFocus={focusHandler}
        >
          {data.map((node) => (
            <TreeNode key={node.value} node={node} level={1} />
          ))}
        </ul>
      </TreeContext.Provider>
    )
  }
)

TreeComponent.displayName = 'BolioUITree'
const Tree = withScale(TreeComponent)
export default Tree
