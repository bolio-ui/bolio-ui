import React from 'react'
import { Tooltip, Treemap as RechartsTreemap } from 'recharts'
import useTheme from '../use-theme'
import useReducedMotion from '../use-reduced-motion'
import { withScale } from '../use-scale'
import ChartFrame from './ChartFrame'
import { getSeriesColor, getTooltipStyle } from './chart-theme'

export interface TreemapNode {
  name: string
  value?: number
  color?: string
  children?: TreemapNode[]
}

interface Props {
  data: TreemapNode[]
  height?: number
  aspectRatio?: number
  withTooltip?: boolean
  withLabels?: boolean
  labelColor?: string
  valueFormatter?: (value: number) => string
  className?: string
}

export type TreemapProps = Props &
  Omit<React.HTMLAttributes<HTMLDivElement>, keyof Props>

type Painted = TreemapNode & { fill: string; children?: Painted[] }

// A child takes the color of its parent unless it has its own
const paint = (
  nodes: TreemapNode[],
  fill: (index: number, own?: string) => string,
  inherited?: string
): Painted[] =>
  nodes.map((node, index) => {
    const color = node.color || inherited || fill(index)
    return {
      ...node,
      fill: color,
      children: node.children ? paint(node.children, fill, color) : undefined
    }
  })

interface CellProps {
  x: number
  y: number
  width: number
  height: number
  name: string
  fill: string
  depth: number
  children?: unknown[]
  stroke: string
  labelColor: string
  withLabels: boolean
}

const Cell = ({
  x,
  y,
  width,
  height,
  name,
  fill,
  depth,
  children,
  stroke,
  labelColor,
  withLabels
}: CellProps) => {
  // the root only holds the tree
  if (depth === 0) return null
  // a group only frames its children, which paint the area
  if (children && children.length)
    return (
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill="none"
        stroke={stroke}
        strokeWidth={2}
      />
    )
  const fits = width > String(name).length * 7 + 12 && height > 22
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fill}
        stroke={stroke}
        strokeWidth={2}
      />
      {withLabels && fits && (
        <text x={x + 6} y={y + 16} fill={labelColor} fontSize={12}>
          {name}
        </text>
      )}
    </g>
  )
}

const TreemapComponent = React.forwardRef<HTMLDivElement, TreemapProps>(
  (
    {
      data,
      height = 300,
      aspectRatio,
      withTooltip = true,
      withLabels = true,
      labelColor = '#fff',
      valueFormatter,
      ...props
    },
    ref
  ) => {
    const theme = useTheme()
    const animate = !useReducedMotion()
    const palette = theme.palette
    const rows = paint(data, (index) => getSeriesColor(palette, index))
    const format = (value: unknown) =>
      typeof value === 'number'
        ? valueFormatter
          ? valueFormatter(value)
          : value.toLocaleString('en-US')
        : value

    return (
      <ChartFrame ref={ref} height={height} {...props}>
        <RechartsTreemap
          data={
            rows as unknown as React.ComponentProps<
              typeof RechartsTreemap
            >['data']
          }
          dataKey="value"
          nameKey="name"
          aspectRatio={aspectRatio}
          isAnimationActive={animate}
          content={
            <Cell
              {...({} as CellProps)}
              stroke={palette.background}
              labelColor={labelColor}
              withLabels={withLabels}
            />
          }
        >
          {withTooltip && (
            <Tooltip
              formatter={(value) => format(value) as React.ReactNode}
              {...getTooltipStyle(theme)}
            />
          )}
        </RechartsTreemap>
      </ChartFrame>
    )
  }
)

TreemapComponent.displayName = 'BolioUITreemap'
const Treemap = withScale(TreemapComponent)
export default Treemap
