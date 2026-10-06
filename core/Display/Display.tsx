import React, { ReactNode, useMemo } from 'react'
import useTheme from '../use-theme'
import useScale, { withScale } from '../use-scale'
import useClasses from '../use-classes'
import type { AnyElement } from '../utils/types'
import styles from './Display.module.css'

interface Props {
  caption?: ReactNode | string
  shadow?: boolean
  className?: string
}

type NativeAttrs = Omit<React.HTMLAttributes<AnyElement>, keyof Props>
export type DisplayProps = Props & NativeAttrs

const DisplayComponent = React.forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<DisplayProps>
>(
  (
    {
      children,
      caption = '' as ReactNode | string,
      shadow = false,
      className = '',
      style,
      ...props
    },
    ref
  ) => {
    const theme = useTheme()
    const { SCALES } = useScale()
    const classes = useClasses(styles.display, className)
    const showShadow = useMemo(
      () => shadow && theme.type !== 'dark',
      [theme.type, shadow]
    )

    const displayStyle: React.CSSProperties = {
      fontSize: SCALES.font(0.875),
      width: SCALES.width(1, '100%'),
      height: SCALES.height(1, 'auto'),
      padding: `${SCALES.pt(0)} ${SCALES.pr(0)} ${SCALES.pb(0)} ${SCALES.pl(0)}`,
      margin: `${SCALES.mt(2.5)} ${SCALES.mr(0, 'auto')} ${SCALES.mb(2.5)} ${SCALES.ml(0, 'auto')}`,
      ...style
    }

    return (
      <div ref={ref} className={classes} {...props} style={displayStyle}>
        <div
          className={styles.content}
          style={{
            width: SCALES.width(1, 'max-content'),
            boxShadow: showShadow ? theme.expressiveness.shadowLarge : 'none'
          }}
        >
          {children}
        </div>
        <div
          className={styles.caption}
          style={{
            color: theme.palette.accents_5,
            margin: `${shadow ? '2.5em' : '1.3em'} auto 0`
          }}
        >
          {caption}
        </div>
      </div>
    )
  }
)

DisplayComponent.displayName = 'BolioUIDisplay'
const Display = withScale(DisplayComponent)
export default Display
