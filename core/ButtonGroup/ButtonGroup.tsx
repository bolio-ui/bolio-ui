import React, { useMemo } from 'react'
import useTheme from '../use-theme'
import { ButtonTypes } from '../utils/prop-types'
import { ButtonGroupContext, ButtonGroupConfig } from './ButtonGroupContext'
import { BolioUIThemesPalette } from '../Themes/Presets'
import useScale, { withScale } from '../use-scale'
import useClasses from '../use-classes'
import styles from './ButtonGroup.module.css'

interface Props {
  disabled?: boolean
  vertical?: boolean
  ghost?: boolean
  type?: ButtonTypes
  className?: string
}

const defaultProps = {
  disabled: false,
  vertical: false,
  ghost: false,
  type: 'default' as ButtonTypes,
  className: ''
}

type NativeAttrs = Omit<React.HTMLAttributes<unknown>, keyof Props>
export type ButtonGroupProps = Props & NativeAttrs

const getGroupBorderColors = (
  palette: BolioUIThemesPalette,
  props: ButtonGroupProps
): string => {
  const { ghost, type } = props

  if (!ghost && type !== 'default') return palette.background
  const colors: { [key in ButtonTypes]?: string } = {
    // default: palette.accents_3,
    primary: palette.primary,
    secondary: palette.secondary,
    success: palette.success,
    warning: palette.warning,
    error: palette.error,
    info: palette.info
  }

  const withoutLightType = type?.replace('-light', '') as ButtonTypes

  return colors[withoutLightType] || (colors.default as string)
}

const ButtonGroupComponent = React.forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<ButtonGroupProps>
>((groupProps, ref) => {
  const theme = useTheme()
  const { SCALES } = useScale()

  const {
    disabled = defaultProps.disabled,
    type = defaultProps.type,
    ghost = defaultProps.ghost,
    vertical = defaultProps.vertical,
    children,
    className = defaultProps.className,
    style,
    ...props
  } = groupProps

  const initialValue = useMemo<ButtonGroupConfig>(
    () => ({
      disabled,
      type,
      ghost,
      isButtonGroup: true
    }),
    [disabled, ghost, type]
  )

  const border = useMemo(() => {
    return getGroupBorderColors(theme.palette, { ghost, type })
  }, [theme.palette, ghost, type])

  const classes = useClasses(
    styles.btnGroup,
    {
      [styles.vertical]: vertical,
      [styles.horizontal]: !vertical
    },
    className
  )

  const groupStyle: React.CSSProperties = {
    width: SCALES.width(1, 'auto'),
    height: SCALES.height(1, 'min-content'),
    margin: `${SCALES.mt(0.313)} ${SCALES.mr(0.313)} ${SCALES.mb(0.313)} ${SCALES.ml(0.313)}`,
    padding: `${SCALES.pt(0)} ${SCALES.pr(0)} ${SCALES.pb(0)} ${SCALES.pl(0)}`,
    '--btn-group-border': border,
    '--btn-group-radius': theme.layout.radius,
    ...style
  } as React.CSSProperties

  return (
    <ButtonGroupContext.Provider value={initialValue}>
      <div ref={ref} className={classes} {...props} style={groupStyle}>
        {children}
      </div>
    </ButtonGroupContext.Provider>
  )
})

ButtonGroupComponent.displayName = 'BolioUIButtonGroup'
const ButtonGroup = withScale(ButtonGroupComponent)
export default ButtonGroup
