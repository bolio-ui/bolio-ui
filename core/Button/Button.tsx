import React, {
  useRef,
  useState,
  MouseEvent,
  useMemo,
  useImperativeHandle
} from 'react'
import useScale, { withScale } from '../use-scale'
import useTheme from '../use-theme'
import ButtonDrip from './ButtonDrip'
import ButtonLoading from './ButtonLoading'
import { ButtonTypes } from '../utils/prop-types'
import { filterPropsWithGroup, getButtonChildrenWithIcon } from './utils'
import { useButtonGroupContext } from '../ButtonGroup/ButtonGroupContext'
import { getButtonColors, getButtonCursor, getButtonDripColor } from './styles'
import useClasses from '../use-classes'
import useDefaultProps from '../utils/use-default-props'
import styles from './Button.module.css'

interface Props {
  type?: ButtonTypes
  ghost?: boolean
  subtle?: boolean
  rounded?: boolean
  loading?: boolean
  shadow?: boolean
  auto?: boolean
  effect?: boolean
  spotlight?: boolean
  disabled?: boolean
  htmlType?: React.ButtonHTMLAttributes<unknown>['type']
  icon?: React.ReactNode
  iconRight?: React.ReactNode
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  className?: string
}

const defaultProps = {
  type: 'default' as ButtonTypes,
  htmlType: 'button' as React.ButtonHTMLAttributes<unknown>['type'],
  ghost: false,
  subtle: false,
  rounded: false,
  loading: false,
  shadow: false,
  auto: false,
  effect: true,
  spotlight: false,
  disabled: false,
  className: ''
}

type NativeAttrs = Omit<React.ButtonHTMLAttributes<unknown>, keyof Props>
export type ButtonProps = Props & NativeAttrs

const ButtonComponent = React.forwardRef<
  HTMLButtonElement,
  React.PropsWithChildren<ButtonProps>
>((btnProps: ButtonProps, ref: React.Ref<HTMLButtonElement | null>) => {
  const theme = useTheme()
  const { SCALES } = useScale()
  const buttonRef = useRef<HTMLButtonElement>(null)
  useImperativeHandle(ref, () => buttonRef.current as HTMLButtonElement)

  const [dripShow, setDripShow] = useState<boolean>(false)
  const [dripX, setDripX] = useState<number>(0)
  const [dripY, setDripY] = useState<number>(0)
  const groupConfig = useButtonGroupContext()
  const filteredProps = filterPropsWithGroup(
    useDefaultProps(btnProps, defaultProps),
    groupConfig
  )

  /* eslint-disable @typescript-eslint/no-unused-vars */
  const {
    children,
    disabled,
    type,
    loading,
    shadow,
    ghost,
    subtle,
    rounded,
    effect,
    spotlight,
    onClick,
    auto,
    icon,
    htmlType,
    iconRight,
    className,
    ...props
  } = filteredProps
  /* eslint-enable @typescript-eslint/no-unused-vars */

  const { bg, border, color } = useMemo(
    () => getButtonColors(theme.palette, filteredProps),
    [theme.palette, filteredProps]
  )

  const { cursor, events } = useMemo(
    () => getButtonCursor(disabled, loading),
    [disabled, loading]
  )

  const dripColor = useMemo(
    () => getButtonDripColor(theme.palette, filteredProps),
    [theme.palette, filteredProps]
  )

  const dripCompletedHandle = () => {
    setDripShow(false)
    setDripX(0)
    setDripY(0)
  }

  const clickHandler = (event: MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return
    const showDrip = effect

    if (showDrip && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setDripShow(true)
      setDripX(event.clientX - rect.left)
      setDripY(event.clientY - rect.top)
    }

    if (onClick) onClick(event)
  }

  const childrenWithIcon = useMemo(
    () =>
      getButtonChildrenWithIcon(children, {
        icon,
        iconRight
      }),
    [children, icon, iconRight]
  )
  // A button with only an icon is square, so the icon sits in the middle
  const iconOnly =
    Boolean(icon || iconRight) && React.Children.count(children) === 0
  const [paddingLeft, paddingRight] = iconOnly
    ? [SCALES.pl(0), SCALES.pr(0)]
    : [SCALES.pl(1.15), SCALES.pr(1.15)]

  // Inside a ButtonGroup the group draws the outer border, the dividers and
  // the corners; inline values would win over its CSS and double them up.
  const inGroup = groupConfig.isButtonGroup
  const dynamicStyle = {
    borderRadius: inGroup ? undefined : rounded ? '25px' : theme.layout.radius,
    fontSize: SCALES.font(0.875),
    color,
    backgroundColor: bg,
    border: inGroup && ghost ? undefined : `1px solid ${border}`,
    cursor,
    pointerEvents: events,
    boxShadow: shadow ? '0 4px 10px 0' + bg : 'none',
    '--bolio-ui-button-height': SCALES.height(2.5),
    '--bolio-ui-button-color': color,
    '--bolio-ui-button-bg': bg,
    minWidth: iconOnly
      ? SCALES.width(2.5)
      : auto
        ? 'min-content'
        : SCALES.width(10.5),
    width: iconOnly ? SCALES.width(2.5) : auto ? 'auto' : 'initial',
    height: SCALES.height(2.5),
    padding: `${SCALES.pt(0)} ${paddingRight} ${SCALES.pb(0)} ${paddingLeft}`,
    margin: `${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)} ${SCALES.ml(0)}`,
    ...(props.style as React.CSSProperties | undefined)
  } as React.CSSProperties

  return (
    <button
      ref={buttonRef}
      type={htmlType}
      className={useClasses(
        'btn',
        styles.root,
        { [styles.spotlight]: spotlight },
        className
      )}
      disabled={disabled}
      onClick={clickHandler}
      {...props}
      onMouseMove={(event) => {
        if (spotlight) {
          const rect = event.currentTarget.getBoundingClientRect()
          event.currentTarget.style.setProperty(
            '--x',
            `${event.clientX - rect.left}px`
          )
          event.currentTarget.style.setProperty(
            '--y',
            `${event.clientY - rect.top}px`
          )
        }
        props.onMouseMove?.(event)
      }}
      style={dynamicStyle}
    >
      {loading && <ButtonLoading color={color} />}
      {childrenWithIcon}
      {dripShow && (
        <ButtonDrip
          x={dripX}
          y={dripY}
          color={dripColor}
          onCompleted={dripCompletedHandle}
        />
      )}
    </button>
  )
})

ButtonComponent.displayName = 'BolioUIButton'
const Button = withScale(ButtonComponent)
export default Button
