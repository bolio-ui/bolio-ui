import React, { useMemo } from 'react'
import useTheme from '../use-theme'
import useScale, { withScale } from '../use-scale'
import useClasses from '../use-classes'
import { getStatusColor } from '../Note/Note'
import type { NoteTypes } from '../Note'
import type { AnyElement } from '../utils/types'
import styles from './Alert.module.css'

interface Props {
  type?: NoteTypes
  // bold first line, shown above the children
  title?: React.ReactNode
  icon?: React.ReactNode
  filled?: boolean
  light?: boolean
  subtle?: boolean
  // shows a close button that calls it
  onClose?: () => void
  closeLabel?: string
  className?: string
}

type NativeAttrs = Omit<React.HTMLAttributes<AnyElement>, keyof Props>
export type AlertProps = Props & NativeAttrs

const AlertComponent = React.forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<AlertProps>
>(
  (
    {
      children,
      type = 'default' as NoteTypes,
      title,
      icon,
      filled = false,
      light = false,
      subtle = false,
      onClose,
      closeLabel = 'Close',
      className = '',
      style,
      ...props
    },
    ref
  ) => {
    const theme = useTheme()
    const { SCALES } = useScale()

    const { color, borderColor, bgColor } = useMemo(
      () => getStatusColor(type, { filled, light, subtle }, theme),
      [type, filled, light, subtle, theme]
    )

    const alertStyle: React.CSSProperties = {
      border: `1px solid ${borderColor}`,
      color,
      backgroundColor: bgColor,
      borderRadius: theme.layout.radius,
      fontSize: SCALES.font(0.875),
      width: SCALES.width(1, 'auto'),
      height: SCALES.height(1, 'auto'),
      padding: `${SCALES.pt(0.75)} ${SCALES.pr(1)} ${SCALES.pb(0.75)} ${SCALES.pl(1)}`,
      margin: `${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)} ${SCALES.ml(0)}`,
      ...style
    }

    return (
      <div
        ref={ref}
        // errors and warnings interrupt a screen reader, the rest wait
        role={type === 'error' || type === 'warning' ? 'alert' : 'status'}
        className={useClasses(styles.alert, className)}
        {...props}
        style={alertStyle}
      >
        {icon && (
          <span className={styles.icon} aria-hidden="true">
            {icon}
          </span>
        )}
        <div className={styles.body}>
          {title && <div className={styles.title}>{title}</div>}
          {children}
        </div>
        {onClose && (
          <button
            type="button"
            className={styles.close}
            aria-label={closeLabel}
            onClick={onClose}
          >
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    )
  }
)

AlertComponent.displayName = 'BolioUIAlert'
const Alert = withScale(AlertComponent)
export default Alert
