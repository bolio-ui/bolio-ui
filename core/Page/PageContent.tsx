import React from 'react'
import useScale, { withScale } from '../use-scale'
import type { AnyElement } from '../utils/types'

interface Props {
  className?: string
}

type NativeAttrs = Omit<React.HTMLAttributes<AnyElement>, keyof Props>
export type PageContentProps = Props & NativeAttrs

function PageContentComponent({
  className,
  children,
  style,
  ...props
}: React.PropsWithChildren<PageContentProps>) {
  const { SCALES } = useScale()

  const mainStyle: React.CSSProperties = {
    fontSize: SCALES.font(1),
    width: SCALES.width(1, '100%'),
    height: SCALES.height(1, '100%'),
    padding: `${SCALES.pt(0)} ${SCALES.pr(0)} ${SCALES.pb(0)} ${SCALES.pl(0)}`,
    margin: `${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)} ${SCALES.ml(0)}`,
    ...style
  }

  return (
    <main className={className} {...props} style={mainStyle}>
      {children}
    </main>
  )
}

PageContentComponent.displayName = 'BolioUIPageContent'
const PageContent = withScale(PageContentComponent)
export default PageContent
