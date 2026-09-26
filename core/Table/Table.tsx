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

  return (
    // the context is typed for any row: each Table provides its own
    <TableContext.Provider
      value={contextValue as unknown as TableConfig<TableDataItemBase>}
    >
      <table ref={tableRef} className={className} {...props}>
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

        <style jsx>{`
          table {
            border-collapse: separate;
            border-spacing: 0;
            --table-font-size: ${SCALES.font(1)};
            font-size: var(--table-font-size);
            width: ${SCALES.width(1, '100%')};
            height: ${SCALES.height(1, 'auto')};
            padding: ${SCALES.pt(0)} ${SCALES.pr(0)} ${SCALES.pb(0)}
              ${SCALES.pl(0)};
            margin: ${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)}
              ${SCALES.ml(0)};
          }
        `}</style>
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
