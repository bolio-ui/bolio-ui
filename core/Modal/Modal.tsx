import React, { MouseEvent, useEffect, useId, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import usePortal from '../utils/use-portal'
import ModalWrapper from './ModalWrapper'
import ModalAction from './ModalAction'
import ModalActions from './ModalActions'
import ModalTitle from './ModalTitle'
import ModalSubtitle from './ModalSubtitle'
import Backdrop from '../Shared/backdrop'
import { ModalConfig, ModalContext } from './ModalContext'
import { hasChild, pickChild } from '../utils/collections'
import useBodyScroll from '../utils/use-body-scroll'
import useScale, { withScale } from '../use-scale'
import useKeyboard, { KeyCode } from '../use-keyboard'

interface Props {
  disableBackdropClick?: boolean
  onClose?: () => void
  onContentClick?: (event: MouseEvent<HTMLElement>) => void
  visible?: boolean
  keyboard?: boolean
  role?: 'dialog' | 'alertdialog'
  wrapClassName?: string
  positionClassName?: string
  backdropClassName?: string
  layerClassName?: string
}

type NativeAttrs = Omit<React.HTMLAttributes<any>, keyof Props>
export type ModalProps = Props & NativeAttrs

const ModalComponent = React.forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<ModalProps>
>(
  (
    {
      visible: customVisible,
      onClose,
      children,
      keyboard = true,
      wrapClassName = '',
      onContentClick,
      disableBackdropClick = false,
      positionClassName = '',
      backdropClassName = '',
      layerClassName = '',
      role = 'dialog',
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledby,
      'aria-describedby': ariaDescribedby
    },
    ref
  ) => {
    const portal = usePortal('modal')
    const baseId = useId()
    const titleId = `${baseId}-title`
    const descriptionId = `${baseId}-description`
    const { SCALES } = useScale()

    const [, setBodyHidden] = useBodyScroll(null, { delayReset: 300 })
    const [visible, setVisible] = useState<boolean>(false)
    const [withoutActionsChildren, ActionsChildren] = pickChild(
      children,
      ModalAction
    )
    const hasActions =
      ActionsChildren && React.Children.count(ActionsChildren) > 0
    const closeModal = () => {
      onClose && onClose()
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
        keyboard && closeModal()
      },
      KeyCode.Escape,
      {
        disableGlobalEvent: true
      }
    )

    const closeFromBackdrop = () => {
      if (disableBackdropClick) return
      closeModal()
    }

    const modalConfig: ModalConfig = useMemo(
      () => ({
        close: closeModal,
        titleId,
        descriptionId
      }),
      []
    )

    if (!portal) return null
    return createPortal(
      <ModalContext.Provider value={modalConfig}>
        <Backdrop
          onClick={closeFromBackdrop}
          onContentClick={onContentClick}
          visible={visible}
          width={SCALES.width(26)}
          positionClassName={positionClassName}
          backdropClassName={backdropClassName}
          layerClassName={layerClassName}
          {...bindings}
        >
          <ModalWrapper
            ref={ref}
            visible={visible}
            className={wrapClassName}
            role={role}
            aria-label={ariaLabel}
            aria-labelledby={
              ariaLabelledby ||
              (hasChild(children, ModalTitle) ? titleId : undefined)
            }
            aria-describedby={
              ariaDescribedby ||
              (hasChild(children, ModalSubtitle) ? descriptionId : undefined)
            }
          >
            {withoutActionsChildren}
            {hasActions && <ModalActions>{ActionsChildren}</ModalActions>}
          </ModalWrapper>
        </Backdrop>
      </ModalContext.Provider>,
      portal
    )
  }
)

ModalComponent.displayName = 'BolioUIModal'
const Modal = withScale(ModalComponent)
export default Modal
