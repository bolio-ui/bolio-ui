import React, { useId, useState } from 'react'
import useTheme from '../use-theme'
import useScale, { withScale } from '../use-scale'
import useClasses from '../use-classes'
import useResizeObserver from '../use-resize-observer'
import styles from './Spoiler.module.css'

interface Props {
  // height in px of the content while it is collapsed
  maxHeight?: number
  showLabel?: string
  hideLabel?: string
  initialOpened?: boolean
  className?: string
}

type NativeAttrs = Omit<React.HTMLAttributes<HTMLDivElement>, keyof Props>
export type SpoilerProps = Props & NativeAttrs

const SpoilerComponent = React.forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<SpoilerProps>
>(
  (
    {
      maxHeight = 100,
      showLabel = 'Show more',
      hideLabel = 'Hide',
      initialOpened = false,
      className = '',
      style,
      children,
      ...props
    },
    ref
  ) => {
    const theme = useTheme()
    const { SCALES } = useScale()
    const [opened, setOpened] = useState(initialOpened)
    const [innerRef, { height }] = useResizeObserver<HTMLDivElement>()
    const contentId = useId()
    // the button shows only when the content does not fit
    const showToggle = opened || height > maxHeight

    const spoilerStyle = {
      width: SCALES.width(1, '100%'),
      margin: `${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)} ${SCALES.ml(0)}`,
      '--spoiler-link': theme.palette.link,
      ...style
    } as React.CSSProperties

    return (
      <div
        ref={ref}
        className={useClasses(styles.spoiler, className)}
        {...props}
        style={spoilerStyle}
      >
        <div
          id={contentId}
          className={styles.content}
          style={opened ? undefined : { maxHeight }}
        >
          <div ref={innerRef}>{children}</div>
        </div>
        {showToggle && (
          <button
            type="button"
            className={styles.toggle}
            aria-expanded={opened}
            aria-controls={contentId}
            onClick={() => setOpened(!opened)}
          >
            {opened ? hideLabel : showLabel}
          </button>
        )}
      </div>
    )
  }
)

SpoilerComponent.displayName = 'BolioUISpoiler'
const Spoiler = withScale(SpoilerComponent)
export default Spoiler
