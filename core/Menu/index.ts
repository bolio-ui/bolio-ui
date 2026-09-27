import Menu from './Menu'
import MenuSub from './MenuSub'
import {
  MenuItem,
  MenuCheckboxItem,
  MenuRadioItem,
  MenuRadioGroup,
  MenuLabel,
  MenuDivider
} from './MenuItem'

export type MenuComponentType = typeof Menu & {
  Item: typeof MenuItem
  CheckboxItem: typeof MenuCheckboxItem
  RadioGroup: typeof MenuRadioGroup
  RadioItem: typeof MenuRadioItem
  Label: typeof MenuLabel
  Divider: typeof MenuDivider
  Sub: typeof MenuSub
}
;(Menu as MenuComponentType).Item = MenuItem
;(Menu as MenuComponentType).CheckboxItem = MenuCheckboxItem
;(Menu as MenuComponentType).RadioGroup = MenuRadioGroup
;(Menu as MenuComponentType).RadioItem = MenuRadioItem
;(Menu as MenuComponentType).Label = MenuLabel
;(Menu as MenuComponentType).Divider = MenuDivider
;(Menu as MenuComponentType).Sub = MenuSub

export type { MenuProps } from './Menu'
export type { MenuSubProps } from './MenuSub'
export type {
  MenuItemProps,
  MenuCheckboxItemProps,
  MenuRadioItemProps,
  MenuRadioGroupProps,
  MenuLabelProps,
  MenuDividerProps
} from './MenuItem'
export default Menu as MenuComponentType
