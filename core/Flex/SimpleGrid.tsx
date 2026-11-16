import React from 'react'
import useClasses from '../use-classes'

interface Props {
  // fixed number of equal columns
  cols?: number
  // as many columns as fit, none narrower than this width in px; wins over cols
  minChildWidth?: number
  // space between the cells, in rem
  gap?: number
  className?: string
}

type NativeAttrs = Omit<React.HTMLAttributes<HTMLDivElement>, keyof Props>
export type SimpleGridProps = Props & NativeAttrs

const SimpleGrid = React.forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<SimpleGridProps>
>(
  (
    { cols = 1, minChildWidth, gap = 1, className = '', style, ...props },
    ref
  ) => (
    <div
      ref={ref}
      className={useClasses(className)}
      style={{
        display: 'grid',
        gridTemplateColumns: minChildWidth
          ? `repeat(auto-fit, minmax(min(${minChildWidth}px, 100%), 1fr))`
          : `repeat(${cols}, minmax(0, 1fr))`,
        gap: `${gap}rem`,
        ...style
      }}
      {...props}
    />
  )
)

SimpleGrid.displayName = 'BolioUISimpleGrid'
export default SimpleGrid
