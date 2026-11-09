import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState
} from 'react'
import Modal from '../Modal'
import type { ModalProps } from '../Modal'
import type { ModalActionProps } from '../Modal'

type FrameProps = Omit<ModalProps, 'visible' | 'children' | 'title'>

export interface OpenModalOptions extends FrameProps {
  id?: string
  title?: React.ReactNode
  subtitle?: React.ReactNode
  children?: React.ReactNode
}

export interface ConfirmModalOptions extends OpenModalOptions {
  labels?: { confirm?: string; cancel?: string }
  onConfirm?: () => void
  onCancel?: () => void
  closeOnConfirm?: boolean
  closeOnCancel?: boolean
  confirmProps?: Partial<ModalActionProps>
  cancelProps?: Partial<ModalActionProps>
}

export interface ModalsApi {
  // each one returns the id of the modal, to close or update it later
  open: (options: OpenModalOptions) => string
  openConfirm: (options: ConfirmModalOptions) => string
  update: (
    id: string,
    options: Partial<OpenModalOptions & ConfirmModalOptions>
  ) => void
  close: (id: string) => void
  closeAll: () => void
}

interface Item {
  id: string
  kind: 'content' | 'confirm'
  options: OpenModalOptions & ConfirmModalOptions
}

const ModalsContext = createContext<ModalsApi | null>(null)

export interface ModalsProviderProps {
  // default texts of the confirm buttons
  labels?: { confirm?: string; cancel?: string }
  children?: React.ReactNode
}

const ModalsProvider: React.FC<ModalsProviderProps> = ({
  labels,
  children
}) => {
  const [items, setItems] = useState<Item[]>([])
  const counter = useRef(0)

  const add = useCallback((kind: Item['kind'], options: Item['options']) => {
    const id = options.id || `bolio-modal-${++counter.current}`
    setItems((last) => [
      ...last.filter((item) => item.id !== id),
      { id, kind, options }
    ])
    return id
  }, [])

  const api = useMemo<ModalsApi>(
    () => ({
      open: (options) => add('content', options),
      openConfirm: (options) => add('confirm', options),
      update: (id, options) =>
        setItems((last) =>
          last.map((item) =>
            item.id === id
              ? { ...item, options: { ...item.options, ...options } }
              : item
          )
        ),
      close: (id) => setItems((last) => last.filter((item) => item.id !== id)),
      closeAll: () => setItems([])
    }),
    [add]
  )

  return (
    <ModalsContext.Provider value={api}>
      {children}
      {items.map(({ id, kind, options }) => {
        const {
          title,
          subtitle,
          children: content,
          labels: ownLabels,
          onConfirm,
          onCancel,
          onClose,
          closeOnConfirm = true,
          closeOnCancel = true,
          confirmProps,
          cancelProps,
          id: _id,
          ...frame
        } = options
        void _id
        const text = {
          confirm: 'Confirm',
          cancel: 'Cancel',
          ...labels,
          ...ownLabels
        }
        return (
          <Modal
            key={id}
            {...frame}
            visible
            role={kind === 'confirm' ? 'alertdialog' : frame.role}
            // closed by the user, with Escape, the backdrop or an action
            onClose={() => {
              api.close(id)
              if (onClose) onClose()
            }}
          >
            {title && <Modal.Title>{title}</Modal.Title>}
            {subtitle && <Modal.Subtitle>{subtitle}</Modal.Subtitle>}
            {content !== undefined && <Modal.Content>{content}</Modal.Content>}
            {kind === 'confirm' && (
              <>
                <Modal.Action
                  passive
                  {...cancelProps}
                  onClick={() => {
                    if (onCancel) onCancel()
                    if (closeOnCancel) api.close(id)
                  }}
                >
                  {text.cancel}
                </Modal.Action>
                <Modal.Action
                  {...confirmProps}
                  onClick={() => {
                    if (onConfirm) onConfirm()
                    if (closeOnConfirm) api.close(id)
                  }}
                >
                  {text.confirm}
                </Modal.Action>
              </>
            )}
          </Modal>
        )
      })}
    </ModalsContext.Provider>
  )
}

ModalsProvider.displayName = 'BolioUIModalsProvider'

export const useModals = (): ModalsApi => {
  const api = useContext(ModalsContext)
  if (!api) throw new Error('useModals must be used inside <ModalsProvider>')
  return api
}

export default ModalsProvider
