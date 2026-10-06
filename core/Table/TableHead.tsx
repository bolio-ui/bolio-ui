import React, { useMemo } from 'react'
import useTheme from '../use-theme'
import TableSelectBox from './TableSelectBox'
import { TableAbstractColumn, TableDataItemBase, TableSort } from './TableTypes'
import type { AnyElement } from '../utils/types'
import { joinClasses } from '../use-classes'
import styles from './TableHead.module.css'

// the width of the column of checkboxes, in px
const SELECT_WIDTH = 40

interface Props<TableDataItem extends TableDataItemBase> {
  width: number
  columns: Array<TableAbstractColumn<TableDataItem>>
  sort?: TableSort | null
  onSort?: (prop: string) => void
  selection?: {
    checked: boolean
    indeterminate: boolean
    label: string
    onToggle: () => void
  }
  className?: string
}

type NativeAttrs = Omit<
  React.HTMLAttributes<AnyElement>,
  keyof Props<TableDataItemBase>
>
export type TableHeadProps<TableDataItem extends TableDataItemBase> =
  Props<TableDataItem> & NativeAttrs

const makeColgroup = <TableDataItem extends TableDataItemBase>(
  fullWidth: number,
  columns: Array<TableAbstractColumn<TableDataItem>>,
  leading: number
) => {
  const width = fullWidth - leading
  const unsetWidthCount = columns.filter((c) => !c.width).length
  const customWidthTotal = columns.reduce((pre, current) => {
    return current.width ? pre + current.width : pre
  }, 0)
  const averageWidth = (width - customWidthTotal) / unsetWidthCount
  if (averageWidth <= 0) return <colgroup />
  return (
    <colgroup>
      {leading > 0 && <col width={leading} />}
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
  const { columns, width, sort, onSort, selection } = props
  const isScalableWidth = useMemo(
    () => columns.find((item) => !!item.width),
    [columns]
  )
  const colgroup = useMemo(() => {
    if (!isScalableWidth) return <colgroup />
    return makeColgroup(width, columns, selection ? SELECT_WIDTH : 0)
  }, [isScalableWidth, width, columns, selection])

  const theadStyle = {
    '--table-head-text-color': theme.palette.accents_5,
    '--table-head-bg': theme.palette.accents_1,
    '--table-head-border-color': theme.palette.border,
    '--table-head-radius': theme.layout.radius,
    '--table-head-sorted-color': theme.palette.foreground,
    '--table-head-focus-color': theme.palette.primary
  } as React.CSSProperties

  return (
    <>
      {colgroup}
      <thead className={styles.thead} style={theadStyle}>
        <tr>
          {selection && (
            <th className={joinClasses(styles.th, styles.selectCell)}>
              <div className={styles.theadBox}>
                <TableSelectBox
                  checked={selection.checked}
                  indeterminate={selection.indeterminate}
                  label={selection.label}
                  onChange={selection.onToggle}
                />
              </div>
            </th>
          )}
          {columns.map((column, index) => {
            const prop = String(column.prop)
            const direction = sort && sort.prop === prop ? sort.direction : null
            return (
              <th
                key={`table-th-${prop}-${index}`}
                className={joinClasses(styles.th, column.className)}
                aria-sort={
                  column.sortable
                    ? direction === 'asc'
                      ? 'ascending'
                      : direction === 'desc'
                        ? 'descending'
                        : 'none'
                    : undefined
                }
              >
                <div className={styles.theadBox}>
                  {column.sortable ? (
                    <button
                      type="button"
                      className={styles.sortButton}
                      onClick={() => onSort && onSort(prop)}
                    >
                      {column.label}
                      <svg
                        viewBox="0 0 24 24"
                        width="1em"
                        height="1em"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={joinClasses(styles.sortIcon, {
                          [styles.sorted]: direction !== null
                        })}
                        aria-hidden="true"
                      >
                        <path
                          d={
                            direction === 'asc'
                              ? 'M12 19V5M5 12l7-7 7 7'
                              : direction === 'desc'
                                ? 'M12 5v14M19 12l-7 7-7-7'
                                : 'M8 9l4-4 4 4M8 15l4 4 4-4'
                          }
                        />
                      </svg>
                    </button>
                  ) : (
                    column.label
                  )}
                </div>
              </th>
            )
          })}
        </tr>
      </thead>
    </>
  )
}

TableHead.displayName = 'BolioUITableHead'
export default TableHead
