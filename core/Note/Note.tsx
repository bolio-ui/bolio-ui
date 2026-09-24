import React, { useMemo } from 'react'
import useTheme from '../use-theme'
import { NormalTypes } from '../utils/prop-types'
import { BolioUIThemes } from '../Themes/Presets'
import useScale, { withScale } from '../use-scale'
import useClasses from '../use-classes'
import { getVariantColors, isSemanticColorType } from '../utils/variant-colors'

export type NoteTypes = NormalTypes
interface Props {
  type?: NoteTypes
  label?: string | boolean
  filled?: boolean
  light?: boolean
  subtle?: boolean
  className?: string
}

type NativeAttrs = Omit<React.HTMLAttributes<any>, keyof Props>
export type NoteProps = Props & NativeAttrs

const getStatusColor = (
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

    return (
      <div ref={ref} className={useClasses('note', className)} {...props}>
        {label && (
          <span className="label">
            <b>{label}:</b>
          </span>
        )}
        {children}

        <style jsx>{`
          .note {
            line-height: 1.8;
            border: 1px solid ${borderColor};
            color: ${color};
            background-color: ${bgColor};
            border-radius: ${theme.layout.radius};
            font-size: ${SCALES.font(0.875)};
            width: ${SCALES.width(1, 'auto')};
            height: ${SCALES.height(1, 'auto')};
            padding: ${SCALES.pt(0.667)} ${SCALES.pr(1.32)} ${SCALES.pb(0.667)}
              ${SCALES.pl(1.32)};
            margin: ${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)}
              ${SCALES.ml(0)};
          }

          .note :global(p) {
            margin: 0;
          }

          .label {
            text-transform: uppercase;
            user-select: none;
            line-height: 1.5;
            padding-right: 0.38em;
          }
        `}</style>
      </div>
    )
  }
)

NoteComponent.displayName = 'BolioUINote'
const Note = withScale(NoteComponent)
export default Note
