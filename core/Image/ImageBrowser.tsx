import React, { useMemo } from 'react'
import Link from '../Link'
import { Props as LinkProps } from '../Link/Link'
import useTheme from '../use-theme'
import ImageBrowserHttpsIcon from './ImageBrowserHttpsIcon'
import { getBrowserColors, BrowserColors } from './styles'
import { getHostFromUrl } from './helpers'
import useScale, { withScale } from '../use-scale'
import useClasses from '../use-classes'
import type { AnyElement } from '../utils/types'
import styles from './ImageBrowser.module.css'

export type ImageAnchorProps = Omit<
  React.AnchorHTMLAttributes<AnyElement>,
  keyof LinkProps
>

interface Props {
  title?: string
  url?: string
  showFullLink?: boolean
  invert?: boolean
  anchorProps?: ImageAnchorProps
  className?: string
}

type NativeAttrs = Omit<React.HTMLAttributes<AnyElement>, keyof Props>
export type ImageBrowserProps = Props & NativeAttrs

const getTitle = (title: string, colors: BrowserColors) => (
  <div className={styles.title} style={{ color: colors.titleColor }}>
    {title}
  </div>
)

const getAddressInput = (
  url: string,
  showFullLink: boolean,
  colors: BrowserColors,
  anchorProps: ImageAnchorProps
) => (
  <div
    className={styles.addressInput}
    style={{ backgroundColor: colors.inputBgColor }}
  >
    <span className={styles.https}>
      <ImageBrowserHttpsIcon />
    </span>
    <Link href={url} title={url} target="_blank" {...anchorProps}>
      {showFullLink ? url : getHostFromUrl(url)}
    </Link>
  </div>
)

const ImageBrowserComponent = React.forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<ImageBrowserProps>
>(
  (
    {
      url,
      title,
      children,
      showFullLink = false,
      invert = false,
      anchorProps = {} as ImageAnchorProps,
      className = '',
      style,
      ...props
    }: React.PropsWithChildren<ImageBrowserProps>,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const theme = useTheme()
    const { SCALES } = useScale()

    const colors = useMemo(
      () => getBrowserColors(invert, theme.palette),
      [invert, theme.palette]
    )

    const input = useMemo(() => {
      if (url) return getAddressInput(url, showFullLink, colors, anchorProps)
      if (title) return getTitle(title, colors)
      return null
    }, [url, showFullLink, title, colors, anchorProps])

    const browserStyle: React.CSSProperties = {
      boxShadow: theme.expressiveness.shadowLarge,
      borderRadius: theme.layout.radius,
      fontSize: SCALES.font(1),
      width: SCALES.width(1, 'max-content'),
      height: SCALES.height(1, 'auto'),
      margin: `${SCALES.mt(0)} ${SCALES.mr(0, 'auto')} ${SCALES.mb(0)} ${SCALES.ml(0, 'auto')}`,
      padding: `${SCALES.pt(0)} ${SCALES.pr(0)} ${SCALES.pb(0)} ${SCALES.pl(0)}`,
      ...style
    }

    return (
      <div
        className={useClasses(styles.browser, className)}
        ref={ref}
        {...props}
        style={browserStyle}
      >
        <header
          className={styles.header}
          style={{
            color: colors.color,
            backgroundColor: colors.barBgColor,
            borderBottom: `1px solid ${colors.borderColor}`
          }}
        >
          <div
            className={styles.traffic}
            style={{ left: theme.layout.gapHalf }}
          >
            <span className={styles.close} />
            <span className={styles.mini} />
            <span className={styles.full} />
          </div>
          {input}
        </header>
        {children}
      </div>
    )
  }
)

ImageBrowserComponent.displayName = 'BolioUIImageBrowser'
const ImageBrowser = withScale(ImageBrowserComponent)
export default ImageBrowser
