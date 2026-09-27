import React, { useEffect, useMemo, useState } from 'react'
import { BolioUIThemesPalette } from '../Themes'
import { NormalTypes } from '../utils/prop-types'
import RatingIcon from './RatingIcon'
import useTheme from '../use-theme'
import useScale, { withScale } from '../use-scale'
import useClasses, { joinClasses } from '../use-classes'
import type { AnyElement } from '../utils/types'
import styles from './Rating.module.css'

export type RatingTypes = NormalTypes
export type RatingValue = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
export type RatingCount = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

interface Props {
  type?: RatingTypes
  className?: string
  icon?: React.JSX.Element
  count?: RatingCount | number
  value?: RatingValue | number
  initialValue?: RatingValue
  onValueChange?: (value: number) => void
  locked?: boolean
  onLockedChange?: (locked: boolean) => void
}

type NativeAttrs = Omit<React.HTMLAttributes<AnyElement>, keyof Props>
export type RatingProps = Props & NativeAttrs

const getColor = (type: RatingTypes, palette: BolioUIThemesPalette): string => {
  const colors: { [key in RatingTypes]?: string } = {
    default: palette.accents_6,
    primary: palette.primary,
    secondary: palette.secondary,
    success: palette.success,
    warning: palette.warning,
    error: palette.error,
    info: palette.info
  }
  return colors[type] || (colors.default as string)
}

const RatingComponent = React.forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<RatingProps>
>(
  (
    {
      type = 'default' as RatingTypes,
      className = '',
      icon = (<RatingIcon />) as React.JSX.Element,
      count = 5 as RatingCount,
      value: customValue,
      initialValue = 1 as RatingValue,
      onValueChange,
      locked = false,
      onLockedChange,
      ...props
    },
    ref
  ) => {
    const theme = useTheme()
    const { SCALES } = useScale()

    const color = useMemo(
      () => getColor(type, theme.palette),
      [type, theme.palette]
    )
    const [value, setValue] = useState<number>(initialValue)
    const [isLocked, setIsLocked] = useState<boolean>(locked)

    const lockedChangeHandler = (next: boolean) => {
      setIsLocked(next)
      if (onLockedChange) onLockedChange(next)
    }

    const valueChangeHandler = (next: number) => {
      setValue(next)
      const emitValue = next > count ? count : next
      if (onValueChange) onValueChange(emitValue)
    }

    const clickHandler = (index: number) => {
      if (isLocked) return lockedChangeHandler(false)
      valueChangeHandler(index)
      lockedChangeHandler(true)
    }

    const mouseEnterHandler = (index: number) => {
      if (isLocked) return
      valueChangeHandler(index)
    }

    // the checked star is the one in the tab order; with no value, the first
    const focusIndex = value >= 1 && value <= count ? value : 1

    const keyDownHandler = (
      event: React.KeyboardEvent<HTMLDivElement>,
      index: number
    ) => {
      const nextByKey: Record<string, number> = {
        ArrowRight: index + 1,
        ArrowUp: index + 1,
        ArrowLeft: index - 1,
        ArrowDown: index - 1,
        Home: 1,
        End: count
      }
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        return clickHandler(index)
      }
      if (!(event.key in nextByKey)) return
      event.preventDefault()
      const next = Math.min(Math.max(nextByKey[event.key], 1), count)
      valueChangeHandler(next)
      lockedChangeHandler(true)
      const radios =
        event.currentTarget.parentElement?.querySelectorAll<HTMLElement>(
          '[role="radio"]'
        )
      radios?.[next - 1]?.focus()
    }

    useEffect(() => {
      if (typeof customValue === 'undefined') return
      setValue(customValue < 0 ? 0 : customValue)
    }, [customValue])

    const ratingStyle = {
      '--rating-font-size': SCALES.font(1),
      '--rating-color': color,
      width: SCALES.width(1, 'auto'),
      height: SCALES.height(1, 'auto'),
      padding: `${SCALES.pt(0)} ${SCALES.pr(0)} ${SCALES.pb(0)} ${SCALES.pl(0)}`,
      margin: `${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)} ${SCALES.ml(0)}`
    } as React.CSSProperties

    return (
      <div
        ref={ref}
        role="radiogroup"
        className={useClasses(styles.rating, className)}
        {...props}
        style={ratingStyle}
      >
        {[...Array(count)].map((_, index) => (
          <div
            className={joinClasses(styles.iconBox, {
              [styles.hovered]: index + 1 <= value
            })}
            style={{ cursor: isLocked ? 'default' : 'pointer' }}
            key={index}
            role="radio"
            aria-checked={index + 1 === value}
            aria-label={`${index + 1} of ${count}`}
            tabIndex={index + 1 === focusIndex ? 0 : -1}
            onKeyDown={(event) => keyDownHandler(event, index + 1)}
            onMouseEnter={() => mouseEnterHandler(index + 1)}
            onClick={() => clickHandler(index + 1)}
          >
            {icon}
          </div>
        ))}
      </div>
    )
  }
)

RatingComponent.displayName = 'BolioUIRating'
const Rating = withScale(RatingComponent)
export default Rating
