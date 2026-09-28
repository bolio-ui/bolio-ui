import React from 'react'
import useTheme from '../use-theme'
import TableCell from './TableCell'
import { useTableContext } from './TableContext'
import {
  TableDataItemBase,
  TableOnCellClick,
  TableOnRowClick,
  TableRowClassNameHandler
} from './TableTypes'
import { joinClasses } from '../use-classes'
import type { AnyElement } from '../utils/types'
import styles from './TableBody.module.css'

interface Props<TableDataItem extends TableDataItemBase> {
  hover: boolean
  emptyText: string
  onRow?: TableOnRowClick<TableDataItem>
  onCell?: TableOnCellClick<TableDataItem>
  data: Array<TableDataItem>
  className?: string
  rowClassName: TableRowClassNameHandler<TableDataItem>
}

type NativeAttrs = Omit<
  React.HTMLAttributes<AnyElement>,
  keyof Props<TableDataItemBase>
>
export type TableBodyProps<TableDataItem extends TableDataItemBase> =
  Props<TableDataItem> & NativeAttrs

const TableBody = <TableDataItem extends TableDataItemBase>({
  data,
  hover,
  emptyText,
  onRow,
  onCell,
  rowClassName
}: TableBodyProps<TableDataItem>) => {
  const theme = useTheme()
  const { columns } = useTableContext<TableDataItem>()
  const rowClickHandler = (row: TableDataItem, index: number) => {
    if (onRow) onRow(row, index)
  }

  const trStyle = {
    '--table-body-hover-bg': theme.palette.accents_1,
    '--table-body-border-color': theme.palette.border,
    '--table-body-text-color': theme.palette.accents_6
  } as React.CSSProperties

  return (
    <tbody>
      {data.map((row, index) => {
        const className = rowClassName(row, index)
        return (
          <tr
            key={`tbody-row-${index}`}
            className={joinClasses(
              styles.tr,
              { [styles.hover]: hover },
              className
            )}
            onClick={() => rowClickHandler(row, index)}
            style={trStyle}
          >
            <TableCell<TableDataItem>
              columns={columns}
              row={row}
              rowIndex={index}
              emptyText={emptyText}
              onCellClick={onCell}
            />
          </tr>
        )
      })}
    </tbody>
  )
}

TableBody.displayName = 'BolioUITableBody'
export default TableBody
