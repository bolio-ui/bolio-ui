import React, { useMemo } from 'react'
import useTheme from '../use-theme'
import { NormalTypes } from '../utils/prop-types'
import { BolioUIThemesPalette } from '../Themes/Presets'
import useScale, { withScale } from '../use-scale'
import useClasses from '../use-classes'
import type { AnyElement } from '../utils/types'
import styles from './Loading.module.css'

export type LoadingTypes = NormalTypes
interface Props {
  type?: LoadingTypes
  color?: string
  className?: string
  spaceRatio?: number
}

type NativeAttrs = Omit<React.HTMLAttributes<AnyElement>, keyof Props>
export type LoadingProps = Props & NativeAttrs

const getIconBgColor = (
  type: LoadingTypes,
  palette: BolioUIThemesPalette,
  color?: string
) => {
  const colors: { [key in LoadingTypes]: string } = {
    default: palette.accents_6,
    primary: palette.primary,
    secondary: palette.secondary,
    success: palette.success,
    warning: palette.warning,
    error: palette.error,
    info: palette.info
  }

  return color ? color : colors[type]
}

const LoadingComponent = React.forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<LoadingProps>
>(
  (
    {
      children,
      type = 'default' as LoadingTypes,
      color,
      className = '',
      spaceRatio = 1,
      style,
      ...props
    },
    ref
  ) => {
    const theme = useTheme()
    const { SCALES } = useScale()

    const classes = useClasses(styles.loadingContainer, className)
    const bgColor = useMemo(
      () => getIconBgColor(type, theme.palette, color),
      [type, theme.palette, color]
    )

    const containerStyle: React.CSSProperties = {
      fontSize: SCALES.font(1),
      width: SCALES.width(1, '100%'),
      height: SCALES.height(1, '100%'),
      padding: `${SCALES.pt(0)} ${SCALES.pr(0)} ${SCALES.pb(0)} ${SCALES.pl(0)}`,
      margin: `${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)} ${SCALES.ml(0)}`,
      ...style
    }

    const dotStyle: React.CSSProperties = {
      backgroundColor: bgColor,
      margin: `0 calc(0.25em / 2 * ${spaceRatio})`
    }

    return (
      <div ref={ref} role="status" className={classes} {...props} style={containerStyle}>
        <span className={styles.loading}>
          {children && (
            <label style={{ color: theme.palette.accents_5 }}>
              {children}
            </label>
          )}
          <i style={dotStyle} />
          <i style={dotStyle} />
          <i style={dotStyle} />
        </span>
      </div>
    )
  }
)

LoadingComponent.displayName = 'BolioUILoading'
const Loading = withScale(LoadingComponent)
export default Loading
