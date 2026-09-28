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
  TableOnCellClick,
  TableOnChange,
  TableOnRowClick,
  TableRowClassNameHandler
} from './TableTypes'
import useScale, { ScaleProps, withScale } from '../use-scale'
import TableColumn from './TableColumn'
import type { AnyElement } from '../utils/types'
import useClasses from '../use-classes'
import styles from './Table.module.css'

interface Props<TableDataItem extends TableDataItemBase> {
  data?: Array<TableDataItem>
  initialData?: Array<TableDataItem>
  emptyText?: string
  hover?: boolean
  onRow?: TableOnRowClick<TableDataItem>
  onCell?: TableOnCellClick<TableDataItem>
  onChange?: TableOnChange<TableDataItem>
  className?: string
  rowClassName?: TableRowClassNameHandler<TableDataItem>
}

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
    className = defaultProps.className,
    rowClassName = defaultProps.rowClassName,
    style,
    ...props
  } = tableProps
  /* eslint-enable @typescript-eslint/no-unused-vars */

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

  const tableStyle = {
    '--table-font-size': SCALES.font(1),
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
        <TableHead columns={columns} width={width} />
        <TableBody<TableDataItem>
          data={data}
          hover={hover}
          emptyText={emptyText}
          onRow={onRow}
          onCell={onCell}
          rowClassName={rowClassName}
        />
        {children}
      </table>
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
