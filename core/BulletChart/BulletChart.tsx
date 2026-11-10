import React from 'react'
import useTheme from '../use-theme'
import type { NormalTypes } from '../utils/prop-types'
import useScale, { withScale } from '../use-scale'
import useClasses from '../use-classes'

export interface BulletRange {
  // where the band ends, it starts where the one before ends
  value: number
  color?: string
  label?: string
}

interface Props {
  value: number
  target?: number
  ranges: BulletRange[]
  min?: number
  orientation?: 'horizontal' | 'vertical'
  size?: number
  barSize?: number
  height?: number
  type?: NormalTypes
  barColor?: string
  targetColor?: string
  label?: React.ReactNode
  valueFormatter?: (value: number) => string
  className?: string
}

export type BulletChartProps = Props &
  Omit<React.HTMLAttributes<HTMLDivElement>, keyof Props>

const BulletChartComponent = React.forwardRef<HTMLDivElement, BulletChartProps>(
  (
    {
      value,
      target,
      ranges,
      min = 0,
      orientation = 'horizontal',
      size = 28,
      barSize,
      height = 200,
      type = 'primary',
      barColor,
      targetColor,
      label,
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
    const format = (number: number) =>
      valueFormatter ? valueFormatter(number) : number.toLocaleString('en-US')

    const vertical = orientation === 'vertical'
    const max = Math.max(
      ranges.length ? ranges[ranges.length - 1].value : 0,
      value,
      target ?? 0
    )
    const range = max - min
    const percent = (number: number) =>
      range > 0 ? Math.min(Math.max((number - min) / range, 0), 1) * 100 : 0
    // the grey of the bands gets darker with each one
    const tints = [palette.accents_2, palette.accents_3, palette.accents_4]
    const thickness = barSize || Math.round(size / 3)

    // `start` and `length` are percentages along the track
    const place = (start: number, length: number): React.CSSProperties =>
      vertical
        ? { bottom: `${start}%`, height: `${length}%`, left: 0, right: 0 }
        : { left: `${start}%`, width: `${length}%`, top: 0, bottom: 0 }

    let previous = 0
    const bands = ranges.map((item, index) => {
      const start = previous
      previous = Math.max(percent(item.value), previous)
      return {
        key: index,
        start,
        length: previous - start,
        color: item.color || tints[index % tints.length]
      }
    })

    const labelled = Boolean(props['aria-label'] || props['aria-labelledby'])
    const text = `${format(value)}${target !== undefined ? `, target ${format(target)}` : ''}`
    const barPaint =
      barColor || palette[type === 'default' ? 'foreground' : type]
    const rootStyle: React.CSSProperties = {
      display: vertical ? 'inline-flex' : 'flex',
      flexDirection: vertical ? 'row' : 'column',
      alignItems: vertical ? 'stretch' : undefined,
      gap: 8,
      width: SCALES.width(1, vertical ? 'auto' : '100%'),
      color: palette.foreground,
      fontSize: 13,
      padding: `${SCALES.pt(0)} ${SCALES.pr(0)} ${SCALES.pb(0)} ${SCALES.pl(0)}`,
      margin: `${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)} ${SCALES.ml(0)}`,
      ...style
    }

    return (
      <div
        ref={ref}
        // a meter needs a name, so it only is one when it has one
        role={labelled ? 'meter' : undefined}
        aria-valuenow={labelled ? value : undefined}
        aria-valuemin={labelled ? min : undefined}
        aria-valuemax={labelled ? max : undefined}
        aria-valuetext={labelled ? text : undefined}
        className={useClasses(className)}
        style={rootStyle}
        {...props}
      >
        {label !== undefined && <div style={{ fontWeight: 600 }}>{label}</div>}
        <div
          title={text}
          style={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: theme.layout.radius,
            background: palette.accents_1,
            ...(vertical ? { width: size, height } : { height: size })
          }}
        >
          {bands.map((band) => (
            <div
              key={band.key}
              style={{
                position: 'absolute',
                background: band.color,
                ...place(band.start, band.length)
              }}
            />
          ))}
          <div
            style={{
              position: 'absolute',
              background: barPaint,
              borderRadius: 2,
              ...(vertical
                ? {
                    bottom: 0,
                    height: `${percent(value)}%`,
                    left: (size - thickness) / 2,
                    width: thickness
                  }
                : {
                    left: 0,
                    width: `${percent(value)}%`,
                    top: (size - thickness) / 2,
                    height: thickness
                  })
            }}
          />
          {target !== undefined && (
            <div
              style={{
                position: 'absolute',
                background: targetColor || palette.foreground,
                ...(vertical
                  ? {
                      bottom: `${percent(target)}%`,
                      height: 3,
                      left: size * 0.15,
                      right: size * 0.15
                    }
                  : {
                      left: `${percent(target)}%`,
                      width: 3,
                      top: size * 0.15,
                      bottom: size * 0.15
                    })
              }}
            />
          )}
        </div>
        {ranges.some((item) => item.label) && (
          <ul
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              flexDirection: vertical ? 'column' : 'row',
              gap: '4px 16px',
              margin: 0,
              padding: 0,
              listStyle: 'none',
              color: palette.accents_5
            }}
          >
            {ranges.map(
              (item, index) =>
                item.label && (
                  <li
                    key={index}
                    style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                  >
                    <span
                      aria-hidden="true"
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 2,
                        background: bands[index].color
                      }}
                    />
                    {item.label}
                  </li>
                )
            )}
          </ul>
        )}
      </div>
    )
  }
)

BulletChartComponent.displayName = 'BolioUIBulletChart'
const BulletChart = withScale(BulletChartComponent)
export default BulletChart
