import React, { MouseEvent, useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import usePortal from '../utils/use-portal'
import ModalWrapper from './ModalWrapper'
import ModalAction from './ModalAction'
import ModalActions from './ModalActions'
import Backdrop from '../Shared/backdrop'
import { ModalConfig, ModalContext } from './ModalContext'
import { pickChild } from '../utils/collections'
import useBodyScroll from '../utils/use-body-scroll'
import useScale, { withScale } from '../use-scale'
import useKeyboard, { KeyCode } from '../use-keyboard'

interface Props {
  disableBackdropClick?: boolean
  onClose?: () => void
  onContentClick?: (event: MouseEvent<HTMLElement>) => void
  visible?: boolean
  keyboard?: boolean
  wrapClassName?: string
  positionClassName?: string
  backdropClassName?: string
  layerClassName?: string
}

type NativeAttrs = Omit<React.HTMLAttributes<any>, keyof Props>
export type ModalProps = Props & NativeAttrs

function ModalComponent({
  visible: customVisible,
  onClose,
  children,
  keyboard = true,
  wrapClassName = '',
  onContentClick,
  disableBackdropClick = false,
  positionClassName = '',
  backdropClassName = '',
  layerClassName = ''
}: React.PropsWithChildren<ModalProps>) {
  const portal = usePortal('modal')
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
      close: closeModal
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
        <ModalWrapper visible={visible} className={wrapClassName}>
          {withoutActionsChildren}
          {hasActions && <ModalActions>{ActionsChildren}</ModalActions>}
        </ModalWrapper>
      </Backdrop>
    </ModalContext.Provider>,
    portal
  )
}

ModalComponent.displayName = 'BolioUIModal'
const Modal = withScale(ModalComponent)
export default Modal
