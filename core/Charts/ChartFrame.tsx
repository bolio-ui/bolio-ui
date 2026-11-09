import React from 'react'
import { ResponsiveContainer } from 'recharts'
import useScale from '../use-scale'
import useClasses from '../use-classes'

interface Props {
  height: number
  className?: string
  children: React.ReactElement
}

// The root every Recharts based chart shares: the scale props, a name that
// makes it a group, and a container that follows the width of the parent.
const ChartFrame = React.forwardRef<
  HTMLDivElement,
  Props & React.HTMLAttributes<HTMLDivElement>
>(({ height, className = '', style, children, ...props }, ref) => {
  const { SCALES } = useScale()
  const rootStyle: React.CSSProperties = {
    width: SCALES.width(1, '100%'),
    padding: `${SCALES.pt(0)} ${SCALES.pr(0)} ${SCALES.pb(0)} ${SCALES.pl(0)}`,
    margin: `${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)} ${SCALES.ml(0)}`,
    ...style
  }

  return (
    <div
      ref={ref}
      // a name is only valid on an element with a role
      role={
        props['aria-label'] || props['aria-labelledby'] ? 'group' : undefined
      }
      className={useClasses(className)}
      style={rootStyle}
      {...props}
    >
      <ResponsiveContainer
        width="100%"
        height={height}
        initialDimension={{ width: 600, height }}
      >
        {children}
      </ResponsiveContainer>
    </div>
  )
})

ChartFrame.displayName = 'BolioUIChartFrame'
export default ChartFrame
