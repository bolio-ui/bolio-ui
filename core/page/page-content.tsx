import React from 'react'
import useScale, { withScale } from '../use-scale'

interface Props {
  className?: string
}

type NativeAttrs = Omit<React.HTMLAttributes<any>, keyof Props>
export type PageContentProps = Props & NativeAttrs

function PageContentComponent({
  className,
  children,
  ...props
}: React.PropsWithChildren<PageContentProps>) {
  const { SCALES } = useScale()

  return (
    <main className={className} {...props}>
      {children}
      <style jsx>{`
        main {
          font-size: ${SCALES.font(1)};
          width: ${SCALES.width(1, '100%')};
          height: ${SCALES.height(1, '100%')};
          padding: ${SCALES.pt(3.125)} ${SCALES.pr(0)} ${SCALES.pb(3.125)}
            ${SCALES.pl(0)};
          margin: ${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)}
            ${SCALES.ml(0)};
        }
      `}</style>
    </main>
  )
}

PageContentComponent.displayName = 'BolioUIPageContent'
const PageContent = withScale(PageContentComponent)
export default PageContent
