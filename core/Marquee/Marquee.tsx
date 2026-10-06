import React from 'react'
import useScale, { withScale } from '../use-scale'
import useClasses from '../use-classes'
import styles from './Marquee.module.css'

interface Props {
  // seconds for one full loop
  duration?: number
  pauseOnHover?: boolean
  reverse?: boolean
  gap?: string
  className?: string
}

type NativeAttrs = Omit<React.HTMLAttributes<HTMLDivElement>, keyof Props>
export type MarqueeProps = Props & NativeAttrs

const MarqueeComponent = React.forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<MarqueeProps>
>(
  (
    {
      duration = 30,
      pauseOnHover = true,
      reverse = false,
      gap = '2rem',
      className = '',
      style,
      children,
      ...props
    },
    ref
  ) => {
    const { SCALES } = useScale()
    const marqueeStyle = {
      width: SCALES.width(1, '100%'),
      margin: `${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)} ${SCALES.ml(0)}`,
      '--marquee-duration': `${duration}s`,
      '--marquee-gap': gap,
      '--marquee-direction': reverse ? 'reverse' : 'normal',
      ...style
    } as React.CSSProperties

    return (
      <div
        ref={ref}
        className={useClasses(
          styles.marquee,
          { [styles.pause]: pauseOnHover },
          className
        )}
        style={marqueeStyle}
        {...props}
      >
        <div className={styles.track}>{children}</div>
        {/* the copy makes the loop seamless and is hidden from readers */}
        <div className={styles.track} aria-hidden>
          {children}
        </div>
      </div>
    )
  }
)

MarqueeComponent.displayName = 'BolioUIMarquee'
const Marquee = withScale(MarqueeComponent)
export default Marquee
