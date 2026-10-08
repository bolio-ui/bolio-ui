import React from 'react'
import type { AnyObject } from '../utils/types'

export type TableDataItemBase = AnyObject

export type TableColumnRender<Item extends TableDataItemBase> = (
  value: Item[keyof Item],
  rowData: Item,
  rowIndex: number
) => React.JSX.Element | void

export type TableSortDirection = 'asc' | 'desc'
export type TableSort = { prop: string; direction: TableSortDirection }
export type TableKey = string | number

export type TableAbstractColumn<TableDataItem extends TableDataItemBase> = {
  prop: keyof TableDataItem
  label: React.ReactNode | string
  className: string
  width?: number
  sortable?: boolean
  sorter?: (a: TableDataItem, b: TableDataItem) => number
  renderHandler: TableColumnRender<TableDataItem>
}

export type TableOnRowClick<TableDataItem> = (
  rowData: TableDataItem,
  rowIndex: number
) => void
export type TableOnCellClick<TableDataItem> = (
  cellValue: TableDataItem[keyof TableDataItem],
  rowIndex: number,
  colunmIndex: number
) => void
export type TableOnChange<TableDataItem> = (data: Array<TableDataItem>) => void
export type TableRowClassNameHandler<TableDataItem> = (
  rowData: TableDataItem,
  rowIndex: number
) => string
