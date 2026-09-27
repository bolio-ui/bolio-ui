import React from 'react'
import useScale, { withScale } from '../use-scale'

interface Props {
  inline?: boolean
  className?: string
}

type NativeAttrs = Omit<React.HTMLAttributes<unknown>, keyof Props>
export type SpacerProps = Props & NativeAttrs

const SpacerComponent = React.forwardRef<HTMLSpanElement, SpacerProps>(
  ({ inline = false, className = '', style, ...props }, ref) => {
    const { SCALES } = useScale()

    const dynamicStyle: React.CSSProperties = {
      display: inline ? 'inline-block' : 'block',
      width: SCALES.width(1),
      height: SCALES.height(1),
      padding: `${SCALES.pt(0)} ${SCALES.pr(0)} ${SCALES.pb(0)} ${SCALES.pl(0)}`,
      margin: `${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)} ${SCALES.ml(0)}`,
      ...style
    }

    return (
      <span ref={ref} className={className} style={dynamicStyle} {...props} />
    )
  }
)

SpacerComponent.displayName = 'BolioUISpacer'
const Spacer = withScale(SpacerComponent)
export default Spacer
