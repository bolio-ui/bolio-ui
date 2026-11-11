import React, { useMemo } from 'react'
import useTheme from '../use-theme'
import type { NormalTypes } from '../utils/prop-types'
import useScale, { withScale } from '../use-scale'
import useClasses from '../use-classes'
import { getLevelColor, getLevels } from '../Charts/chart-theme'

export interface MatrixCell {
  x: string
  y: string
  // `null` leaves the cell empty
  value: number | null
}

interface Props {
  data: MatrixCell[]
  type?: NormalTypes
  colors?: string[]
  domain?: [number, number]
  cellSize?: number
  gap?: number
  cellRadius?: number
  withXLabels?: boolean
  withYLabels?: boolean
  xLabelsRotation?: number
  withLegend?: boolean
  legendLabels?: [string, string]
  valueLabel?: (cell: MatrixCell) => string
  className?: string
}

type NativeAttrs = Omit<React.SVGAttributes<SVGSVGElement>, keyof Props>
export type MatrixChartProps = Props & NativeAttrs

const FONT = 11

const MatrixChartComponent = React.forwardRef<SVGSVGElement, MatrixChartProps>(
  (
    {
      data,
      type = 'primary',
      colors,
      domain,
      cellSize = 28,
      gap = 2,
      cellRadius = 3,
      withXLabels = true,
      withYLabels = true,
      xLabelsRotation = 0,
      withLegend = false,
      legendLabels = ['Less', 'More'],
      valueLabel = (cell) =>
        `${cell.y}, ${cell.x}: ${cell.value === null ? 'no value' : cell.value}`,
      className = '',
      style,
      ...props
    },
    ref
  ) => {
    const theme = useTheme()
    const { SCALES } = useScale()
    const palette = theme.palette
    const levels = getLevels(palette, type, colors)

    const { xs, ys, lookup, scale } = useMemo(() => {
      const columns: string[] = []
      const rows: string[] = []
      const map = new Map<string, MatrixCell>()
      data.forEach((cell) => {
        if (!columns.includes(cell.x)) columns.push(cell.x)
        if (!rows.includes(cell.y)) rows.push(cell.y)
        map.set(`${cell.x}\u0000${cell.y}`, cell)
      })
      const values = data
        .map((cell) => cell.value)
        .filter((value): value is number => value !== null && value > 0)
      return {
        xs: columns,
        ys: rows,
        lookup: map,
        scale:
          domain ||
          ([Math.min(...values), Math.max(...values)] as [number, number])
      }
    }, [data, domain])

    const step = cellSize + gap
    const longest = Math.max(0, ...ys.map((label) => label.length))
    const labelWidth = withYLabels ? longest * 6.5 + 10 : 0
    const slanted = Math.abs(xLabelsRotation) > 0
    const labelHeight = withXLabels ? (slanted ? 44 : 20) : 0
    const legendHeight = withLegend ? cellSize / 2 + 18 : 0
    const gridHeight = ys.length * step - gap
    const width = Math.max(labelWidth + xs.length * step - gap, 0)
    const height = gridHeight + labelHeight + legendHeight

    const labelled = Boolean(props['aria-label'] || props['aria-labelledby'])
    const text = { fill: palette.accents_5, fontSize: FONT }
    const svgStyle = {
      display: 'block',
      maxWidth: '100%',
      height: 'auto',
      padding: `${SCALES.pt(0)} ${SCALES.pr(0)} ${SCALES.pb(0)} ${SCALES.pl(0)}`,
      margin: `${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)} ${SCALES.ml(0)}`,
      boxSizing: 'content-box',
      ...style
    } as React.CSSProperties

    return (
      <svg
        ref={ref}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        role={labelled ? 'img' : undefined}
        aria-hidden={labelled ? undefined : true}
        className={useClasses(className)}
        style={svgStyle}
        {...props}
      >
        {withYLabels &&
          ys.map((label, row) => (
            <text
              key={label}
              x={labelWidth - 6}
              y={row * step + cellSize / 2}
              textAnchor="end"
              dominantBaseline="central"
              {...text}
            >
              {label}
            </text>
          ))}
        {ys.map((row, rowIndex) =>
          xs.map((column, columnIndex) => {
            const cell = lookup.get(`${column}\u0000${row}`)
            return (
              <rect
                key={`${column}-${row}`}
                x={labelWidth + columnIndex * step}
                y={rowIndex * step}
                width={cellSize}
                height={cellSize}
                rx={cellRadius}
                style={{
                  fill: getLevelColor(
                    cell ? cell.value : null,
                    scale,
                    levels,
                    palette.accents_2
                  )
                }}
              >
                <title>
                  {valueLabel(cell || { x: column, y: row, value: null })}
                </title>
              </rect>
            )
          })
        )}
        {withXLabels &&
          xs.map((label, column) => {
            const x = labelWidth + column * step + cellSize / 2
            const y = gridHeight + 14
            return (
              <text
                key={label}
                x={x}
                y={y}
                textAnchor={slanted ? 'end' : 'middle'}
                transform={
                  slanted ? `rotate(${xLabelsRotation} ${x} ${y})` : undefined
                }
                {...text}
              >
                {label}
              </text>
            )
          })}
        {withLegend && (
          <g transform={`translate(0 ${gridHeight + labelHeight + 10})`}>
            <text
              x={labelWidth}
              y={cellSize / 4}
              dominantBaseline="central"
              {...text}
            >
              {legendLabels[0]}
            </text>
            {[palette.accents_2, ...levels].map((color, index) => (
              <rect
                key={index}
                x={labelWidth + 36 + index * (cellSize / 2 + gap)}
                width={cellSize / 2}
                height={cellSize / 2}
                rx={cellRadius}
                style={{ fill: color }}
              />
            ))}
            <text
              x={labelWidth + 40 + (levels.length + 1) * (cellSize / 2 + gap)}
              y={cellSize / 4}
              dominantBaseline="central"
              {...text}
            >
              {legendLabels[1]}
            </text>
          </g>
        )}
      </svg>
    )
  }
)

MatrixChartComponent.displayName = 'BolioUIMatrixChart'
const MatrixChart = withScale(MatrixChartComponent)
export default MatrixChart
