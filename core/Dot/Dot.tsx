import React, { useMemo } from 'react'
import useTheme from '../use-theme'
import { NormalTypes } from '../utils/prop-types'
import { BolioUIThemes } from '../Themes/Presets'
import useScale, { withScale } from '../use-scale'
import useClasses from '../use-classes'
import type { AnyElement } from '../utils/types'
import styles from './Dot.module.css'

export type DotTypes = NormalTypes
interface Props {
  type?: DotTypes
  className?: string
  color?: string
}

type NativeAttrs = Omit<React.HTMLAttributes<AnyElement>, keyof Props>
export type DotProps = Props & NativeAttrs

const getColor = (type: DotTypes, theme: BolioUIThemes): string => {
  const colors: { [key in DotTypes]?: string } = {
    default: theme.palette.accents_2,
    primary: theme.palette.primary,
    secondary: theme.palette.secondary,
    success: theme.palette.success,
    warning: theme.palette.warning,
    error: theme.palette.error,
    info: theme.palette.info
  }
  return colors[type] || (colors.default as string)
}

const DotComponent = React.forwardRef<
  HTMLSpanElement,
  React.PropsWithChildren<DotProps>
>(
  (
    {
      type = 'default' as DotTypes,
      children,
      className = '',
      color = '',
      style,
      ...props
    },
    ref
  ) => {
    const theme = useTheme()
    const { SCALES } = useScale()

    const typeColor = useMemo(() => getColor(type, theme), [type, theme])

    const dotStyle: React.CSSProperties = {
      fontSize: SCALES.font(1),
      width: SCALES.width(1, 'auto'),
      height: SCALES.height(1, 'auto'),
      padding: `${SCALES.pt(0)} ${SCALES.pr(0)} ${SCALES.pb(0)} ${SCALES.pl(0)}`,
      margin: `${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)} ${SCALES.ml(0)}`,
      ...style
    }

    return (
      <span
        ref={ref}
        className={useClasses('dot', styles.dot, className)}
        {...props}
        style={dotStyle}
      >
        <span
          className={styles.icon}
          style={{ backgroundColor: color ? color : typeColor }}
        />
        <span className={styles.label}>{children}</span>
      </span>
    )
  }
)

DotComponent.displayName = 'BolioUIDot'
const Dot = withScale(DotComponent)
export default Dot
