import React from 'react'
import useScale, { withScale } from '../use-scale'
import useClasses from '../use-classes'

interface Props {
  center?: boolean
  className?: string
}

type NativeAttrs = Omit<React.HTMLAttributes<any>, keyof Props>
export type PageHeaderProps = Props & NativeAttrs

function PageHeaderComponent({
  children,
  center = false,
  className = '',
  ...props
}: React.PropsWithChildren<PageHeaderProps>) {
  const { SCALES } = useScale()
  const classes = useClasses({ center }, className)

  return (
    <header className={classes} {...props}>
      {children}
      <style jsx>{`
        header {
          font-size: ${SCALES.font(1)};
          width: ${SCALES.width(1, '100%')};
          height: ${SCALES.height(1, 'auto')};
          padding: ${SCALES.pt(0)} ${SCALES.pr(0)} ${SCALES.pb(0)}
            ${SCALES.pl(0)};
          margin: ${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)}
            ${SCALES.ml(0)};
        }

        .center {
          display: flex;
          justify-content: center;
          align-items: center;
        }
      `}</style>
    </header>
  )
}

PageHeaderComponent.displayName = 'BolioUIPageHeader'
const PageHeader = withScale(PageHeaderComponent)
export default PageHeader
