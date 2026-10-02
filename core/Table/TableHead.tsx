import React, { useMemo } from 'react'
import useTheme from '../use-theme'
import { TableAbstractColumn, TableDataItemBase } from './TableTypes'
import type { AnyElement } from '../utils/types'
import { joinClasses } from '../use-classes'
import styles from './TableHead.module.css'

interface Props<TableDataItem extends TableDataItemBase> {
  width: number
  columns: Array<TableAbstractColumn<TableDataItem>>
  className?: string
}

type NativeAttrs = Omit<
  React.HTMLAttributes<AnyElement>,
  keyof Props<TableDataItemBase>
>
export type TableHeadProps<TableDataItem extends TableDataItemBase> =
  Props<TableDataItem> & NativeAttrs

const makeColgroup = <TableDataItem extends TableDataItemBase>(
  width: number,
  columns: Array<TableAbstractColumn<TableDataItem>>
) => {
  const unsetWidthCount = columns.filter((c) => !c.width).length
  const customWidthTotal = columns.reduce((pre, current) => {
    return current.width ? pre + current.width : pre
  }, 0)
  const averageWidth = (width - customWidthTotal) / unsetWidthCount
  if (averageWidth <= 0) return <colgroup />
  return (
    <colgroup>
      {columns.map((column, index) => (
        <col key={`colgroup-${index}`} width={column.width || averageWidth} />
      ))}
    </colgroup>
  )
}

const TableHead = <TableDataItem extends TableDataItemBase>(
  props: TableHeadProps<TableDataItem>
) => {
  const theme = useTheme()
  const { columns, width } = props
  const isScalableWidth = useMemo(
    () => columns.find((item) => !!item.width),
    [columns]
  )
  const colgroup = useMemo(() => {
    if (!isScalableWidth) return <colgroup />
    return makeColgroup(width, columns)
  }, [isScalableWidth, width, columns])

  const theadStyle = {
    '--table-head-text-color': theme.palette.accents_5,
    '--table-head-bg': theme.palette.accents_1,
    '--table-head-border-color': theme.palette.border,
    '--table-head-radius': theme.layout.radius
  } as React.CSSProperties

  return (
    <>
      {colgroup}
      <thead className={styles.thead} style={theadStyle}>
        <tr>
          {columns.map((column, index) => (
            <th
              key={`table-th-${String(column.prop)}-${index}`}
              className={joinClasses(styles.th, column.className)}
            >
              <div className={styles.theadBox}>{column.label}</div>
            </th>
          ))}
        </tr>
      </thead>
    </>
  )
}

TableHead.displayName = 'BolioUITableHead'
export default TableHead
