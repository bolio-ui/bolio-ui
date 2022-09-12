import { ReactElement, CSSProperties } from 'react'
import * as Icons from '@bolio-ui/icons'

export type ActionId = string
type Icon = keyof typeof Icons

export interface Action {
  id: string
  name: string
  shortcut: string[]
  keywords: string
  perform?: () => void
  section?: string
  parent?: ActionId | null | undefined
  children?: ActionId[]
  icon?: string | Icon
  subtitle?: string
}

export interface ResultHandlers {
  onClick: () => void
  onMouseEnter: () => void
  onPointerDown: () => void
}
export interface ResultState {
  index: number
  activeIndex: number
}

export interface KBarResultsProps {
  style?: CSSProperties
  className?: string
  onRender?: (
    action: Action,
    handlers: ResultHandlers,
    state: ResultState
  ) => ReactElement
}
