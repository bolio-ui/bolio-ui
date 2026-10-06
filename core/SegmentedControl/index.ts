import SegmentedControl from './SegmentedControl'
import SegmentedControlItem from './SegmentedControlItem'

export type SegmentedControlComponentType = typeof SegmentedControl & {
  Item: typeof SegmentedControlItem
}
;(SegmentedControl as SegmentedControlComponentType).Item = SegmentedControlItem

export type { SegmentedControlProps } from './SegmentedControl'
export type { SegmentedControlItemProps } from './SegmentedControlItem'
export type { SegmentedControlValue } from './SegmentedControlContext'
export default SegmentedControl as SegmentedControlComponentType
