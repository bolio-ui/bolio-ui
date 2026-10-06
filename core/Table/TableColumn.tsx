import React, { useEffect } from 'react'
import { useTableContext } from './TableContext'
import logWarning from '../utils/log-warning'
import { TableColumnRender, TableDataItemBase } from './TableTypes'

// module level, so the effect below does not run again on every render
const defaultRender = () => {}

export type TableColumnProps<TableDataItem extends TableDataItemBase> = {
  prop: keyof TableDataItem
  label?: string
  width?: number
  className?: string
  // the header becomes a button that sorts the rows by this column
  sortable?: boolean
  // how two rows compare, when the default order of the values does not fit
  sorter?: (a: TableDataItem, b: TableDataItem) => number
  render?: TableColumnRender<TableDataItem>
}

const TableColumn = <TableDataItem extends TableDataItemBase>(
  columnProps: React.PropsWithChildren<TableColumnProps<TableDataItem>>
) => {
  const {
    children,
    prop,
    label,
    width,
    className = '',
    sortable = false,
    sorter,
    render: renderHandler = defaultRender
  } = columnProps
  const { updateColumn } = useTableContext<TableDataItem>()
  const safeProp = String(prop).trim()
  if (!safeProp) {
    logWarning('The props "prop" is required.', 'Table.Column')
  }

  useEffect(() => {
    updateColumn({
      label: children || label,
      prop: safeProp,
      width,
      className,
      sortable,
      sorter,
      renderHandler
    })
  }, [
    children,
    label,
    safeProp,
    width,
    className,
    sortable,
    sorter,
    renderHandler,
    updateColumn
  ])

  return null
}

TableColumn.displayName = 'BolioUITableColumn'
export default TableColumn
