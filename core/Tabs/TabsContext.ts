import React, { CSSProperties, MouseEvent } from 'react'

export type TabsInternalCellProps = {
  onClick: (value: string) => void
  onMouseOver: (e: MouseEvent<HTMLDivElement>) => void
  activeClassName?: string
  activeStyle?: CSSProperties
  hideBorder?: boolean
}

export interface TabsHeaderItem {
  value: string
  // the Tabs.Item props that render its header, scale props included
  props: {
    value: string
    label: React.ReactNode
    disabled?: boolean
    [scaleProp: string]: unknown
  }
}

export interface TabsConfig {
  register?: (item: TabsHeaderItem) => void
  currentValue?: string
  inGroup: boolean
  leftSpace?: CSSProperties['marginLeft']
  // values of the items that are direct children of Tabs
  directValues?: string[]
}

const defaultContext = {
  inGroup: false
}

export const TabsContext = React.createContext<TabsConfig>(defaultContext)

export const useTabsContext = (): TabsConfig =>
  React.useContext<TabsConfig>(TabsContext)
