import Modal from './Modal'
import ModalTitle from './ModalTitle'
import ModalSubtitle from './ModalSubtitle'
import ModalContent from './ModalContent'
import ModalAction from './ModalAction'

export type ModalComponentType = typeof Modal & {
  Title: typeof ModalTitle
  Subtitle: typeof ModalSubtitle
  Content: typeof ModalContent
  Action: typeof ModalAction
}
;(Modal as ModalComponentType).Title = ModalTitle
;(Modal as ModalComponentType).Subtitle = ModalSubtitle
;(Modal as ModalComponentType).Content = ModalContent
;(Modal as ModalComponentType).Action = ModalAction

export type { ModalProps } from './Modal'
export type { ModalTitleProps } from './ModalTitle'
export type { ModalSubtitleProps } from './ModalSubtitle'
export type { ModalActionProps } from './ModalAction'
export type { ModalContentProps } from './ModalContent'
export default Modal as ModalComponentType
