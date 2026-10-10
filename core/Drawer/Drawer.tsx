import React, { MouseEvent, useEffect, useId, useMemo, useState } from 'react'
import { withScale } from '../use-scale'
import usePortal from '../utils/use-portal'
import useBodyScroll from '../utils/use-body-scroll'
import useKeyboard, { KeyCode } from '../use-keyboard'
import { createPortal } from 'react-dom'
import Backdrop from '../Shared/backdrop'
import { DrawerPlacement } from './helper'
import DrawerWrapper from './DrawerWrapper'
import ModalTitle from '../Modal/ModalTitle'
import ModalSubtitle from '../Modal/ModalSubtitle'
import { ModalContext } from '../Modal/ModalContext'
import { hasChild } from '../utils/collections'

interface Props {
  visible?: boolean
  keyboard?: boolean
  disableBackdropClick?: boolean
  wrapClassName?: string
  placement: DrawerPlacement
  onClose?: () => void
  onContentClick?: (event: MouseEvent<HTMLElement>) => void
}

type NativeAttrs = Omit<React.HTMLAttributes<unknown>, keyof Props>
export type DrawerProps = Props & NativeAttrs

const DrawerComponent = React.forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<DrawerProps>
>(
  (
    {
      visible: customVisible,
      keyboard = true,
      disableBackdropClick,
      wrapClassName,
      children,
      placement,
      onClose,
      onContentClick,
      'aria-labelledby': ariaLabelledby,
      'aria-describedby': ariaDescribedby,
      ...props
    },
    ref
  ) => {
    const portal = usePortal('drawer')
    const baseId = useId()
    const titleId = `${baseId}-title`
    const descriptionId = `${baseId}-description`

    const [visible, setVisible] = useState<boolean>(false)
    const [, setBodyHidden] = useBodyScroll(null, { delayReset: 300 })

    const closeDrawer = () => {
      if (onClose) onClose()
      setVisible(false)
      setBodyHidden(false)
    }

    useEffect(() => {
      if (typeof customVisible === 'undefined') return
      setVisible(customVisible)
      setBodyHidden(customVisible)
    }, [customVisible, setBodyHidden])

    const { bindings } = useKeyboard(
      () => {
        if (keyboard) closeDrawer()
      },
      KeyCode.Escape,
      {
        disableGlobalEvent: true
      }
    )

    const closeFromBackdrop = () => {
      if (disableBackdropClick) return
      closeDrawer()
    }

    // Drawer.Title and Drawer.Subtitle name and describe the dialog
    const modalConfig = useMemo(
      () => ({ titleId, descriptionId }),
      [titleId, descriptionId]
    )

    if (!portal) return null
    return createPortal(
      <ModalContext.Provider value={modalConfig}>
        <Backdrop
          onClick={closeFromBackdrop}
          onContentClick={onContentClick}
          visible={visible}
          width="100%"
          {...bindings}
        >
          <DrawerWrapper
            ref={ref}
            visible={visible}
            className={wrapClassName}
            placement={placement}
            aria-labelledby={
              ariaLabelledby ||
              (hasChild(children, ModalTitle) ? titleId : undefined)
            }
            aria-describedby={
              ariaDescribedby ||
              (hasChild(children, ModalSubtitle) ? descriptionId : undefined)
            }
            {...props}
          >
            {children}
          </DrawerWrapper>
        </Backdrop>
      </ModalContext.Provider>,
      portal
    )
  }
)

DrawerComponent.displayName = 'BolioUIDrawer'
const Drawer = withScale(DrawerComponent)
export default Drawer
