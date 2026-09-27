import React from 'react'
import useTheme from '../use-theme'
import useScale, { withScale } from '../use-scale'
import type { AnyElement } from '../utils/types'
import styles from './FieldsetFooter.module.css'

interface Props {
  className?: string
}

type NativeAttrs = Omit<React.HTMLAttributes<AnyElement>, keyof Props>
export type FieldsetFooterProps = Props & NativeAttrs

function FieldsetFooterComponent({
  className = '',
  children,
  ...props
}: React.PropsWithChildren<FieldsetFooterProps>) {
  const theme = useTheme()
  const { SCALES } = useScale()

  const footerStyle: React.CSSProperties = {
    backgroundColor: theme.palette.accents_1,
    borderTop: `1px solid ${theme.palette.border}`,
    borderBottomLeftRadius: theme.layout.radius,
    borderBottomRightRadius: theme.layout.radius,
    color: theme.palette.accents_6,
    fontSize: SCALES.font(0.875),
    width: SCALES.width(1, 'auto'),
    height: SCALES.height(2.875),
    padding: `${SCALES.pt(0.625)} ${SCALES.pr(1.31)} ${SCALES.pb(0.625)} ${SCALES.pl(1.31)}`,
    margin: `${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)} ${SCALES.ml(0)}`
  }

  return (
    <footer
      className={`${styles.footer} ${className}`.trim()}
      {...props}
      style={footerStyle}
    >
      {children}
    </footer>
  )
}

FieldsetFooterComponent.displayName = 'BolioUIFieldsetFooter'
const FieldsetFooter = withScale(FieldsetFooterComponent)
export default FieldsetFooter
