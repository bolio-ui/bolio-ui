import Radio from './Radio'
import RadioGroup from './RadioGroup'
import RadioDescription from './RadioDescription'
import RadioCard from './RadioCard'

export type RadioComponentType = typeof Radio & {
  Group: typeof RadioGroup
  Description: typeof RadioDescription
  Desc: typeof RadioDescription
  Card: typeof RadioCard
}
;(Radio as RadioComponentType).Group = RadioGroup
;(Radio as RadioComponentType).Card = RadioCard
;(Radio as RadioComponentType).Description = RadioDescription
;(Radio as RadioComponentType).Desc = RadioDescription

export type {
  RadioProps,
  RadioEvent,
  RadioEventTarget,
  RadioTypes
} from './Radio'
export type { RadioCardProps } from './RadioCard'
export type { RadioGroupProps } from './RadioGroup'
export type { RadioDescriptionProps } from './RadioDescription'
export default Radio as RadioComponentType
