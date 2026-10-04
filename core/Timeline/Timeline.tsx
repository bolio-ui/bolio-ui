import React from 'react'
import useScale, { withScale } from '../use-scale'
import useClasses from '../use-classes'
import styles from './Timeline.module.css'

interface Props {
  className?: string
}

type NativeAttrs = Omit<React.HTMLAttributes<HTMLOListElement>, keyof Props>
export type TimelineProps = Props & NativeAttrs

const TimelineComponent = React.forwardRef<
  HTMLOListElement,
  React.PropsWithChildren<TimelineProps>
>(({ className = '', style, children, ...props }, ref) => {
  const { SCALES } = useScale()
  const timelineStyle: React.CSSProperties = {
    fontSize: SCALES.font(1),
    margin: `${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)} ${SCALES.ml(0)}`,
    ...style
  }
  return (
    <ol
      ref={ref}
      className={useClasses(styles.timeline, className)}
      style={timelineStyle}
      {...props}
    >
      {children}
    </ol>
  )
})

TimelineComponent.displayName = 'BolioUITimeline'
const Timeline = withScale(TimelineComponent)
export default Timeline
