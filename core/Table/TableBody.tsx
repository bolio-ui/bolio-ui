import React from 'react'
import useTheme from '../use-theme'
import TableCell from './TableCell'
import { useTableContext } from './TableContext'
import TableSelectBox from './TableSelectBox'
import {
  TableDataItemBase,
  TableKey,
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
  // what identifies each row, in the order of `data`
  keys: Array<TableKey>
  selection?: {
    keys: Array<TableKey>
    label: string
    onToggle: (key: TableKey) => void
  }
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
  keys,
  selection,
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
    '--table-body-text-color': theme.palette.accents_6,
    '--table-body-selected-bg': `color-mix(in srgb, ${theme.palette.primary} 10%, transparent)`
  } as React.CSSProperties

  return (
    <tbody>
      {data.map((row, index) => {
        const className = rowClassName(row, index)
        const selected = Boolean(selection?.keys.includes(keys[index]))
        return (
          <tr
            key={`tbody-row-${index}`}
            className={joinClasses(
              styles.tr,
              { [styles.hover]: hover, [styles.selected]: selected },
              className
            )}
            onClick={() => rowClickHandler(row, index)}
            style={trStyle}
          >
            {selection && (
              <td className={styles.selectCell}>
                <div className="cell">
                  <TableSelectBox
                    checked={selected}
                    label={selection.label}
                    onChange={() => selection.onToggle(keys[index])}
                  />
                </div>
              </td>
            )}
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
