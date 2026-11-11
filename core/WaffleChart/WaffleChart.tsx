import React, { useMemo } from 'react'
import useTheme from '../use-theme'
import useScale, { withScale } from '../use-scale'
import useClasses from '../use-classes'
import { getSeriesColor } from '../Charts/chart-theme'

export interface WaffleCell {
  name: string
  value: number
  color?: string
}

export type WaffleFillDirection =
  'left-to-right' | 'right-to-left' | 'top-to-bottom' | 'bottom-to-top'

interface Props {
  data: WaffleCell[]
  rows?: number
  columns?: number
  total?: number
  fillDirection?: WaffleFillDirection
  gap?: number
  cellRadius?: number
  size?: number
  emptyColor?: string
  withLegend?: boolean
  valueFormatter?: (value: number) => string
  className?: string
}

export type WaffleChartProps = Props &
  Omit<React.HTMLAttributes<HTMLDivElement>, keyof Props>

// The order the cells are filled in, as a [row, column] for each step
const fillOrder = (
  rows: number,
  columns: number,
  direction: WaffleFillDirection
) => {
  const order: Array<[number, number]> = []
  const byRow = direction === 'left-to-right' || direction === 'right-to-left'
  const outer = byRow ? rows : columns
  const inner = byRow ? columns : rows
  const reverse = direction === 'right-to-left' || direction === 'bottom-to-top'
  for (let a = 0; a < outer; a++)
    for (let b = 0; b < inner; b++) {
      const c = reverse ? inner - 1 - b : b
      order.push(byRow ? [a, c] : [c, a])
    }
  return order
}

const WaffleChartComponent = React.forwardRef<HTMLDivElement, WaffleChartProps>(
  (
    {
      data,
      rows = 10,
      columns = 10,
      total,
      fillDirection = 'left-to-right',
      gap = 2,
      cellRadius = 2,
      size = 220,
      emptyColor,
      withLegend = true,
      valueFormatter,
      className = '',
      style,
      ...props
    },
    ref
  ) => {
    const theme = useTheme()
    const { SCALES } = useScale()
    const palette = theme.palette
    const format = (value: number) =>
      valueFormatter ? valueFormatter(value) : value.toLocaleString('en-US')

    const cells = rows * columns
    const segments = useMemo(() => {
      const sum = data.reduce((acc, item) => acc + Math.max(item.value, 0), 0)
      const whole = total || sum
      let cumulative = 0
      let used = 0
      return data.map((item, index) => {
        cumulative += Math.max(item.value, 0)
        // rounding the running total keeps the counts adding up to the grid
        const end = whole
          ? Math.min(Math.round((cumulative / whole) * cells), cells)
          : 0
        const count = Math.max(end - used, 0)
        used = Math.max(end, used)
        return {
          ...item,
          count,
          color: getSeriesColor(palette, index, item.color)
        }
      })
    }, [data, total, cells, palette])

    const side = (size - (columns - 1) * gap) / columns
    const height = rows * side + (rows - 1) * gap
    const empty = emptyColor || palette.accents_2

    // which segment owns each step of the fill
    const owners: number[] = []
    segments.forEach((segment, index) => {
      for (let i = 0; i < segment.count; i++) owners.push(index)
    })
    const order = fillOrder(rows, columns, fillDirection)
    const grid: Array<number | undefined> = Array(cells).fill(undefined)
    order.forEach(([row, column], step) => {
      grid[row * columns + column] = owners[step]
    })

    const labelled = Boolean(props['aria-label'] || props['aria-labelledby'])
    const summary = segments
      .map((segment) => `${segment.name} ${format(segment.value)}`)
      .join(', ')
    const rootStyle: React.CSSProperties = {
      display: 'inline-block',
      maxWidth: '100%',
      padding: `${SCALES.pt(0)} ${SCALES.pr(0)} ${SCALES.pb(0)} ${SCALES.pl(0)}`,
      margin: `${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)} ${SCALES.ml(0)}`,
      ...style
    }

    return (
      <div
        ref={ref}
        role={labelled ? 'group' : undefined}
        className={useClasses(className)}
        style={rootStyle}
        {...props}
      >
        <svg
          width={size}
          height={height}
          viewBox={`0 0 ${size} ${height}`}
          style={{ display: 'block', maxWidth: '100%', height: 'auto' }}
          // the legend already says it in text, otherwise the grid does
          role={withLegend ? undefined : 'img'}
          aria-hidden={withLegend ? true : undefined}
          aria-label={withLegend ? undefined : summary}
        >
          {grid.map((owner, index) => {
            const segment = owner === undefined ? undefined : segments[owner]
            return (
              <rect
                key={index}
                x={(index % columns) * (side + gap)}
                y={Math.floor(index / columns) * (side + gap)}
                width={side}
                height={side}
                rx={cellRadius}
                fill={segment ? segment.color : empty}
              >
                {segment && (
                  <title>{`${segment.name}: ${format(segment.value)}`}</title>
                )}
              </rect>
            )
          })}
        </svg>
        {withLegend && (
          <ul
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '4px 16px',
              margin: '12px 0 0',
              padding: 0,
              listStyle: 'none',
              fontSize: 13,
              color: palette.foreground
            }}
          >
            {segments.map((segment) => (
              <li
                key={segment.name}
                style={{ display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 2,
                    background: segment.color
                  }}
                />
                {segment.name}
                <span style={{ color: palette.accents_5 }}>
                  {format(segment.value)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    )
  }
)

WaffleChartComponent.displayName = 'BolioUIWaffleChart'
const WaffleChart = withScale(WaffleChartComponent)
export default WaffleChart
