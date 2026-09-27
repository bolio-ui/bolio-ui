import React from 'react'
import useTheme from '../use-theme'
import useScale, { withScale } from '../use-scale'
import useClasses from '../use-classes'

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
      ...props
    },
    ref
  ) => {
    const theme = useTheme()
    const { SCALES } = useScale()
    const hasChildren = children !== undefined && children !== null
    const classes = useClasses('skeleton', { circle }, className)

    if (hasChildren && !loading) return <>{children}</>

    const width = SCALES.width(1, circle ? '2.5em' : '100%')
    // a circle is as tall as it is wide unless `height` says otherwise
    const height = SCALES.height(1, circle ? width : '1em')
    const count = circle ? 1 : Math.max(1, Math.floor(lines))

    return (
      <div
        ref={ref}
        className={classes}
        // what is loading is announced by the container, not by the shapes
        aria-busy={hasChildren || undefined}
        aria-hidden={hasChildren ? undefined : true}
        {...props}
      >
        {[...Array(count)].map((_, index) => (
          <span
            key={index}
            className="shape"
            aria-hidden={hasChildren || undefined}
          />
        ))}
        <style jsx>{`
          .skeleton {
            display: flex;
            flex-direction: column;
            gap: 0.5em;
            box-sizing: border-box;
            width: ${width};
            margin: ${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)}
              ${SCALES.ml(0)};
          }
          .shape {
            display: block;
            width: 100%;
            height: ${height};
            border-radius: ${theme.layout.radius};
            background: linear-gradient(
              90deg,
              ${theme.palette.accents_1} 25%,
              ${theme.palette.accents_2} 37%,
              ${theme.palette.accents_1} 63%
            );
            background-size: 400% 100%;
            animation: shimmer 1.4s ease infinite;
          }
          .shape:last-child:not(:first-child) {
            width: 60%;
          }
          .circle .shape {
            border-radius: 50%;
          }
          @keyframes shimmer {
            from {
              background-position: 100% 50%;
            }
            to {
              background-position: 0 50%;
            }
          }
          @media (prefers-reduced-motion: reduce) {
            .shape {
              animation: none;
              background: ${theme.palette.accents_2};
            }
          }
        `}</style>
      </div>
    )
  }
)

SkeletonComponent.displayName = 'BolioUISkeleton'
const Skeleton = withScale(SkeletonComponent)
export default Skeleton
