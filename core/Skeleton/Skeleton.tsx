import React from 'react'
import useTheme from '../use-theme'
import useScale, { withScale } from '../use-scale'
import useClasses from '../use-classes'
import styles from './Skeleton.module.css'

interface Props {
  // number of text lines; the last one is shorter
  lines?: number
  circle?: boolean
  // with children: the placeholder while true, the children after
  loading?: boolean
  className?: string
}

type NativeAttrs = Omit<React.HTMLAttributes<HTMLDivElement>, keyof Props>
export type SkeletonProps = Props & NativeAttrs

const SkeletonComponent = React.forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<SkeletonProps>
>(
  (
    {
      lines = 1,
      circle = false,
      loading = true,
      className = '',
      children,
      style,
      ...props
    },
    ref
  ) => {
    const theme = useTheme()
    const { SCALES } = useScale()
    const hasChildren = children !== undefined && children !== null
    const classes = useClasses(
      styles.skeleton,
      { [styles.circle]: circle },
      className
    )

    if (hasChildren && !loading) return <>{children}</>

    const width = SCALES.width(1, circle ? '2.5em' : '100%')
    // a circle is as tall as it is wide unless `height` says otherwise
    const height = SCALES.height(1, circle ? width : '1em')
    const count = circle ? 1 : Math.max(1, Math.floor(lines))

    const skeletonStyle: React.CSSProperties = {
      width,
      margin: `${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)} ${SCALES.ml(0)}`,
      ...style
    }

    const shapeStyle = {
      height,
      borderRadius: theme.layout.radius,
      '--skeleton-shimmer-1': theme.palette.accents_1,
      '--skeleton-shimmer-2': theme.palette.accents_2
    } as React.CSSProperties

    return (
      <div
        ref={ref}
        className={classes}
        // what is loading is announced by the container, not by the shapes
        aria-busy={hasChildren || undefined}
        aria-hidden={hasChildren ? undefined : true}
        {...props}
        style={skeletonStyle}
      >
        {[...Array(count)].map((_, index) => (
          <span
            key={index}
            className={styles.shape}
            style={shapeStyle}
            aria-hidden={hasChildren || undefined}
          />
        ))}
      </div>
    )
  }
)

SkeletonComponent.displayName = 'BolioUISkeleton'
const Skeleton = withScale(SkeletonComponent)
export default Skeleton
