import React, { CSSProperties, useEffect, useMemo, useState } from 'react'
import useTheme from '../use-theme'
import PageContent from './PageContent'
import { hasChild } from '../utils/collections'
import useScale, { withScale } from '../use-scale'
import { joinClasses } from '../use-classes'
import type { AnyElement } from '../utils/types'
import styles from './Page.module.css'

export type PageRenderMode = 'default' | 'effect' | 'effect-seo'

interface Props {
  render?: PageRenderMode
  dotBackdrop?: boolean
  dotSize?: CSSProperties['fontSize']
  dotSpace?: number
}

export type DotStylesProps = {
  dotSize: CSSProperties['fontSize']
  dotSpace: number
}

const DotStyles: React.FC<DotStylesProps> = ({ dotSpace, dotSize }) => {
  const background = useMemo(
    () => ({
      position: `calc(${dotSpace} * 25px)`,
      size: `calc(${dotSpace} * 50px)`
    }),
    [dotSpace]
  )
  return (
    <span>
      <style>{`
        body {
          background-image:
            radial-gradient(#e3e3e3 ${dotSize}, transparent 0),
            radial-gradient(#e3e3e3 ${dotSize}, transparent 0);
          background-position:
            0 0,
            ${background.position} ${background.position};
          background-attachment: fixed;
          background-size: ${background.size} ${background.size};
        }
      `}</style>
    </span>
  )
}

type NativeAttrs = Omit<React.HTMLAttributes<AnyElement>, keyof Props>
export type PageProps = Props & NativeAttrs
const PageComponent = React.forwardRef<
  HTMLElement,
  React.PropsWithChildren<PageProps>
>(
  (
    {
      children,
      render = 'default' as PageRenderMode,
      dotBackdrop = false,
      className,
      dotSize = '1px' as CSSProperties['fontSize'],
      dotSpace = 1,
      style,
      ...props
    },
    ref
  ) => {
    const theme = useTheme()
    const { SCALES } = useScale()

    const showDot = useMemo<boolean>(() => {
      if (theme.type === 'dark') return false
      return dotBackdrop
    }, [dotBackdrop, theme.type])

    const [preventRender, setPreventRender] = useState<boolean>(
      render !== 'default'
    )

    useEffect(() => {
      setPreventRender(false)
    }, [])

    if (preventRender) {
      const renderSEO = render === 'effect-seo'
      if (!renderSEO) return null

      return (
        <div className={styles.hidden} aria-hidden="true">
          {children}
        </div>
      )
    }

    const hasContent = hasChild(children, PageContent)

    const sectionStyle: React.CSSProperties = {
      fontSize: SCALES.font(1),
      height: SCALES.height(1, 'auto'),
      ...style
    }

    return (
      <section
        className={joinClasses(styles.section, className)}
        ref={ref}
        {...props}
        style={sectionStyle}
      >
        {hasContent ? children : <PageContent>{children}</PageContent>}
        {showDot && <DotStyles dotSize={dotSize} dotSpace={dotSpace} />}
      </section>
    )
  }
)

PageComponent.displayName = 'BolioUIPage'
const Page = withScale(PageComponent)
export default Page
