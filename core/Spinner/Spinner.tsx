import React from 'react'
import useTheme from '../use-theme'
import useScale, { withScale } from '../use-scale'
import useClasses from '../use-classes'
import type { AnyElement } from '../utils/types'
import styles from './Spinner.module.css'

interface Props {
  className?: string
}

type NativeAttrs = Omit<React.HTMLAttributes<AnyElement>, keyof Props>
export type SpinnerProps = Props & NativeAttrs

const SpinnerComponent = React.forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<SpinnerProps>
>(({ className = '', style, ...props }, ref) => {
  const theme = useTheme()
  const { SCALES } = useScale()

  const classes = useClasses(styles.spinner, className)

  const spinnerStyle = {
    width: SCALES.width(1.25),
    height: SCALES.height(1.25),
    padding: `${SCALES.pt(0)} ${SCALES.pr(0)} ${SCALES.pb(0)} ${SCALES.pl(0)}`,
    margin: `${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)} ${SCALES.ml(0)}`,
    '--spinner-color': theme.palette.foreground,
    '--spinner-radius': theme.layout.radius,
    ...style
  } as React.CSSProperties

  return (
    <div
      ref={ref}
      role="status"
      className={classes}
      {...props}
      style={spinnerStyle}
    >
      <div className={styles.container}>
        {[...new Array(12)].map((_, index) => (
          <span key={`spinner-${index}`} />
        ))}
      </div>
    </div>
  )
})

SpinnerComponent.displayName = 'BolioUISpinner'
const Spinner = withScale(SpinnerComponent)
export default Spinner
