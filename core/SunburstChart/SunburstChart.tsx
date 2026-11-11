import React, { useMemo } from 'react'
import useTheme from '../use-theme'
import useScale, { withScale } from '../use-scale'
import useClasses from '../use-classes'
import { getSeriesColor } from '../Charts/chart-theme'

export interface SunburstNode {
  name: string
  // a leaf needs a value, a parent takes the sum of its children
  value?: number
  color?: string
  children?: SunburstNode[]
}

interface Props {
  data: SunburstNode[]
  size?: number
  innerRadius?: number
  gap?: number
  startAngle?: number
  endAngle?: number
  withLabels?: boolean
  valueFormatter?: (value: number) => string
  className?: string
}

type NativeAttrs = Omit<React.SVGAttributes<SVGSVGElement>, keyof Props>
export type SunburstChartProps = Props & NativeAttrs

interface Arc {
  key: string
  name: string
  value: number
  color: string
  depth: number
  from: number
  to: number
}

const total = (node: SunburstNode): number =>
  node.children && node.children.length
    ? node.children.reduce((sum, child) => sum + total(child), 0)
    : Math.max(node.value || 0, 0)

const depthOf = (nodes: SunburstNode[]): number =>
  1 +
  Math.max(
    0,
    ...nodes.map((node) =>
      node.children && node.children.length ? depthOf(node.children) : 0
    )
  )

// 0 degrees is the top and angles grow clockwise
const polar = (center: number, radius: number, degrees: number) => {
  const angle = (degrees * Math.PI) / 180
  return [center + radius * Math.sin(angle), center - radius * Math.cos(angle)]
}

const ring = (
  center: number,
  inner: number,
  outer: number,
  from: number,
  to: number
) => {
  // a full circle starts and ends on the same point, which draws nothing
  const end = Math.min(to, from + 359.99)
  const large = end - from > 180 ? 1 : 0
  const [ox1, oy1] = polar(center, outer, from)
  const [ox2, oy2] = polar(center, outer, end)
  const [ix2, iy2] = polar(center, inner, end)
  const [ix1, iy1] = polar(center, inner, from)
  return `M${ox1} ${oy1} A${outer} ${outer} 0 ${large} 1 ${ox2} ${oy2} L${ix2} ${iy2} A${inner} ${inner} 0 ${large} 0 ${ix1} ${iy1} Z`
}

const SunburstChartComponent = React.forwardRef<
  SVGSVGElement,
  SunburstChartProps
>(
  (
    {
      data,
      size = 300,
      innerRadius = 36,
      gap = 1,
      startAngle = 0,
      endAngle = 360,
      withLabels = false,
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

    const depth = depthOf(data)
    const center = size / 2
    const thickness = (center - 2 - innerRadius) / depth

    const arcs = useMemo(() => {
      const list: Arc[] = []
      const walk = (
        nodes: SunburstNode[],
        level: number,
        from: number,
        to: number,
        inherited: string | undefined,
        path: string
      ) => {
        const sum = nodes.reduce((acc, node) => acc + total(node), 0)
        if (!sum) return
        let cursor = from
        nodes.forEach((node, index) => {
          const value = total(node)
          const span = ((to - from) * value) / sum
          const color =
            node.color || inherited || getSeriesColor(palette, index)
          const key = `${path}/${index}`
          if (value > 0) {
            list.push({
              key,
              name: node.name,
              value,
              color,
              depth: level,
              from: cursor,
              to: cursor + span
            })
            if (node.children && node.children.length)
              walk(node.children, level + 1, cursor, cursor + span, color, key)
          }
          cursor += span
        })
      }
      walk(data, 0, startAngle, endAngle, undefined, '')
      return list
    }, [data, startAngle, endAngle, palette])

    const labelled = Boolean(props['aria-label'] || props['aria-labelledby'])
    const svgStyle = {
      display: 'inline-block',
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
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role={labelled ? 'img' : undefined}
        aria-hidden={labelled ? undefined : true}
        className={useClasses(className)}
        style={svgStyle}
        {...props}
      >
        {arcs.map((arc) => {
          const inner = innerRadius + arc.depth * thickness + gap / 2
          const outer = innerRadius + (arc.depth + 1) * thickness - gap / 2
          const span = arc.to - arc.from
          const middle = (arc.from + arc.to) / 2
          const radius = (inner + outer) / 2
          const room = (radius * span * Math.PI) / 180
          const [lx, ly] = polar(center, radius, middle)
          return (
            <g key={arc.key}>
              <path
                d={ring(center, inner, outer, arc.from, arc.to)}
                fill={arc.color}
                fillOpacity={Math.max(1 - arc.depth * 0.18, 0.4)}
                stroke={palette.background}
                strokeWidth={1}
              >
                <title>{`${arc.name}: ${format(arc.value)}`}</title>
              </path>
              {withLabels &&
                thickness > 14 &&
                room > arc.name.length * 6 + 8 && (
                  <text
                    x={lx}
                    y={ly}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="#fff"
                    fontSize={11}
                    pointerEvents="none"
                  >
                    {arc.name}
                  </text>
                )}
            </g>
          )
        })}
      </svg>
    )
  }
)

SunburstChartComponent.displayName = 'BolioUISunburstChart'
const SunburstChart = withScale(SunburstChartComponent)
export default SunburstChart
