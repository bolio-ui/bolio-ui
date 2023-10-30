import Breadcrumbs from './Breadcrumbs'
import BreadcrumbsItem from './BreadcrumbsItem'
import BreadcrumbsSeparator from './BreadcrumbsSeparator'

export type BreadcrumbsComponentType = typeof Breadcrumbs & {
  Item: typeof BreadcrumbsItem
  Separator: typeof BreadcrumbsSeparator
}
;(Breadcrumbs as BreadcrumbsComponentType).Item = BreadcrumbsItem
;(Breadcrumbs as BreadcrumbsComponentType).Separator = BreadcrumbsSeparator

export type { BreadcrumbsProps } from './Breadcrumbs'
export type { BreadcrumbsItemProps } from './BreadcrumbsItem'
export type { BreadcrumbsSeparatorProps } from './BreadcrumbsSeparator'
export default Breadcrumbs as BreadcrumbsComponentType
