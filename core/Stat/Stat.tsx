import React from 'react'
import useTheme from '../use-theme'
import useScale, { withScale } from '../use-scale'
import useClasses from '../use-classes'
import styles from './Stat.module.css'

interface Props {
  label: React.ReactNode
  value: React.ReactNode
  // trend text such as "+12.4%"; a leading "-" is shown as a drop
  change?: string
  // small chart or icon on the right
  extra?: React.ReactNode
  className?: string
}

type NativeAttrs = Omit<React.HTMLAttributes<HTMLDivElement>, keyof Props>
export type StatProps = Props & NativeAttrs

const StatComponent = React.forwardRef<HTMLDivElement, StatProps>(
  ({ label, value, change, extra, className = '', style, ...props }, ref) => {
    const theme = useTheme()
    const { SCALES } = useScale()
    const down = change?.trim().startsWith('-')

    const statStyle: React.CSSProperties = {
      width: SCALES.width(1, 'auto'),
      margin: `${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)} ${SCALES.ml(0)}`,
      ...style
    }

    return (
      <div
        ref={ref}
        className={useClasses(styles.stat, className)}
        style={statStyle}
        {...props}
      >
        <div>
          <div
            className={styles.label}
            style={{ color: theme.palette.accents_5 }}
          >
            {label}
          </div>
          <div className={styles.value}>{value}</div>
          {change && (
            <div
              className={styles.change}
              style={{
                color: down ? theme.palette.error : theme.palette.success
              }}
            >
              {change}
            </div>
          )}
        </div>
        {extra && <div className={styles.extra}>{extra}</div>}
      </div>
    )
  }
)

StatComponent.displayName = 'BolioUIStat'
const Stat = withScale(StatComponent)
export default Stat
