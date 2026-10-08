import React, { MouseEvent, useImperativeHandle, useMemo, useRef } from 'react'
import useTheme from '../use-theme'
import { useModalContext } from './ModalContext'
import Button, { ButtonProps } from '../Button'
import useScale, { withScale } from '../use-scale'
import useClasses from '../use-classes'
import styles from './ModalAction.module.css'

type ModalActionEvent = MouseEvent<HTMLButtonElement> & {
  close: () => void
}

interface Props {
  className?: string
  passive?: boolean
  disabled?: boolean
  onClick?: (event: ModalActionEvent) => void
}

export type ModalActionProps = Props & Omit<ButtonProps, keyof Props>

const ModalActionComponent = React.forwardRef<
  HTMLButtonElement,
  React.PropsWithChildren<ModalActionProps>
>(function (
  {
    className = '',
    children,
    onClick,
    passive = false,
    disabled = false,
    ...props
  }: React.PropsWithChildren<ModalActionProps>,
  ref: React.Ref<HTMLButtonElement | null>
) {
  const theme = useTheme()
  const { SCALES } = useScale()

  const btnRef = useRef<HTMLButtonElement>(null)
  const { close } = useModalContext()
  useImperativeHandle(ref, () => btnRef.current as HTMLButtonElement)

  const clickHandler = (event: MouseEvent<HTMLButtonElement>) => {
    if (disabled) return
    const actionEvent = Object.assign({}, event, {
      close: () => close && close()
    })
    if (onClick) onClick(actionEvent)
  }

  const color = useMemo(() => {
    return passive ? theme.palette.accents_5 : theme.palette.foreground
  }, [theme.palette, passive])

  // On the dark theme the modal is a lighter surface, so the actions are a
  // darker gray than it
  const actionBg =
    theme.type === 'dark' ? theme.palette.accents_2 : theme.palette.background

  const hoverBg =
    theme.type === 'dark' ? theme.palette.accents_3 : theme.palette.accents_1

  const classes = useClasses(styles.action, className)

  const actionStyle = {
    fontSize: SCALES.font(0.75),
    border: 'none',
    color,
    backgroundColor: actionBg,
    display: 'flex',
    WebkitBoxAlign: 'center',
    alignItems: 'center',
    WebkitBoxPack: 'center',
    justifyContent: 'center',
    flex: 1,
    height: SCALES.height(3.5625),
    borderRadius: 0,
    minWidth: 0,
    '--modal-action-hover-color': disabled ? color : theme.palette.foreground,
    '--modal-action-hover-bg': disabled ? actionBg : hoverBg
  } as React.CSSProperties

  const overrideProps = {
    ...props,
    ref: btnRef
  }

  return (
    <Button
      className={classes}
      onClick={clickHandler}
      disabled={disabled}
      {...overrideProps}
      style={{
        ...actionStyle,
        ...(overrideProps as { style?: React.CSSProperties }).style
      }}
    >
      {children}
    </Button>
  )
})

ModalActionComponent.displayName = 'BolioUIModalAction'
const ModalAction = withScale(ModalActionComponent)
export default ModalAction
