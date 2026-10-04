import React from 'react'
import useTheme from '../use-theme'
import useScale, { withScale } from '../use-scale'
import useClasses from '../use-classes'
import styles from './EmptyState.module.css'

interface Props {
  icon?: React.ReactNode
  title: React.ReactNode
  // what to do next, so the user can leave the empty state
  description?: React.ReactNode
  // usually a Button
  action?: React.ReactNode
  className?: string
}

type NativeAttrs = Omit<React.HTMLAttributes<HTMLDivElement>, keyof Props>
export type EmptyStateProps = Props & NativeAttrs

const EmptyStateComponent = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  (
    { icon, title, description, action, className = '', style, ...props },
    ref
  ) => {
    const theme = useTheme()
    const { SCALES } = useScale()

    const emptyStyle: React.CSSProperties = {
      width: SCALES.width(1, '100%'),
      padding: `${SCALES.pt(2)} ${SCALES.pr(1)} ${SCALES.pb(2)} ${SCALES.pl(1)}`,
      margin: `${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)} ${SCALES.ml(0)}`,
      ...style
    }

    return (
      <div
        ref={ref}
        className={useClasses(styles.empty, className)}
        style={emptyStyle}
        {...props}
      >
        {icon && (
          <div
            className={styles.icon}
            style={{
              color: theme.palette.accents_5,
              backgroundColor: theme.palette.accents_2
            }}
          >
            {icon}
          </div>
        )}
        <div className={styles.title}>{title}</div>
        {description && (
          <div
            className={styles.description}
            style={{ color: theme.palette.accents_5 }}
          >
            {description}
          </div>
        )}
        {action && <div className={styles.action}>{action}</div>}
      </div>
    )
  }
)

EmptyStateComponent.displayName = 'BolioUIEmptyState'
const EmptyState = withScale(EmptyStateComponent)
export default EmptyState
