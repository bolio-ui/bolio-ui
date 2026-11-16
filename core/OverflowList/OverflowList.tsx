import React, { useRef, useState } from 'react'
import useScale, { withScale } from '../use-scale'
import useClasses from '../use-classes'
import useIsomorphicEffect from '../use-isomorphic-effect'
import styles from './OverflowList.module.css'

interface Props<T> {
  data: T[]
  renderItem: (item: T, index: number) => React.ReactNode
  // what takes the place of the items that do not fit, such as "+3"
  renderOverflow: (hidden: T[]) => React.ReactNode
  // pixels between two items
  gap?: number
  className?: string
}

type NativeAttrs = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  keyof Props<unknown>
>
export type OverflowListProps<T = unknown> = Props<T> & NativeAttrs

const OverflowListComponent = React.forwardRef<
  HTMLDivElement,
  OverflowListProps<unknown>
>(
  (
    {
      data,
      renderItem,
      renderOverflow,
      gap = 8,
      className = '',
      style,
      ...props
    },
    ref
  ) => {
    const { SCALES } = useScale()
    const root = useRef<HTMLDivElement | null>(null)
    const probe = useRef<HTMLDivElement>(null)
    const [count, setCount] = useState(data.length)

    // The probe holds every item and the widest overflow, out of sight, and
    // is measured to find how many items fit next to the overflow.
    useIsomorphicEffect(() => {
      const element = root.current
      const hidden = probe.current
      if (!element || !hidden) return
      hidden.inert = true
      const measure = () => {
        const available = element.getBoundingClientRect().width
        const widths = Array.from(
          hidden.querySelectorAll<HTMLElement>('[data-item]')
        ).map((item) => item.getBoundingClientRect().width)
        const overflow =
          hidden
            .querySelector<HTMLElement>('[data-overflow]')
            ?.getBoundingClientRect().width || 0
        const total = widths.reduce(
          (sum, width, index) => sum + width + (index ? gap : 0),
          0
        )
        if (total <= available) return setCount(widths.length)
        let used = overflow
        let fits = 0
        for (const width of widths) {
          used += gap + width
          if (used > available) break
          fits += 1
        }
        setCount(fits)
      }
      measure()
      if (typeof ResizeObserver === 'undefined') return
      const observer = new ResizeObserver(measure)
      observer.observe(element)
      return () => observer.disconnect()
    }, [data, gap, renderItem, renderOverflow])

    const shown = Math.min(count, data.length)
    const rowStyle = { gap } as React.CSSProperties
    return (
      <div
        ref={(element) => {
          root.current = element
          if (typeof ref === 'function') ref(element)
          else if (ref) ref.current = element
        }}
        className={useClasses(styles.root, className)}
        style={{ width: SCALES.width(1, '100%'), ...rowStyle, ...style }}
        {...props}
      >
        {data.slice(0, shown).map((item, index) => (
          <React.Fragment key={index}>{renderItem(item, index)}</React.Fragment>
        ))}
        {shown < data.length && (
          <div className={styles.overflow}>
            {renderOverflow(data.slice(shown))}
          </div>
        )}
        <div
          ref={probe}
          className={styles.probe}
          style={rowStyle}
          aria-hidden="true"
        >
          {data.map((item, index) => (
            <div key={index} data-item="" className={styles.measure}>
              {renderItem(item, index)}
            </div>
          ))}
          <div data-overflow="" className={styles.measure}>
            {renderOverflow(data)}
          </div>
        </div>
      </div>
    )
  }
)

OverflowListComponent.displayName = 'BolioUIOverflowList'
const OverflowList = withScale(OverflowListComponent) as unknown as (<T>(
  props: OverflowListProps<T> & React.RefAttributes<HTMLDivElement>
) => React.ReactElement | null) & { displayName?: string }
export default OverflowList
