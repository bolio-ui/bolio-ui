import Radio from './Radio'
import RadioGroup from './RadioGroup'
import RadioDescription from './RadioDescription'

export type RadioComponentType = typeof Radio & {
  Group: typeof RadioGroup
  Description: typeof RadioDescription
  Desc: typeof RadioDescription
}
;(Radio as RadioComponentType).Group = RadioGroup
;(Radio as RadioComponentType).Description = RadioDescription
;(Radio as RadioComponentType).Desc = RadioDescription

export type {
  RadioProps,
  RadioEvent,
  RadioEventTarget,
  RadioTypes
} from './Radio'
export type { RadioGroupProps } from './RadioGroup'
export type { RadioDescriptionProps } from './RadioDescription'
export default Radio as RadioComponentType
