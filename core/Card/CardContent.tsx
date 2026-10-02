import React from 'react'
import useScale, { withScale } from '../use-scale'
import useClasses from '../use-classes'
import type { AnyElement } from '../utils/types'
import styles from './CardContent.module.css'

interface Props {
  className?: string
}

type NativeAttrs = Omit<React.HTMLAttributes<AnyElement>, keyof Props>
export type CardContentProps = Props & NativeAttrs

function CardContentComponent({
  className = '',
  children,
  style,
  ...props
}: CardContentProps) {
  const { SCALES } = useScale()

  const contentStyle: React.CSSProperties = {
    width: SCALES.width(1, '100%'),
    height: SCALES.height(1, 'auto'),
    padding: `${SCALES.pt(1)} ${SCALES.pr(1)} ${SCALES.pb(1)} ${SCALES.pl(1)}`,
    margin: `${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)} ${SCALES.ml(0)}`,
    ...style
  }

  return (
    <div
      className={useClasses('content', styles.content, className)}
      {...props}
      style={contentStyle}
    >
      {children}
    </div>
  )
}

CardContentComponent.displayName = 'BolioUICardContent'
const CardContent = withScale(CardContentComponent)
export default CardContent
