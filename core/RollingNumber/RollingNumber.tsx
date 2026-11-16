import React from 'react'
import useScale, { withScale } from '../use-scale'
import useClasses from '../use-classes'
import useReducedMotion from '../use-reduced-motion'
import styles from './RollingNumber.module.css'

interface Props {
  value: number
  // locale and options of Intl.NumberFormat
  locale?: string
  formatOptions?: Intl.NumberFormatOptions
  // milliseconds each digit takes to roll
  duration?: number
  className?: string
}

type NativeAttrs = Omit<React.HTMLAttributes<HTMLSpanElement>, keyof Props>
export type RollingNumberProps = Props & NativeAttrs

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

const RollingNumberComponent = React.forwardRef<
  HTMLSpanElement,
  RollingNumberProps
>(
  (
    { value, locale, formatOptions, duration = 600, className = '', ...props },
    ref
  ) => {
    const { SCALES } = useScale()
    const reduced = useReducedMotion()
    const text = new Intl.NumberFormat(locale, formatOptions).format(value)
    const characters = Array.from(text)

    return (
      <span
        ref={ref}
        role="img"
        aria-label={text}
        className={useClasses(styles.root, className)}
        style={{
          margin: `${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)} ${SCALES.ml(0)}`
        }}
        {...props}
      >
        {characters.map((character, index) =>
          /^\d$/.test(character) ? (
            // keyed from the right, so a digit keeps its place when the
            // number gains or loses a digit on the left
            <span
              key={characters.length - index}
              aria-hidden="true"
              className={styles.digit}
            >
              <span
                className={styles.strip}
                style={{
                  transform: `translateY(-${Number(character)}em)`,
                  transitionDuration: reduced ? '0ms' : `${duration}ms`
                }}
              >
                {DIGITS.map((digit) => (
                  <span key={digit}>{digit}</span>
                ))}
              </span>
            </span>
          ) : (
            <span key={characters.length - index} aria-hidden="true">
              {character}
            </span>
          )
        )}
      </span>
    )
  }
)

RollingNumberComponent.displayName = 'BolioUIRollingNumber'
const RollingNumber = withScale(RollingNumberComponent)
export default RollingNumber
