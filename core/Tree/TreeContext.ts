import React from 'react'

export interface TreeNodeData {
  value: string
  label: React.ReactNode
  icon?: React.ReactNode
  disabled?: boolean
  children?: Array<TreeNodeData>
}

export interface TreeConfig {
  selected: string | null
  expanded: Array<string>
  tabbable: string | undefined
  activate: (node: TreeNodeData) => void
  register: (value: string, element: HTMLLIElement | null) => void
}

export const TreeContext = React.createContext<TreeConfig>({
  selected: null,
  expanded: [],
  tabbable: undefined,
  activate: () => undefined,
  register: () => undefined
})

export const useTreeContext = (): TreeConfig =>
  React.useContext<TreeConfig>(TreeContext)
