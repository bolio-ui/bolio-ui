import React, { useEffect, useRef, useState } from 'react'
import useTheme from '../use-theme'
import useScale, { withScale } from '../use-scale'
import useClasses from '../use-classes'
import styles from './Carousel.module.css'

interface Props {
  // slides in view at once
  slidesToShow?: number
  // space between slides, any CSS length
  gap?: string
  controls?: boolean
  indicators?: boolean
  // first slide in view, to control it
  value?: number
  initialValue?: number
  onChange?: (index: number) => void
  previousLabel?: string
  nextLabel?: string
  slideLabel?: (index: number, count: number) => string
  indicatorLabel?: (index: number) => string
  className?: string
}

type NativeAttrs = Omit<React.HTMLAttributes<HTMLDivElement>, keyof Props>
export type CarouselProps = Props & NativeAttrs

const CarouselComponent = React.forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<CarouselProps>
>(
  (
    {
      slidesToShow = 1,
      gap = '1rem',
      controls = true,
      indicators = true,
      value,
      initialValue = 0,
      onChange,
      previousLabel = 'Previous slide',
      nextLabel = 'Next slide',
      slideLabel = (index, count) => `${index + 1} of ${count}`,
      indicatorLabel = (index) => `Go to slide ${index + 1}`,
      className = '',
      children,
      style,
      ...props
    },
    ref
  ) => {
    const theme = useTheme()
    const { SCALES } = useScale()
    const slides = React.Children.toArray(children).filter(React.isValidElement)
    const visible = Math.max(1, Math.floor(slidesToShow))
    // the positions the first slide in view can take
    const positions = Math.max(1, slides.length - visible + 1)

    const viewport = useRef<HTMLDivElement>(null)
    const settle = useRef<number | undefined>(undefined)
    const [selfIndex, setSelfIndex] = useState(initialValue)
    const isControlled = value !== undefined
    const index = Math.min(isControlled ? value : selfIndex, positions - 1)
    const latest = useRef(index)
    latest.current = index

    const commit = (next: number) => {
      if (next === latest.current) return
      latest.current = next
      if (!isControlled) setSelfIndex(next)
      if (onChange) onChange(next)
    }

    // setting scrollLeft follows the scroll-behavior of the CSS, which is
    // smooth unless the user asked for less motion
    const scrollTo = (next: number) => {
      const element = viewport.current?.children[next] as
        HTMLElement | undefined
      if (viewport.current && element)
        viewport.current.scrollLeft = element.offsetLeft
    }

    const go = (next: number) => {
      const target = Math.max(0, Math.min(next, positions - 1))
      scrollTo(target)
      commit(target)
    }

    // the slide the scroll rests on is the current one, reported once it stops
    const scrollHandler = () => {
      window.clearTimeout(settle.current)
      settle.current = window.setTimeout(() => {
        const element = viewport.current
        if (!element) return
        const offsets = Array.from(element.children).map(
          (child) => (child as HTMLElement).offsetLeft
        )
        const closest = offsets.reduce(
          (best, offset, position) =>
            Math.abs(offset - element.scrollLeft) <
            Math.abs(offsets[best] - element.scrollLeft)
              ? position
              : best,
          0
        )
        commit(Math.min(closest, positions - 1))
      }, 100)
    }

    useEffect(() => () => window.clearTimeout(settle.current), [])

    // a new value from outside moves the scroll
    useEffect(() => {
      if (value !== undefined) scrollTo(Math.min(value, positions - 1))
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value])

    const carouselStyle = {
      width: SCALES.width(1, '100%'),
      margin: `${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)} ${SCALES.ml(0)}`,
      fontSize: SCALES.font(0.875),
      '--carousel-visible': visible,
      '--carousel-gap': gap,
      '--carousel-border': theme.palette.accents_2,
      '--carousel-color': theme.palette.accents_6,
      '--carousel-hover-bg': theme.palette.accents_1,
      '--carousel-dot': theme.palette.accents_3,
      '--carousel-dot-active': theme.palette.foreground,
      '--carousel-focus': theme.palette.primary,
      '--carousel-radius': theme.layout.radius,
      ...style
    } as React.CSSProperties

    const showFooter = positions > 1 && (controls || indicators)

    return (
      <div
        ref={ref}
        role="region"
        aria-roledescription="carousel"
        className={useClasses(styles.carousel, className)}
        {...props}
        style={carouselStyle}
      >
        <div
          ref={viewport}
          className={styles.viewport}
          tabIndex={0}
          onScroll={scrollHandler}
        >
          {slides.map((slide, position) => (
            <div
              key={slide.key ?? position}
              role="group"
              aria-roledescription="slide"
              aria-label={slideLabel(position, slides.length)}
              className={styles.slide}
            >
              {slide}
            </div>
          ))}
        </div>
        {showFooter && (
          <div className={styles.footer}>
            {controls && (
              <button
                type="button"
                className={styles.control}
                aria-label={previousLabel}
                disabled={index === 0}
                onClick={() => go(index - 1)}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="1.25em"
                  height="1.25em"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M15 6l-6 6 6 6" />
                </svg>
              </button>
            )}
            {indicators && (
              <div className={styles.indicators}>
                {Array.from({ length: positions }, (_, position) => (
                  <button
                    key={position}
                    type="button"
                    className={styles.indicator}
                    aria-label={indicatorLabel(position)}
                    aria-current={position === index || undefined}
                    onClick={() => go(position)}
                  />
                ))}
              </div>
            )}
            {controls && (
              <button
                type="button"
                className={styles.control}
                aria-label={nextLabel}
                disabled={index === positions - 1}
                onClick={() => go(index + 1)}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="1.25em"
                  height="1.25em"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>
    )
  }
)

CarouselComponent.displayName = 'BolioUICarousel'
const Carousel = withScale(CarouselComponent)
export default Carousel
