import React, { useEffect, useRef, useState } from 'react'
import Image from '../Image'
import type { ImageProps } from '../Image'
import useClasses from '../use-classes'
import styles from './ImageZoom.module.css'

interface Props {
  src: string
  // what the image shows, and what the button is called
  alt: string
  // a larger version of the image, loaded only when it opens
  zoomSrc?: string
  caption?: React.ReactNode
  closeLabel?: string
  className?: string
}

type NativeAttrs = Omit<ImageProps, keyof Props | 'className'>
export type ImageZoomProps = Props & NativeAttrs

const ImageZoom = React.forwardRef<HTMLButtonElement, ImageZoomProps>(
  (
    {
      src,
      alt,
      zoomSrc,
      caption,
      closeLabel = 'Close',
      className = '',
      ...imageProps
    },
    ref
  ) => {
    const [open, setOpen] = useState(false)
    const dialog = useRef<HTMLDialogElement>(null)

    // The dialog is native: it sits above the page, keeps the focus inside,
    // closes with Escape and gives the focus back to the button.
    useEffect(() => {
      if (open) dialog.current?.showModal()
    }, [open])

    return (
      <>
        <button
          ref={ref}
          type="button"
          className={useClasses(styles.trigger, className)}
          aria-haspopup="dialog"
          onClick={() => setOpen(true)}
        >
          <Image src={src} alt={alt} {...imageProps} />
        </button>
        {open && (
          <dialog
            ref={dialog}
            aria-label={alt}
            className={styles.dialog}
            onClose={() => setOpen(false)}
            // The browser closes it with Escape, unless something on the page
            // cancels that key, like a shortcut library does, so it is closed here too.
            onKeyDown={(event) => {
              if (event.key === 'Escape') dialog.current?.close()
            }}
            // a click on the dark area, not on the image, closes it
            onClick={(event) => {
              if (event.target === event.currentTarget) dialog.current?.close()
            }}
          >
            <figure className={styles.figure}>
              <img src={zoomSrc || src} alt={alt} className={styles.zoomed} />
              {caption && (
                <figcaption className={styles.caption}>{caption}</figcaption>
              )}
            </figure>
            <button
              type="button"
              className={styles.close}
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
        )}
      </>
    )
  }
)

ImageZoom.displayName = 'BolioUIImageZoom'
export default ImageZoom
