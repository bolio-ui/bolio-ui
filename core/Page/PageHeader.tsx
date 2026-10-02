import React from 'react'
import useScale, { withScale } from '../use-scale'
import useClasses from '../use-classes'
import type { AnyElement } from '../utils/types'
import styles from './PageHeader.module.css'

interface Props {
  center?: boolean
  className?: string
}

type NativeAttrs = Omit<React.HTMLAttributes<AnyElement>, keyof Props>
export type PageHeaderProps = Props & NativeAttrs

function PageHeaderComponent({
  children,
  center = false,
  className = '',
  style,
  ...props
}: React.PropsWithChildren<PageHeaderProps>) {
  const { SCALES } = useScale()
  const classes = useClasses({ [styles.center]: center }, className)

  const headerStyle: React.CSSProperties = {
    fontSize: SCALES.font(1),
    width: SCALES.width(1, '100%'),
    height: SCALES.height(1, 'auto'),
    padding: `${SCALES.pt(0)} ${SCALES.pr(0)} ${SCALES.pb(0)} ${SCALES.pl(0)}`,
    margin: `${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)} ${SCALES.ml(0)}`,
    ...style
  }

  return (
    <header className={classes} {...props} style={headerStyle}>
      {children}
    </header>
  )
}

PageHeaderComponent.displayName = 'BolioUIPageHeader'
const PageHeader = withScale(PageHeaderComponent)
export default PageHeader
