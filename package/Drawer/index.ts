import Drawer from './Drawer'
import ModalTitle from '../Modal/ModalTitle'
import ModalSubtitle from '../Modal/ModalSubtitle'
import ModalContent from '../Modal/ModalContent'

export type DrawerComponentType = typeof Drawer & {
  Title: typeof ModalTitle
  Subtitle: typeof ModalSubtitle
  Content: typeof ModalContent
}
;(Drawer as DrawerComponentType).Title = ModalTitle
;(Drawer as DrawerComponentType).Subtitle = ModalSubtitle
;(Drawer as DrawerComponentType).Content = ModalContent

export type { DrawerProps } from './Drawer'
export type {
  ModalTitleProps as DrawerTitleProps,
  ModalSubtitleProps as DrawerSubtitleProps,
  ModalContentProps as DrawerContentProps
} from '../Modal'
export default Drawer as DrawerComponentType
