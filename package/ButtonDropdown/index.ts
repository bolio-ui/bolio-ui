import ButtonDropdown from './ButtonDropdown'
import ButtonDropdownItem from './ButtonDropdownItem'

type ButtonDropdownType = typeof ButtonDropdown & {
  Item: typeof ButtonDropdownItem
}
;(ButtonDropdown as ButtonDropdownType).Item = ButtonDropdownItem

export type { ButtonDropdownProps, ButtonDropdownTypes } from './ButtonDropdown'
export type {
  ButtonDropdownItemProps,
  ButtonDropdownItemTypes
} from './ButtonDropdownItem'
export default ButtonDropdown as ButtonDropdownType
