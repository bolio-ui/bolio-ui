import React, { ReactNode, useMemo } from 'react'
import useTheme from '../use-theme'
import BreadcrumbsSeparator from './BreadcrumbsSeparator'
import { addColorAlpha } from '../utils/color'
import useScale, { withScale } from '../use-scale'
import type { AnyElement } from '../utils/types'
import styles from './Breadcrumbs.module.css'

interface Props {
  separator?: string | ReactNode
  className?: string
}

type NativeAttrs = Omit<React.HTMLAttributes<AnyElement>, keyof Props>
export type BreadcrumbsProps = Props & NativeAttrs

const BreadcrumbsComponent = React.forwardRef<
  HTMLElement,
  React.PropsWithChildren<BreadcrumbsProps>
>(({ separator = '/', children, className = '', style }, ref) => {
  const theme = useTheme()
  const { SCALES } = useScale()

  const hoverColor = useMemo(() => {
    return addColorAlpha(theme.palette.link, 0.85)
  }, [theme.palette.link])

  const navStyle: React.CSSProperties = {
    color: theme.palette.accents_5,
    fontSize: SCALES.font(1),
    width: SCALES.width(1, 'auto'),
    height: SCALES.height(1, 'auto'),
    padding: `${SCALES.pt(0)} ${SCALES.pr(0)} ${SCALES.pb(0)} ${SCALES.pl(0)}`,
    margin: `${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)} ${SCALES.ml(0)}`,
    '--breadcrumbs-hover-color': hoverColor,
    '--breadcrumbs-last-color': theme.palette.accents_7,
    ...style
  } as React.CSSProperties

  const childrenArray = React.Children.toArray(children)
  const withSeparatorChildren = childrenArray.map((item, index) => {
    if (!React.isValidElement(item)) return item
    const last = childrenArray[index - 1]
    const lastIsSeparator =
      React.isValidElement(last) && last.type === BreadcrumbsSeparator
    const currentIsSeparator = item.type === BreadcrumbsSeparator
    if (!lastIsSeparator && !currentIsSeparator && index > 0) {
      return (
        <React.Fragment key={index}>
          <BreadcrumbsSeparator>{separator}</BreadcrumbsSeparator>
          {item}
        </React.Fragment>
      )
    }
    return item
  })

  return (
    <nav
      ref={ref}
      className={`${styles.nav} ${className}`.trim()}
      style={navStyle}
    >
      {withSeparatorChildren}
    </nav>
  )
})

BreadcrumbsComponent.displayName = 'BolioUIBreadcrumbs'
const Breadcrumbs = withScale(BreadcrumbsComponent)
export default Breadcrumbs
