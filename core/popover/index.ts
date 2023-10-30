import Popover from './Popover'
import PopoverItem from './PopoverItem'

export type PopoverComponentType = typeof Popover & {
  Item: typeof PopoverItem
  Option: typeof PopoverItem
}
;(Popover as PopoverComponentType).Item = PopoverItem
;(Popover as PopoverComponentType).Option = PopoverItem

export type {
  PopoverProps,
  PopoverTriggerTypes,
  PopoverPlacement
} from './Popover'
export type { PopoverItemProps } from './PopoverItem'
export default Popover as PopoverComponentType
