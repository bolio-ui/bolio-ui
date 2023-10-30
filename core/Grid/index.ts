import Grid from './Grid'
import GridContainer from './GridContainer'

export type GridComponentType = typeof Grid & {
  Container: typeof GridContainer
}
;(Grid as GridComponentType).Container = GridContainer

export type { GridContainerProps } from './GridContainer'
export type { GridProps } from './Grid'
export type { GridBreakpointsValue } from './BasicItem'
export type {
  GridAlignContent,
  GridAlignItems,
  GridDirection,
  GridJustify,
  GridWrap
} from './GridTypes'
export default Grid as GridComponentType
