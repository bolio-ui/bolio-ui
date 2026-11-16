import Checkbox from './Checkbox'
import CheckboxGroup from './CheckboxGroup'
import CheckboxCard from './CheckboxCard'

export type CheckboxComponentType = typeof Checkbox & {
  Group: typeof CheckboxGroup
  Card: typeof CheckboxCard
}
;(Checkbox as CheckboxComponentType).Group = CheckboxGroup
;(Checkbox as CheckboxComponentType).Card = CheckboxCard

export type {
  CheckboxProps,
  CheckboxEvent,
  CheckboxEventTarget,
  CheckboxTypes
} from './Checkbox'
export type { CheckboxCardProps } from './CheckboxCard'
export type { CheckboxGroupProps } from './CheckboxGroup'
export default Checkbox as CheckboxComponentType
