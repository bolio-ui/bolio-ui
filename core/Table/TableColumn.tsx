import React, { useEffect } from 'react'
import { useTableContext } from './TableContext'
import useWarning from '../utils/use-warning'
import { TableColumnRender, TableDataItemBase } from './TableTypes'

// module level, so the effect below does not run again on every render
const defaultRender = () => {}

export type TableColumnProps<TableDataItem extends TableDataItemBase> = {
  prop: keyof TableDataItem
  label?: string
  width?: number
  className?: string
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
    render: renderHandler = defaultRender
  } = columnProps
  const { updateColumn } = useTableContext<TableDataItem>()
  const safeProp = String(prop).trim()
  if (!safeProp) {
    useWarning('The props "prop" is required.', 'Table.Column')
  }

  useEffect(() => {
    updateColumn({
      label: children || label,
      prop: safeProp,
      width,
      className,
      renderHandler
    })
  }, [children, label, prop, width, className, renderHandler])

  return null
}

TableColumn.displayName = 'BolioUITableColumn'
export default TableColumn
