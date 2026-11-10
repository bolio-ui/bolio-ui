import React from 'react'
import useTheme from '../use-theme'
import type { NormalTypes } from '../utils/prop-types'
import useScale, { withScale } from '../use-scale'
import useClasses from '../use-classes'
import type { AnyElement } from '../utils/types'
import styles from './BarsList.module.css'

export interface BarsListItem {
  name: string
  value: number
  color?: string
}

interface Props {
  data: BarsListItem[]
  type?: NormalTypes
  barColor?: string
  valueFormatter?: (value: number) => string
  barsLabel?: string
  valueLabel?: string
  className?: string
}

type NativeAttrs = Omit<React.HTMLAttributes<AnyElement>, keyof Props>
export type BarsListProps = Props & NativeAttrs

const BarsListComponent = React.forwardRef<HTMLDivElement, BarsListProps>(
  (
    {
      data,
      type = 'primary',
      barColor,
      valueFormatter = (value) => value.toLocaleString('en-US'),
      barsLabel,
      valueLabel,
      className = '',
      style,
      ...props
    },
    ref
  ) => {
    const theme = useTheme()
    const { SCALES } = useScale()

    const fallback =
      barColor || theme.palette[type === 'default' ? 'accents_5' : type]
    const max = Math.max(0, ...data.map((item) => item.value))
    const values = data.map((item) => valueFormatter(item.value))
    const valueWidth = Math.max(0, ...values.map((text) => text.length))

    const listStyle = {
      '--bars-list-font-size': SCALES.font(0.875),
      '--bars-list-bar-height': SCALES.height(2),
      '--bars-list-value-width': `${valueWidth}ch`,
      '--bars-list-text-color': theme.palette.foreground,
      '--bars-list-label-color': theme.palette.accents_5,
      '--bars-list-radius': theme.layout.radius,
      width: SCALES.width(1, 'auto'),
      height: SCALES.height(1, 'auto'),
      padding: `${SCALES.pt(0)} ${SCALES.pr(0)} ${SCALES.pb(0)} ${SCALES.pl(0)}`,
      margin: `${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)} ${SCALES.ml(0)}`,
      ...style
    } as React.CSSProperties

    return (
      <div
        ref={ref}
        className={useClasses(styles.root, className)}
        style={listStyle}
        {...props}
      >
        {(barsLabel || valueLabel) && (
          <div className={styles.labels} aria-hidden="true">
            <span>{barsLabel}</span>
            <span className={styles.valueLabel}>{valueLabel}</span>
          </div>
        )}
        <ul className={styles.list}>
          {data.map((item, index) => (
            <li key={`${item.name}-${index}`} className={styles.item}>
              <div className={styles.track}>
                <div
                  className={styles.bar}
                  style={
                    {
                      '--bars-list-color': item.color || fallback,
                      width: `${max > 0 ? (Math.max(item.value, 0) / max) * 100 : 0}%`
                    } as React.CSSProperties
                  }
                >
                  <span className={styles.name}>{item.name}</span>
                </div>
              </div>
              <span className={styles.value}>{values[index]}</span>
            </li>
          ))}
        </ul>
      </div>
    )
  }
)

BarsListComponent.displayName = 'BolioUIBarsList'
const BarsList = withScale(BarsListComponent)
export default BarsList
