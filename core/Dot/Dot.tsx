import React, { useMemo } from 'react'
import useTheme from '../use-theme'
import { NormalTypes } from '../utils/prop-types'
import { BolioUIThemes } from '../Themes/Presets'
import useScale, { withScale } from '../use-scale'
import useClasses from '../use-classes'

export type DotTypes = NormalTypes
interface Props {
  type?: DotTypes
  className?: string
  color?: string
}

type NativeAttrs = Omit<React.HTMLAttributes<any>, keyof Props>
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

function DotComponent({
  type = 'default' as DotTypes,
  children,
  className = '',
  color = '',
  ...props
}: React.PropsWithChildren<DotProps>) {
  const theme = useTheme()
  const { SCALES } = useScale()

  const typeColor = useMemo(() => getColor(type, theme), [type, theme])

  return (
    <span className={useClasses('dot', className)} {...props}>
      <span className="icon" />
      <span className="label">{children}</span>
      <style jsx>{`
        .dot {
          display: inline-flex;
          align-items: center;
          font-size: ${SCALES.font(1)};
          width: ${SCALES.width(1, 'auto')};
          height: ${SCALES.height(1, 'auto')};
          padding: ${SCALES.pt(0)} ${SCALES.pr(0)} ${SCALES.pb(0)}
            ${SCALES.pl(0)};
          margin: ${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)}
            ${SCALES.ml(0)};
        }
        .icon {
          width: 0.625em;
          height: 0.625em;
          min-width: calc(0.625 * 12px);
          min-height: calc(0.625 * 12px);
          line-height: 0.625em;
          border-radius: 50%;
          background-color: ${color ? color : typeColor};
          user-select: none;
        }
        .label {
          margin-left: 0.5em;
          font-size: 1em;
          line-height: 1em;
          text-transform: capitalize;
        }
      `}</style>
    </span>
  )
}

DotComponent.displayName = 'BolioUIDot'
const Dot = withScale(DotComponent)
export default Dot
