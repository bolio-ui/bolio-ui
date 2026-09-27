import React from 'react'
import useScale, { withScale } from '../use-scale'
import type { AnyElement } from '../utils/types'

interface Props {
  className?: string
}

type NativeAttrs = Omit<React.HTMLAttributes<AnyElement>, keyof Props>
export type PageFooterProps = Props & NativeAttrs

function PageFooterComponent({
  children,
  ...props
}: React.PropsWithChildren<PageFooterProps>) {
  const { SCALES } = useScale()

  const footerStyle: React.CSSProperties = {
    fontSize: SCALES.font(1),
    width: SCALES.width(1, '100%'),
    height: SCALES.height(1, 'auto'),
    padding: `${SCALES.pt(0)} ${SCALES.pr(0)} ${SCALES.pb(0)} ${SCALES.pl(0)}`,
    margin: `${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)} ${SCALES.ml(0)}`
  }

  return (
    <footer {...props} style={footerStyle}>
      {children}
    </footer>
  )
}

PageFooterComponent.displayName = 'BolioUIPageFooter'
const PageFooter = withScale(PageFooterComponent)
export default PageFooter
