import React, { useId } from 'react'
import { useTreeContext } from './TreeContext'
import type { TreeNodeData } from './TreeContext'
import { joinClasses } from '../use-classes'
import styles from './Tree.module.css'

interface Props {
  node: TreeNodeData
  level: number
}

function TreeNode({ node, level }: Props) {
  const { selected, expanded, tabbable, activate, register } = useTreeContext()
  // the name of the item is its own label, not the text of its children
  const labelId = useId()
  const hasChildren = Boolean(node.children && node.children.length)
  const isExpanded = hasChildren && expanded.includes(node.value)

  return (
    <li
      ref={(element) => register(node.value, element)}
      role="treeitem"
      data-value={node.value}
      aria-labelledby={labelId}
      aria-level={level}
      aria-expanded={hasChildren ? isExpanded : undefined}
      aria-selected={selected === node.value}
      aria-disabled={node.disabled || undefined}
      tabIndex={tabbable === node.value ? 0 : -1}
      className={styles.item}
    >
      <div
        className={joinClasses(styles.row, {
          [styles.selected]: selected === node.value,
          [styles.disabled]: Boolean(node.disabled)
        })}
        style={{ '--tree-level': level - 1 } as React.CSSProperties}
        onClick={() => activate(node)}
      >
        <span className={styles.chevron} aria-hidden="true">
          {hasChildren && (
            <svg
              viewBox="0 0 24 24"
              width="1em"
              height="1em"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={joinClasses(styles.chevronIcon, {
                [styles.open]: isExpanded
              })}
            >
              <path d="M9 6l6 6-6 6" />
            </svg>
          )}
        </span>
        {node.icon && (
          <span className={styles.icon} aria-hidden="true">
            {node.icon}
          </span>
        )}
        <span id={labelId} className={styles.label}>
          {node.label}
        </span>
      </div>
      {isExpanded && (
        <ul role="group" className={styles.group}>
          {node.children?.map((child) => (
            <TreeNode key={child.value} node={child} level={level + 1} />
          ))}
        </ul>
      )}
    </li>
  )
}

export default TreeNode
