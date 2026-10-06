import React from 'react'
import useTheme from '../use-theme'
import useScale, { withScale } from '../use-scale'
import useClasses from '../use-classes'
import type { AnyElement } from '../utils/types'
import styles from './CardFooter.module.css'

interface Props {
  disableAutoMargin?: boolean
  className?: string
}

type NativeAttrs = Omit<React.HTMLAttributes<AnyElement>, keyof Props>
export type CardFooterProps = Props & NativeAttrs

function CardFooterComponent({
  children,
  className = '',
  disableAutoMargin = false,
  style,
  ...props
}: CardFooterProps) {
  const theme = useTheme()
  const { SCALES } = useScale()

  const classes = useClasses(
    styles.footer,
    {
      [styles.autoMargin]: !disableAutoMargin
    },
    className
  )

  const footerStyle = {
    padding: `${SCALES.py(0.66)} ${SCALES.px(1.31)}`,
    fontSize: SCALES.font(0.875),
    borderTop: `1px solid ${theme.palette.border}`,
    borderBottomLeftRadius: theme.layout.radius,
    borderBottomRightRadius: theme.layout.radius,
    minHeight: SCALES.height(3.3),
    width: SCALES.width(1, 'auto'),
    height: SCALES.height(1, 'auto'),
    margin: `${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)} ${SCALES.ml(0)}`,
    '--card-footer-gap': theme.layout.gapQuarter,
    ...style
  } as React.CSSProperties

  return (
    <footer className={classes} {...props} style={footerStyle}>
      {children}
    </footer>
  )
}

CardFooterComponent.displayName = 'BolioUICardFooter'
const CardFooter = withScale(CardFooterComponent)
export default CardFooter
