import React, {
  useRef,
  useState,
  MouseEvent,
  useMemo,
  useImperativeHandle
} from 'react'
import useScale, { withScale } from '../use-scale'
import useTheme from '../use-theme'
import ButtonDrip from './button.drip'
import ButtonLoading from './button-loading'
import { ButtonTypes } from '../utils/prop-types'
import { filterPropsWithGroup, getButtonChildrenWithIcon } from './utils'
import { useButtonGroupContext } from '../button-group/button-group-context'
import {
  getButtonColors,
  getButtonCursor,
  getButtonDripColor,
  getButtonHoverColors
} from './styles'
import useClasses from '../use-classes'

interface Props {
  type?: ButtonTypes
  ghost?: boolean
  rounded?: boolean
  loading?: boolean
  shadow?: boolean
  auto?: boolean
  effect?: boolean
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
  rounded: false,
  loading: false,
  shadow: false,
  auto: false,
  effect: true,
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
  useImperativeHandle(ref, () => buttonRef.current)

  const [dripShow, setDripShow] = useState<boolean>(false)
  const [dripX, setDripX] = useState<number>(0)
  const [dripY, setDripY] = useState<number>(0)
  const groupConfig = useButtonGroupContext()
  const filteredProps = filterPropsWithGroup(btnProps, groupConfig)

  /* eslint-disable @typescript-eslint/no-unused-vars */
  const {
    children,
    disabled,
    type,
    loading,
    shadow,
    ghost,
    rounded,
    effect,
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

  const hover = useMemo(
    () => getButtonHoverColors(theme.palette, filteredProps),
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

    onClick && onClick(event)
  }

  const childrenWithIcon = useMemo(
    () =>
      getButtonChildrenWithIcon(auto, children, {
        icon,
        iconRight
      }),
    [auto, children, icon, iconRight]
  )
  const [paddingLeft, paddingRight] = [
    auto ? SCALES.pl(1.15) : SCALES.pl(2.5),
    auto ? SCALES.pr(1.15) : SCALES.pr(2.5)
  ]

  return (
    <button
      ref={buttonRef}
      type={htmlType}
      className={useClasses('btn', className)}
      disabled={disabled}
      onClick={clickHandler}
      {...props}
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
      <style jsx>{`
        .btn {
          box-sizing: border-box;
          display: inline-block;
          border-radius: ${rounded ? '25px' : theme.layout.radius};
          font-weight: 500;
          font-size: ${SCALES.font(0.875)};
          user-select: none;
          outline: none;
          text-transform: capitalize;
          justify-content: center;
          text-align: center;
          white-space: nowrap;
          transition: background-color 200ms ease 0ms, box-shadow 200ms ease 0ms,
            border 200ms ease 0ms, color 200ms ease 0ms;
          position: relative;
          overflow: hidden;
          color: ${color};
          background-color: ${bg};
          border: 1px solid ${border};
          cursor: ${cursor};
          pointer-events: ${events};
          box-shadow: ${shadow ? '0 8px 20px 0' + bg : 'none'};
          --bolio-ui-button-icon-padding: ${SCALES.pl(0.75)};
          --bolio-ui-button-height: ${SCALES.height(2.5)};
          --bolio-ui-button-color: ${color};
          --bolio-ui-button-bg: ${bg};
          min-width: ${auto ? 'min-content' : SCALES.width(10.5)};
          width: ${auto ? 'auto' : 'initial'};
          height: ${SCALES.height(2.5)};
          padding: ${SCALES.pt(0)} ${paddingRight} ${SCALES.pb(0)}
            ${paddingLeft};
          margin: ${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)}
            ${SCALES.ml(0)};
        }

        .btn:hover,
        .btn:focus {
          color: ${hover.color};
          --bolio-ui-button-color: ${hover.color};
          background-color: ${hover.bg};
          border-color: ${hover.border};
          cursor: ${cursor};
          pointer-events: ${events};
          box-shadow: ${shadow ? '0 4px 10px 0' + bg : 'none'};
          /* transform: translate3d(0px, ${shadow ? '-1px' : '0px'}, 0px); */
        }
        .btn:active {
          transform: scale(0.98, 0.98);
        }

        .btn :global(.text) {
          position: relative;
          z-index: 1;
          display: inline-flex;
          justify-content: center;
          align-items: center;
          text-align: center;
          line-height: inherit;
        }

        .btn :global(.text p),
        .btn :global(.text pre),
        .btn :global(.text div) {
          margin: 0;
        }
      `}</style>
    </button>
  )
})

ButtonComponent.defaultProps = defaultProps
ButtonComponent.displayName = 'BolioUIButton'
const Button = withScale(ButtonComponent)
export default Button
