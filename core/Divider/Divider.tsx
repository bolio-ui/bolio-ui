import React, { useMemo } from 'react'
import useTheme from '../use-theme'
import { DividerAlign, SnippetTypes } from '../utils/prop-types'
import { BolioUIThemesPalette } from '../Themes/Presets'
import useScale, { withScale } from '../use-scale'
import useClasses from '../use-classes'
import type { AnyElement } from '../utils/types'
import styles from './Divider.module.css'

export type DividerTypes = SnippetTypes

interface Props {
  type?: DividerTypes
  align?: DividerAlign
  className?: string
}

type NativeAttrs = Omit<React.HTMLAttributes<AnyElement>, keyof Props>
export type DividerProps = Props & NativeAttrs

const getColor = (type: DividerTypes, palette: BolioUIThemesPalette) => {
  const colors: { [key in DividerTypes]: string } = {
    default: palette.border,
    primary: palette.primaryLight,
    secondary: palette.secondaryLight,
    success: palette.successLight,
    warning: palette.warningLight,
    error: palette.errorLight,
    info: palette.infoLight,
    dark: palette.foreground,
    lite: palette.accents_1
  }
  return colors[type]
}

const DividerComponent = React.forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<DividerProps>
>(
  (
    {
      type = 'default' as DividerTypes,
      align = 'center' as DividerAlign,
      children,
      className = '',
      style,
      ...props
    },
    ref
  ) => {
    const theme = useTheme()
    const { SCALES } = useScale()

    const classes = useClasses('divider', styles.divider, className)

    const color = useMemo(
      () => getColor(type, theme.palette),
      [type, theme.palette]
    )

    const alignClassName = useMemo(() => {
      if (!align || align === 'center') return ''
      if (align === 'left' || align === 'start') return styles.start
      return styles.end
    }, [align])

    const alignClasses = useClasses('text', styles.text, alignClassName)
    const textColor = type === 'default' ? theme.palette.foreground : color

    const dividerStyle: React.CSSProperties = {
      backgroundColor: color,
      fontSize: SCALES.font(1),
      width: SCALES.width(1, 'auto'),
      height: SCALES.height(0.0625),
      padding: `${SCALES.pt(0)} ${SCALES.pr(0)} ${SCALES.pb(0)} ${SCALES.pl(0)}`,
      margin: `${SCALES.mt(0.5)} ${SCALES.mr(0)} ${SCALES.mb(0.5)} ${SCALES.ml(0)}`,
      ...style
    }

    const textStyle: React.CSSProperties = {
      backgroundColor: theme.palette.background,
      color: textColor
    }

    return (
      <div
        ref={ref}
        role="separator"
        className={classes}
        {...props}
        style={dividerStyle}
      >
        {children && (
          <span className={alignClasses} style={textStyle}>
            {children}
          </span>
        )}
      </div>
    )
  }
)

DividerComponent.displayName = 'BolioUIDivider'
const Divider = withScale(DividerComponent)
export default Divider
