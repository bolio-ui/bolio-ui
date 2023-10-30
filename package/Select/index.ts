import Select from './Select'
import SelectOption from './SelectOption'

export type SelectComponentType = typeof Select & {
  Option: typeof SelectOption
}
;(Select as SelectComponentType).Option = SelectOption

export type { SelectProps, SelectTypes, SelectRef } from './Select'
export type { SelectOptionProps } from './SelectOption'
export default Select as SelectComponentType
