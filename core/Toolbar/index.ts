import Toolbar from './Toolbar'
import ToolbarSeparator from './ToolbarSeparator'

export type ToolbarComponentType = typeof Toolbar & {
  Separator: typeof ToolbarSeparator
}
;(Toolbar as ToolbarComponentType).Separator = ToolbarSeparator

export type { ToolbarProps } from './Toolbar'
export type { ToolbarSeparatorProps } from './ToolbarSeparator'
export default Toolbar as ToolbarComponentType
