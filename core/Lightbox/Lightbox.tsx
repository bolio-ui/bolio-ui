import React, { useEffect, useRef } from 'react'
import useUncontrolled from '../use-uncontrolled'
import styles from './Lightbox.module.css'

export interface LightboxImage {
  src: string
  alt: string
  caption?: React.ReactNode
}

interface Props {
  images: LightboxImage[]
  opened: boolean
  // called when the user closes it, with Escape, the button or the dark area
  onClose: () => void
  // shown image, to control it
  index?: number
  initialIndex?: number
  onIndexChange?: (index: number) => void
  // the last image goes on to the first
  loop?: boolean
  label?: string
  closeLabel?: string
  previousLabel?: string
  nextLabel?: string
  className?: string
}

type NativeAttrs = Omit<
  React.DialogHTMLAttributes<HTMLDialogElement>,
  keyof Props
>
export type LightboxProps = Props & NativeAttrs

const Arrow = ({ direction }: { direction: 'left' | 'right' }) => (
  <svg viewBox="0 0 24 24" width="1.5em" height="1.5em" aria-hidden="true">
    <path
      d={direction === 'left' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const Lightbox = React.forwardRef<HTMLDialogElement, LightboxProps>(
  (
    {
      images,
      opened,
      onClose,
      index: customIndex,
      initialIndex = 0,
      onIndexChange,
      loop = false,
      label = 'Image gallery',
      closeLabel = 'Close',
      previousLabel = 'Previous image',
      nextLabel = 'Next image',
      className = '',
      onKeyDown,
      ...props
    },
    ref
  ) => {
    const dialog = useRef<HTMLDialogElement | null>(null)
    const [index, setIndex] = useUncontrolled<number>({
      value: customIndex,
      defaultValue: initialIndex,
      onChange: onIndexChange
    })
    const last = images.length - 1
    const current = Math.min(Math.max(index, 0), Math.max(last, 0))
    const image = images[current]

    // The dialog is native: it sits above the page, keeps the focus inside
    // and gives the focus back to what opened it.
    useEffect(() => {
      if (opened) dialog.current?.showModal()
    }, [opened])

    const go = (step: number) => {
      const target = current + step
      if (target < 0) return loop && setIndex(last)
      if (target > last) return loop && setIndex(0)
      setIndex(target)
    }
    const canPrevious = loop ? last > 0 : current > 0
    const canNext = loop ? last > 0 : current < last

    if (!opened || !image) return null
    return (
      <dialog
        {...props}
        ref={(element) => {
          dialog.current = element
          if (typeof ref === 'function') ref(element)
          else if (ref) ref.current = element
        }}
        aria-label={label}
        className={`${styles.dialog} ${className}`.trim()}
        onClose={onClose}
        onKeyDown={(event) => {
          onKeyDown?.(event)
          if (event.defaultPrevented) return
          // the browser closes it with Escape, unless something on the page
          // cancels that key, so it is closed here too
          if (event.key === 'Escape') dialog.current?.close()
          if (event.key === 'ArrowLeft') go(-1)
          if (event.key === 'ArrowRight') go(1)
        }}
        // a click on the dark area, not on the image, closes it
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close()
        }}
      >
        <figure className={styles.figure}>
          <img src={image.src} alt={image.alt} className={styles.image} />
          <figcaption className={styles.caption}>
            {image.caption}
            {images.length > 1 && (
              <span className={styles.counter} aria-live="polite">
                {current + 1} / {images.length}
              </span>
            )}
          </figcaption>
        </figure>
        {images.length > 1 && (
          <>
            <button
              type="button"
              className={`${styles.control} ${styles.previous}`}
              aria-label={previousLabel}
              disabled={!canPrevious}
              onClick={() => go(-1)}
            >
              <Arrow direction="left" />
            </button>
            <button
              type="button"
              className={`${styles.control} ${styles.next}`}
              aria-label={nextLabel}
              disabled={!canNext}
              onClick={() => go(1)}
            >
              <Arrow direction="right" />
            </button>
          </>
        )}
        <button
          type="button"
          className={`${styles.control} ${styles.close}`}
          aria-label={closeLabel}
          onClick={() => dialog.current?.close()}
        >
          <svg
            viewBox="0 0 24 24"
            width="1.5em"
            height="1.5em"
            aria-hidden="true"
          >
            <path
              d="M6 6l12 12M18 6L6 18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </dialog>
    )
  }
)

Lightbox.displayName = 'BolioUILightbox'
export default Lightbox
