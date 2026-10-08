import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from 'react'
import TableHead from './TableHead'
import TableBody from './TableBody'
import useRealShape from '../utils/use-real-shape'
import useResize from '../utils/use-resize'
import { TableContext, TableConfig } from './TableContext'
import {
  TableAbstractColumn,
  TableDataItemBase,
  TableKey,
  TableSort,
  TableOnCellClick,
  TableOnChange,
  TableOnRowClick,
  TableRowClassNameHandler
} from './TableTypes'
import useTheme from '../use-theme'
import useScale, { ScaleProps, withScale } from '../use-scale'
import TableColumn from './TableColumn'
import Pagination from '../Pagination'
import type { AnyElement } from '../utils/types'
import useClasses from '../use-classes'
import styles from './Table.module.css'

export type TablePagination = {
  pageSize: number
  page?: number
  onPageChange?: (page: number) => void
  // rows on the server: `data` is already the current page
  total?: number
}

interface Props<TableDataItem extends TableDataItemBase> {
  data?: Array<TableDataItem>
  initialData?: Array<TableDataItem>
  emptyText?: string
  hover?: boolean
  onRow?: TableOnRowClick<TableDataItem>
  onCell?: TableOnCellClick<TableDataItem>
  onChange?: TableOnChange<TableDataItem>
  pagination?: TablePagination
  className?: string
  rowClassName?: TableRowClassNameHandler<TableDataItem>
  // the column the rows are sorted by, to control it
  sort?: TableSort | null
  initialSort?: TableSort | null
  onSortChange?: (sort: TableSort | null) => void
  // a checkbox on each row, and one in the header for the rows in view
  selectable?: boolean
  // what identifies a row: a prop of the rows, or a function. The position of
  // the row in `data` when missing
  rowKey?: keyof TableDataItem | ((row: TableDataItem) => TableKey)
  selectedKeys?: Array<TableKey>
  initialSelectedKeys?: Array<TableKey>
  onSelectionChange?: (
    keys: Array<TableKey>,
    rows: Array<TableDataItem>
  ) => void
  selectRowLabel?: string
  selectAllLabel?: string
}

const noKeys: Array<TableKey> = []

// numbers by value, anything else as text where "item 2" comes before "item 10"
const compareValues = (a: unknown, b: unknown) =>
  typeof a === 'number' && typeof b === 'number'
    ? a - b
    : String(a ?? '').localeCompare(String(b ?? ''), undefined, {
        numeric: true,
        sensitivity: 'base'
      })

const defaultProps = {
  hover: true,
  initialData: [],
  emptyText: '',
  className: '',
  rowClassName: () => ''
}

type NativeAttrs = Omit<
  React.TableHTMLAttributes<AnyElement>,
  keyof Props<TableDataItemBase>
>
export type TableProps<TableDataItem extends TableDataItemBase> =
  Props<TableDataItem> & NativeAttrs

function TableComponent<TableDataItem extends TableDataItemBase>(
  tableProps: React.PropsWithChildren<TableProps<TableDataItem>> & {
    ref?: React.Ref<HTMLTableElement>
  },
  forwardedRef: React.ForwardedRef<HTMLTableElement>
) {
  /* eslint-disable  @typescript-eslint/no-unused-vars */
  const {
    children,
    data: customData,
    initialData = defaultProps.initialData,
    hover = defaultProps.hover,
    emptyText = defaultProps.emptyText,
    onRow,
    onCell,
    onChange,
    pagination,
    className = defaultProps.className,
    rowClassName = defaultProps.rowClassName,
    sort: customSort,
    initialSort = null,
    onSortChange,
    selectable = false,
    rowKey,
    selectedKeys: customKeys,
    initialSelectedKeys = noKeys,
    onSelectionChange,
    selectRowLabel = 'Select row',
    selectAllLabel = 'Select all rows',
    style,
    ...props
  } = tableProps
  /* eslint-enable @typescript-eslint/no-unused-vars */

  const theme = useTheme()
  const { SCALES } = useScale()
  const tableRef = useRef<HTMLTableElement>(null)
  useImperativeHandle(forwardedRef, () => tableRef.current as HTMLTableElement)
  const [{ width }, updateShape] = useRealShape<HTMLTableElement>(tableRef)
  const [columns, setColumns] = useState<
    Array<TableAbstractColumn<TableDataItem>>
  >([])
  const [data, setData] = useState<Array<TableDataItem>>(initialData)
  const updateColumn = useCallback(
    (column: TableAbstractColumn<TableDataItem>) => {
      setColumns((last) => {
        const hasColumn = last.find((item) => item.prop === column.prop)
        if (!hasColumn) return [...last, column]
        return last.map((item) => {
          if (item.prop !== column.prop) return item
          return column
        })
      })
    },
    []
  )

  const contextValue = useMemo<TableConfig<TableDataItem>>(
    () => ({
      columns,
      updateColumn
    }),
    [columns, updateColumn]
  )

  useEffect(() => {
    if (typeof customData === 'undefined') return
    setData(customData)
  }, [customData])
  useResize(() => updateShape())

  const [selfSort, setSelfSort] = useState<TableSort | null>(initialSort)
  const sort = customSort !== undefined ? customSort : selfSort
  const [selfKeys, setSelfKeys] = useState<Array<TableKey>>(initialSelectedKeys)
  const selectedKeys = customKeys !== undefined ? customKeys : selfKeys

  const keyOf = (row: TableDataItem, index: number): TableKey =>
    typeof rowKey === 'function'
      ? rowKey(row)
      : rowKey !== undefined
        ? (row[rowKey] as TableKey)
        : index

  // With the rows on the server the order is the server's, so it is only
  // reported, never applied here.
  const sortedEntries = useMemo(() => {
    const entries = data.map((row, index) => ({ row, key: keyOf(row, index) }))
    const column = sort && columns.find((item) => item.prop === sort.prop)
    if (!sort || !column || pagination?.total !== undefined) return entries
    const direction = sort.direction === 'desc' ? -1 : 1
    const compare =
      column.sorter ||
      ((a: TableDataItem, b: TableDataItem) =>
        compareValues(a[column.prop], b[column.prop]))
    return [...entries].sort((a, b) => direction * compare(a.row, b.row))
    // keyOf only reads rowKey
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, sort, columns, pagination?.total, rowKey])

  const [selfPage, setSelfPage] = useState(1)
  const pageSize = pagination ? Math.max(1, pagination.pageSize) : 0
  const totalRows = pagination?.total ?? data.length
  const pageCount = pagination ? Math.ceil(totalRows / pageSize) : 0
  const page = Math.min(pagination?.page ?? selfPage, Math.max(pageCount, 1))
  const pageEntries =
    pagination && pagination.total === undefined
      ? sortedEntries.slice((page - 1) * pageSize, page * pageSize)
      : sortedEntries
  const rows = pageEntries.map((entry) => entry.row)
  const pageKeys = pageEntries.map((entry) => entry.key)

  const sortHandler = (prop: string) => {
    const next: TableSort | null =
      !sort || sort.prop !== prop
        ? { prop, direction: 'asc' }
        : sort.direction === 'asc'
          ? { prop, direction: 'desc' }
          : null
    setSelfSort(next)
    if (onSortChange) onSortChange(next)
  }

  const selectKeys = (next: Array<TableKey>) => {
    setSelfKeys(next)
    if (onSelectionChange)
      onSelectionChange(
        next,
        sortedEntries
          .filter((entry) => next.includes(entry.key))
          .map((entry) => entry.row)
      )
  }
  const toggleKey = (key: TableKey) =>
    selectKeys(
      selectedKeys.includes(key)
        ? selectedKeys.filter((item) => item !== key)
        : [...selectedKeys, key]
    )
  // the header checkbox: every row in view, or none of them
  const inView = pageKeys.filter((key) => selectedKeys.includes(key)).length
  const toggleAll = () =>
    selectKeys(
      inView === pageKeys.length
        ? selectedKeys.filter((key) => !pageKeys.includes(key))
        : [
            ...selectedKeys,
            ...pageKeys.filter((key) => !selectedKeys.includes(key))
          ]
    )

  const pageChangeHandler = (next: number) => {
    if (next === page) return
    setSelfPage(next)
    if (pagination?.onPageChange) pagination.onPageChange(next)
  }

  const tableStyle = {
    '--table-font-size': SCALES.font(1),
    '--table-select-accent': theme.palette.primary,
    '--table-width': SCALES.width(1, '100%'),
    '--table-height': SCALES.height(1, 'auto'),
    '--table-padding-top': SCALES.pt(0),
    '--table-padding-right': SCALES.pr(0),
    '--table-padding-bottom': SCALES.pb(0),
    '--table-padding-left': SCALES.pl(0),
    '--table-margin-top': SCALES.mt(0),
    '--table-margin-right': SCALES.mr(0),
    '--table-margin-bottom': SCALES.mb(0),
    '--table-margin-left': SCALES.ml(0),
    ...style
  } as React.CSSProperties

  return (
    // the context is typed for any row: each Table provides its own
    <TableContext.Provider
      value={contextValue as unknown as TableConfig<TableDataItemBase>}
    >
      <table
        ref={tableRef}
        className={useClasses(styles.table, className)}
        {...props}
        style={tableStyle}
      >
        <TableHead
          columns={columns}
          width={width}
          sort={sort}
          onSort={sortHandler}
          selection={
            selectable
              ? {
                  checked: pageKeys.length > 0 && inView === pageKeys.length,
                  indeterminate: inView > 0 && inView < pageKeys.length,
                  label: selectAllLabel,
                  onToggle: toggleAll
                }
              : undefined
          }
        />
        <TableBody<TableDataItem>
          data={rows}
          keys={pageKeys}
          selection={
            selectable
              ? {
                  keys: selectedKeys,
                  label: selectRowLabel,
                  onToggle: toggleKey
                }
              : undefined
          }
          hover={hover}
          emptyText={emptyText}
          onRow={onRow}
          onCell={onCell}
          rowClassName={rowClassName}
        />
        {children}
      </table>
      {pageCount > 1 && (
        <div className={styles.footer}>
          <Pagination
            count={pageCount}
            page={page}
            onChange={pageChangeHandler}
          />
        </div>
      )}
    </TableContext.Provider>
  )
}

TableComponent.displayName = 'BolioUITable'
TableComponent.Column = TableColumn

// a generic function cannot be expressed by forwardRef and withScale, which
// is why the result gets its type here
type TableType = {
  <TableDataItem extends TableDataItemBase>(
    props: React.PropsWithChildren<TableProps<TableDataItem>> &
      ScaleProps & { ref?: React.Ref<HTMLTableElement> }
  ): React.JSX.Element
  Column: typeof TableColumn
  displayName?: string
}

const Table = withScale(
  React.forwardRef(TableComponent)
) as unknown as TableType
Table.Column = TableColumn

export default Table
