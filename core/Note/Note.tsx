import React, { useMemo } from 'react'
import useTheme from '../use-theme'
import { NormalTypes } from '../utils/prop-types'
import { BolioUIThemes } from '../Themes/Presets'
import useScale, { withScale } from '../use-scale'
import useClasses from '../use-classes'
import { getVariantColors, isSemanticColorType } from '../utils/variant-colors'
import type { AnyElement } from '../utils/types'
import styles from './Note.module.css'

export type NoteTypes = NormalTypes
interface Props {
  type?: NoteTypes
  label?: string | boolean
  filled?: boolean
  light?: boolean
  subtle?: boolean
  className?: string
}

type NativeAttrs = Omit<React.HTMLAttributes<AnyElement>, keyof Props>
export type NoteProps = Props & NativeAttrs

export const getStatusColor = (
  type: NoteTypes,
  {
    filled,
    light,
    subtle
  }: { filled: boolean; light: boolean; subtle: boolean },
  theme: BolioUIThemes
) => {
  if (isSemanticColorType(type)) {
    const variant = subtle
      ? 'subtle'
      : light
        ? 'light'
        : filled
          ? 'filled'
          : 'outline'
    const { bg, border, color } = getVariantColors(theme.palette, type, variant)
    return { color, borderColor: border, bgColor: bg }
  }

  // 'default' has no semantic color: a neutral gray plays that role instead.
  const neutral = theme.palette.accents_6
  if (!filled)
    return {
      color: neutral,
      borderColor: neutral,
      bgColor: theme.palette.background
    }
  return { color: 'white', borderColor: neutral, bgColor: neutral }
}

export const NoteComponent = React.forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<NoteProps>
>(
  (
    {
      children,
      type = 'default' as NoteTypes,
      label = 'note' as string | boolean,
      filled = false,
      light = false,
      subtle = false,
      className = '',
      style,
      ...props
    },
    ref
  ) => {
    const theme = useTheme()
    const { SCALES } = useScale()

    const { color, borderColor, bgColor } = useMemo(
      () => getStatusColor(type, { filled, light, subtle }, theme),
      [type, filled, light, subtle, theme]
    )

    const noteStyle: React.CSSProperties = {
      border: `1px solid ${borderColor}`,
      color,
      backgroundColor: bgColor,
      borderRadius: theme.layout.radius,
      fontSize: SCALES.font(0.875),
      width: SCALES.width(1, 'auto'),
      height: SCALES.height(1, 'auto'),
      padding: `${SCALES.pt(0.667)} ${SCALES.pr(1.32)} ${SCALES.pb(0.667)} ${SCALES.pl(1.32)}`,
      margin: `${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)} ${SCALES.ml(0)}`,
      ...style
    }

    return (
      <div
        ref={ref}
        className={useClasses(styles.note, className)}
        {...props}
        style={noteStyle}
      >
        {label && (
          <span className={styles.label}>
            <b>{label}:</b>
          </span>
        )}
        {children}
      </div>
    )
  }
)

NoteComponent.displayName = 'BolioUINote'
const Note = withScale(NoteComponent)
export default Note
