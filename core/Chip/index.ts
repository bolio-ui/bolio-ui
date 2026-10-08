import Chip from './Chip'
import ChipGroup from './ChipGroup'

export type ChipComponentType = typeof Chip & {
  Group: typeof ChipGroup
}
;(Chip as ChipComponentType).Group = ChipGroup

export type { ChipProps } from './Chip'
export type { ChipGroupProps } from './ChipGroup'
export default Chip as ChipComponentType
