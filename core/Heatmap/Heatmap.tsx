import React, { useMemo } from 'react'
import useTheme from '../use-theme'
import type { NormalTypes } from '../utils/prop-types'
import useScale, { withScale } from '../use-scale'
import useClasses from '../use-classes'
import { getLevelColor, getLevels } from '../Charts/chart-theme'

type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6

interface Props {
  // dates as `YYYY-MM-DD`, and the number of that day
  data: Record<string, number>
  startDate?: string | Date
  endDate?: string | Date
  type?: NormalTypes
  colors?: string[]
  firstDayOfWeek?: Weekday
  rectSize?: number
  gap?: number
  rectRadius?: number
  withMonthLabels?: boolean
  withWeekdayLabels?: boolean
  withLegend?: boolean
  legendLabels?: [string, string]
  locale?: string
  monthLabels?: string[]
  weekdayLabels?: string[]
  valueLabel?: (date: string, value: number) => string
  className?: string
}

type NativeAttrs = Omit<React.SVGAttributes<SVGSVGElement>, keyof Props>
export type HeatmapProps = Props & NativeAttrs

const DAY = 86400000
const FONT = 10
const MONTH_ROW = 16

// A calendar day as milliseconds at UTC midnight, so daylight saving time
// never moves a date.
const toDay = (value: string | Date) => {
  if (typeof value === 'string') {
    const [year, month, day] = value.split('-').map(Number)
    return Date.UTC(year, month - 1, day)
  }
  return Date.UTC(value.getFullYear(), value.getMonth(), value.getDate())
}
const toISO = (day: number) => new Date(day).toISOString().slice(0, 10)

const HeatmapComponent = React.forwardRef<SVGSVGElement, HeatmapProps>(
  (
    {
      data,
      startDate,
      endDate,
      type = 'success',
      colors,
      firstDayOfWeek = 1,
      rectSize = 12,
      gap = 3,
      rectRadius = 2,
      withMonthLabels = true,
      withWeekdayLabels = true,
      withLegend = false,
      legendLabels = ['Less', 'More'],
      locale = 'en-US',
      monthLabels,
      weekdayLabels,
      valueLabel = (date, value) => `${date}: ${value}`,
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

    const layout = useMemo(() => {
      const end = endDate ? toDay(endDate) : toDay(new Date())
      const start = startDate ? toDay(startDate) : end - 364 * DAY
      const startDow = new Date(start).getUTCDay()
      const firstColumn = start - ((startDow - firstDayOfWeek + 7) % 7) * DAY
      const weeks = Math.floor((end - firstColumn) / DAY / 7) + 1
      return { start, end, firstColumn, weeks }
    }, [startDate, endDate, firstDayOfWeek])
    const { start, end, firstColumn, weeks } = layout

    const values = Object.values(data).filter((value) => value > 0)
    const domain: [number, number] = [Math.min(...values), Math.max(...values)]
    const colorOf = (value: number | undefined) =>
      getLevelColor(value, domain, levels, palette.accents_2)

    const months = useMemo(() => {
      if (monthLabels) return monthLabels
      const format = new Intl.DateTimeFormat(locale, {
        month: 'short',
        timeZone: 'UTC'
      })
      return Array.from({ length: 12 }, (_, month) =>
        format.format(Date.UTC(2023, month, 1))
      )
    }, [monthLabels, locale])
    const weekdays = useMemo(() => {
      if (weekdayLabels) return weekdayLabels
      const format = new Intl.DateTimeFormat(locale, {
        weekday: 'short',
        timeZone: 'UTC'
      })
      // 2023-01-01 is a Sunday
      return Array.from({ length: 7 }, (_, dow) =>
        format.format(Date.UTC(2023, 0, 1 + dow))
      )
    }, [weekdayLabels, locale])

    const step = rectSize + gap
    const labelWidth = withWeekdayLabels ? 32 : 0
    const top = withMonthLabels ? MONTH_ROW : 0
    const legendHeight = withLegend ? rectSize + 10 : 0
    const width = labelWidth + weeks * step - gap
    const height = top + 7 * step - gap + legendHeight

    // a month is named above the column where it starts, unless the next
    // name is too close for both to fit
    const starts: Array<{ column: number; month: number }> = []
    if (withMonthLabels) {
      starts.push({ column: 0, month: new Date(start).getUTCMonth() })
      for (let day = start; day <= end; day += DAY) {
        if (new Date(day).getUTCDate() === 1 && day !== start)
          starts.push({
            column: Math.floor((day - firstColumn) / DAY / 7),
            month: new Date(day).getUTCMonth()
          })
      }
    }
    const names = starts.filter(
      (item, index) =>
        !starts[index + 1] || starts[index + 1].column - item.column >= 3
    )

    const cells: React.ReactElement[] = []
    for (let column = 0; column < weeks; column++) {
      for (let row = 0; row < 7; row++) {
        const day = firstColumn + (column * 7 + row) * DAY
        if (day < start || day > end) continue
        const date = toISO(day)
        const value = data[date]
        cells.push(
          <rect
            key={date}
            x={labelWidth + column * step}
            y={top + row * step}
            width={rectSize}
            height={rectSize}
            rx={rectRadius}
            style={{ fill: colorOf(value) }}
          >
            <title>{valueLabel(date, value || 0)}</title>
          </rect>
        )
      }
    }

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
        {names.map(({ column, month }) => (
          <text
            key={`${column}-${month}`}
            x={labelWidth + column * step}
            y={FONT}
            {...text}
          >
            {months[month]}
          </text>
        ))}
        {withWeekdayLabels &&
          // Monday, Wednesday and Friday, wherever the week starts
          [1, 3, 5].map((dow) => (
            <text
              key={dow}
              x={labelWidth - 6}
              y={top + ((dow - firstDayOfWeek + 7) % 7) * step + rectSize / 2}
              textAnchor="end"
              dominantBaseline="central"
              {...text}
            >
              {weekdays[dow]}
            </text>
          ))}
        {cells}
        {withLegend && (
          <g transform={`translate(0 ${top + 7 * step - gap + 10})`}>
            <text
              x={labelWidth}
              y={rectSize / 2}
              dominantBaseline="central"
              {...text}
            >
              {legendLabels[0]}
            </text>
            {[palette.accents_2, ...levels].map((color, index) => (
              <rect
                key={index}
                x={labelWidth + 36 + index * step}
                width={rectSize}
                height={rectSize}
                rx={rectRadius}
                style={{ fill: color }}
              />
            ))}
            <text
              x={labelWidth + 36 + (levels.length + 1) * step + 4}
              y={rectSize / 2}
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

HeatmapComponent.displayName = 'BolioUIHeatmap'
const Heatmap = withScale(HeatmapComponent)
export default Heatmap
