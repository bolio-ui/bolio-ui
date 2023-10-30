import Collapse from './Collapse'
import CollapseGroup from './CollapseGroup'

export type CollapseComponentType = typeof Collapse & {
  Group: typeof CollapseGroup
}
;(Collapse as CollapseComponentType).Group = CollapseGroup

export type { CollapseProps } from './Collapse'
export type { CollapseGroupProps } from './CollapseGroup'
export default Collapse as CollapseComponentType
