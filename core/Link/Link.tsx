import React from 'react'
import useTheme from '../use-theme'
import LinkIcon from './Icon'
import { addColorAlpha } from '../utils/color'
import useScale, { withScale } from '../use-scale'
import useClasses from '../use-classes'
import type { AnyElement } from '../utils/types'
import styles from './Link.module.css'

export interface Props {
  href?: string
  color?: boolean
  icon?: boolean
  underline?: boolean
  block?: boolean
  className?: string
}

type NativeAttrs = Omit<React.AnchorHTMLAttributes<AnyElement>, keyof Props>
export type LinkProps = Props & NativeAttrs

const LinkComponent = React.forwardRef<
  HTMLAnchorElement,
  React.PropsWithChildren<LinkProps>
>(
  (
    {
      href = '',
      color = false,
      underline = false,
      children,
      className = '',
      block = false,
      icon = false,
      style,
      ...props
    }: React.PropsWithChildren<LinkProps>,
    ref: React.Ref<HTMLAnchorElement>
  ) => {
    const theme = useTheme()
    const { SCALES } = useScale()

    const linkColor = color || block ? theme.palette.link : 'inherit'
    const hoverColor = color || block ? theme.palette.primary : 'inherit'
    const decoration = underline ? 'underline' : 'none'
    const classes = useClasses('link', styles.link, className)

    const linkStyle: React.CSSProperties = {
      color: linkColor,
      borderRadius: block ? theme.layout.radius : 0,
      fontSize: SCALES.font(1, 'inherit'),
      width: SCALES.width(1, 'fit-content'),
      height: SCALES.height(1, 'auto'),
      margin: block
        ? `${SCALES.mt(0)} ${SCALES.mr(-0.125)} ${SCALES.mb(0)} ${SCALES.ml(-0.125)}`
        : `${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)} ${SCALES.ml(0)}`,
      padding: block
        ? `${SCALES.pt(0.15)} ${SCALES.pr(0.4)} ${SCALES.pb(0.15)} ${SCALES.pl(0.4)}`
        : `${SCALES.pt(0)} ${SCALES.pr(0)} ${SCALES.pb(0)} ${SCALES.pl(0)}`,
      '--link-decoration': decoration,
      '--link-hover-bg': block ? addColorAlpha(theme.palette.link, 0.1) : 'unset',
      '--link-hover-color': hoverColor,
      ...style
    } as React.CSSProperties

    return (
      <a className={classes} href={href} {...props} ref={ref} style={linkStyle}>
        {children}
        {icon && <LinkIcon />}
      </a>
    )
  }
)

LinkComponent.displayName = 'BolioUILink'
const Link = withScale(LinkComponent)
export default Link
