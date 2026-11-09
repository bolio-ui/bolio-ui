import React, { useMemo, useState } from 'react'
import useTheme from '../use-theme'
import useScale, { withScale } from '../use-scale'
import useClasses, { joinClasses } from '../use-classes'
import { diffInline, diffLines } from './diff-lines'
import type { DiffLine, DiffMethod, Segment } from './diff-lines'
import styles from './Diff.module.css'

interface Props {
  previousValue: string
  currentValue: string
  mode?: 'unified' | 'split'
  diffMethod?: DiffMethod
  // unchanged lines kept around each change, the rest folds away
  contextLines?: number
  withLineNumbers?: boolean
  addColor?: string
  removeColor?: string
  expandLabel?: (hidden: number) => string
  className?: string
}

type NativeAttrs = Omit<React.HTMLAttributes<HTMLDivElement>, keyof Props>
export type DiffProps = Props & NativeAttrs

// One row of the table: a line, a pair of lines side by side, or a fold
type Row =
  | { type: 'line'; line: DiffLine; segments?: Segment[] }
  | {
      type: 'pair'
      left?: DiffLine
      right?: DiffLine
      leftSegments?: Segment[]
      rightSegments?: Segment[]
    }
  | { type: 'fold'; key: string; lines: Row[] }

const defaultLabel = (hidden: number) =>
  `Show ${hidden} hidden ${hidden === 1 ? 'line' : 'lines'}`

const MARKS = { add: '+', remove: '-', equal: ' ' } as const

const renderSegments = (
  segments: Segment[] | undefined,
  text: string,
  className: string
) =>
  segments
    ? segments.map((part, index) =>
        part.changed ? (
          <mark key={index} className={className}>
            {part.text}
          </mark>
        ) : (
          <React.Fragment key={index}>{part.text}</React.Fragment>
        )
      )
    : text

const DiffComponent = React.forwardRef<HTMLDivElement, DiffProps>(
  (
    {
      previousValue,
      currentValue,
      mode = 'unified',
      diffMethod = 'words',
      contextLines = Infinity,
      withLineNumbers = true,
      addColor,
      removeColor,
      expandLabel = defaultLabel,
      className = '',
      style,
      ...props
    },
    ref
  ) => {
    const theme = useTheme()
    const { SCALES } = useScale()
    const [open, setOpen] = useState<Record<string, boolean>>({})

    const lines = useMemo(
      () => diffLines(previousValue, currentValue),
      [previousValue, currentValue]
    )

    const rows = useMemo(() => {
      // 1. group the lines: a run of removes followed by adds is one change
      const grouped: Row[] = []
      let index = 0
      while (index < lines.length) {
        const line = lines[index]
        if (line.kind === 'equal') {
          grouped.push({ type: 'line', line })
          index++
          continue
        }
        const removed: DiffLine[] = []
        const added: DiffLine[] = []
        while (index < lines.length && lines[index].kind === 'remove')
          removed.push(lines[index++])
        while (index < lines.length && lines[index].kind === 'add')
          added.push(lines[index++])
        if (mode === 'split') {
          const total = Math.max(removed.length, added.length)
          for (let k = 0; k < total; k++) {
            const left = removed[k]
            const right = added[k]
            const [leftSegments, rightSegments] =
              left && right
                ? diffInline(left.text, right.text, diffMethod)
                : [undefined, undefined]
            grouped.push({
              type: 'pair',
              left,
              right,
              leftSegments,
              rightSegments
            })
          }
        } else {
          const paired = Math.min(removed.length, added.length)
          const inline = removed
            .slice(0, paired)
            .map((left, k) => diffInline(left.text, added[k].text, diffMethod))
          removed.forEach((left, k) =>
            grouped.push({ type: 'line', line: left, segments: inline[k]?.[0] })
          )
          added.forEach((right, k) =>
            grouped.push({
              type: 'line',
              line: right,
              segments: inline[k]?.[1]
            })
          )
        }
      }

      // 2. fold the unchanged runs that are longer than the context allows
      if (!Number.isFinite(contextLines)) return grouped
      const isChange = (row: Row) =>
        row.type === 'pair' ||
        (row.type === 'line' && row.line.kind !== 'equal')
      const keep = grouped.map(() => false)
      grouped.forEach((row, at) => {
        if (!isChange(row)) return
        for (
          let near = Math.max(at - contextLines, 0);
          near <= Math.min(at + contextLines, grouped.length - 1);
          near++
        )
          keep[near] = true
      })
      const folded: Row[] = []
      let run: Row[] = []
      const flush = (at: number) => {
        if (run.length)
          folded.push({ type: 'fold', key: `fold-${at}`, lines: run })
        run = []
      }
      grouped.forEach((row, at) => {
        if (keep[at]) {
          flush(at)
          folded.push(row)
        } else run.push(row)
      })
      flush(grouped.length)
      return folded
    }, [lines, mode, diffMethod, contextLines])

    const colors = {
      '--diff-add-color': addColor || theme.palette.success,
      '--diff-remove-color': removeColor || theme.palette.error,
      '--diff-font-size': SCALES.font(0.8125),
      '--diff-text-color': theme.palette.foreground,
      '--diff-number-color': theme.palette.accents_4,
      '--diff-border-color': theme.palette.border,
      '--diff-fold-bg': theme.palette.accents_1,
      '--diff-radius': theme.layout.radius,
      '--diff-focus-color': theme.palette.primary
    }
    const rootStyle = {
      ...colors,
      width: SCALES.width(1, '100%'),
      padding: `${SCALES.pt(0)} ${SCALES.pr(0)} ${SCALES.pb(0)} ${SCALES.pl(0)}`,
      margin: `${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)} ${SCALES.ml(0)}`,
      ...style
    } as React.CSSProperties

    const columns =
      mode === 'split' ? (withLineNumbers ? 4 : 2) : withLineNumbers ? 3 : 1

    const cell = (
      line: DiffLine | undefined,
      segments: Segment[] | undefined,
      side: 'old' | 'new' | 'both'
    ) => {
      const kind = line ? line.kind : 'empty'
      const number = side === 'new' ? line?.newNo : line?.oldNo
      return (
        <>
          {withLineNumbers && (
            <td className={joinClasses(styles.number, styles[kind])}>
              {line ? number : ''}
            </td>
          )}
          <td className={joinClasses(styles.code, styles[kind])}>
            {line && (
              <>
                <span className={styles.mark}>{MARKS[line.kind]}</span>
                {renderSegments(segments, line.text, styles.changed)}
              </>
            )}
          </td>
        </>
      )
    }

    const renderRow = (row: Row, at: string): React.ReactNode => {
      if (row.type === 'fold') {
        if (open[row.key])
          return row.lines.map((inner, k) => renderRow(inner, `${at}-${k}`))
        return (
          <tr key={at}>
            <td colSpan={columns} className={styles.fold}>
              <button
                type="button"
                className={styles.expand}
                onClick={() =>
                  setOpen((last) => ({ ...last, [row.key]: true }))
                }
              >
                {expandLabel(row.lines.length)}
              </button>
            </td>
          </tr>
        )
      }
      if (row.type === 'pair')
        return (
          <tr key={at}>
            {cell(row.left, row.leftSegments, 'old')}
            {cell(row.right, row.rightSegments, 'new')}
          </tr>
        )
      const { line, segments } = row
      if (mode === 'split')
        return (
          <tr key={at}>
            {cell(line, segments, 'old')}
            {cell(line, segments, 'new')}
          </tr>
        )
      return (
        <tr key={at}>
          {withLineNumbers && (
            <>
              <td className={joinClasses(styles.number, styles[line.kind])}>
                {line.oldNo ?? ''}
              </td>
              <td className={joinClasses(styles.number, styles[line.kind])}>
                {line.newNo ?? ''}
              </td>
            </>
          )}
          <td className={joinClasses(styles.code, styles[line.kind])}>
            <span className={styles.mark}>{MARKS[line.kind]}</span>
            {renderSegments(segments, line.text, styles.changed)}
          </td>
        </tr>
      )
    }

    return (
      <div
        ref={ref}
        className={useClasses(styles.diff, className)}
        style={rootStyle}
        {...props}
      >
        <table className={styles.table}>
          <tbody>{rows.map((row, at) => renderRow(row, String(at)))}</tbody>
        </table>
      </div>
    )
  }
)

DiffComponent.displayName = 'BolioUIDiff'
const Diff = withScale(DiffComponent)
export default Diff
