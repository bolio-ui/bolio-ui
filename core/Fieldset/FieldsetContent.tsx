import React from 'react'
import useScale, { withScale } from '../use-scale'
import useClasses from '../use-classes'
import type { AnyElement } from '../utils/types'
import styles from './FieldsetContent.module.css'

interface Props {
  className?: string
}

type NativeAttrs = Omit<React.HTMLAttributes<AnyElement>, keyof Props>
export type FieldsetContentProps = Props & NativeAttrs

function FieldsetContentComponent({
  className = '',
  children,
  style,
  ...props
}: React.PropsWithChildren<FieldsetContentProps>) {
  const { SCALES } = useScale()
  const classes = useClasses('content', styles.content, className)

  const contentStyle: React.CSSProperties = {
    width: SCALES.width(1, '100%'),
    height: SCALES.height(1, 'auto'),
    padding: `${SCALES.pt(1.3)} ${SCALES.pr(1.3)} ${SCALES.pb(1.3)} ${SCALES.pl(1.3)}`,
    margin: `${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)} ${SCALES.ml(0)}`,
    ...style
  }

  return (
    <div className={classes} {...props} style={contentStyle}>
      {children}
    </div>
  )
}

FieldsetContentComponent.displayName = 'BolioUIFieldsetContent'
const FieldsetContent = withScale(FieldsetContentComponent)
export default FieldsetContent
