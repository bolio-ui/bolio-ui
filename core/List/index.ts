import List from './List'
import { ListItem } from './List'

export type ListComponentType = typeof List & {
  Item: typeof ListItem
}
;(List as ListComponentType).Item = ListItem

export type { ListProps, ListItemProps } from './List'

export default List as ListComponentType
