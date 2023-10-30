import Tabs from './Tabs'
import TabsItem from './TabsItem'

export type TabsComponentType = typeof Tabs & {
  Item: typeof TabsItem
  Tab: typeof TabsItem
}
;(Tabs as TabsComponentType).Item = TabsItem
;(Tabs as TabsComponentType).Tab = TabsItem

export type { TabsProps } from './Tabs'
export default Tabs as TabsComponentType
