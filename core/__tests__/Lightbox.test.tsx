import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import axe from 'axe-core'
import { BolioUIProvider, Lightbox } from '..'

// jsdom does not implement the dialog: showModal opens it, and close closes it
// and sends the event the browser sends
const showModal = jest.fn(function (this: HTMLDialogElement) {
  this.setAttribute('open', '')
})
beforeAll(() => {
  Object.assign(HTMLDialogElement.prototype, {
    showModal,
    close(this: HTMLDialogElement) {
      this.removeAttribute('open')
      this.dispatchEvent(new Event('close'))
    }
  })
})
beforeEach(() => showModal.mockClear())

const images = [
  { src: '/one.jpg', alt: 'One', caption: 'First' },
  { src: '/two.jpg', alt: 'Two' },
  { src: '/three.jpg', alt: 'Three' }
]

const setup = (props: Partial<React.ComponentProps<typeof Lightbox>> = {}) => {
  const onClose = jest.fn()
  const onIndexChange = jest.fn()
  const view = render(
    <BolioUIProvider>
      <Lightbox
        images={images}
        opened
        onClose={onClose}
        onIndexChange={onIndexChange}
        {...props}
      />
    </BolioUIProvider>
  )
  return { onClose, onIndexChange, ...view }
}

const shown = () => document.querySelector('dialog img') as HTMLImageElement
const dialog = () => document.querySelector('dialog') as HTMLDialogElement

describe('<Lightbox />', () => {
  it('renders nothing while it is closed', () => {
    setup({ opened: false })
    expect(dialog()).toBeNull()
  })

  it('opens a modal dialog with the first image, its caption and the count', () => {
    setup()
    expect(showModal).toHaveBeenCalledTimes(1)
    expect(dialog()).toHaveAttribute('aria-label', 'Image gallery')
    expect(shown()).toHaveAttribute('alt', 'One')
    expect(screen.getByText('First')).toBeInTheDocument()
    expect(screen.getByText('1 / 3')).toBeInTheDocument()
  })

  it('moves with the buttons and the arrow keys', () => {
    const { onIndexChange } = setup()
    fireEvent.click(screen.getByRole('button', { name: 'Next image' }))
    expect(shown()).toHaveAttribute('alt', 'Two')
    expect(onIndexChange).toHaveBeenLastCalledWith(1)
    fireEvent.keyDown(dialog(), { key: 'ArrowRight' })
    expect(shown()).toHaveAttribute('alt', 'Three')
    fireEvent.keyDown(dialog(), { key: 'ArrowLeft' })
    expect(shown()).toHaveAttribute('alt', 'Two')
    fireEvent.click(screen.getByRole('button', { name: 'Previous image' }))
    expect(shown()).toHaveAttribute('alt', 'One')
  })

  it('stops at the ends, or goes around with loop', () => {
    const view = setup({ initialIndex: 2 })
    expect(screen.getByRole('button', { name: 'Next image' })).toBeDisabled()
    fireEvent.keyDown(dialog(), { key: 'ArrowRight' })
    expect(shown()).toHaveAttribute('alt', 'Three')
    view.unmount()
    setup({ initialIndex: 2, loop: true })
    expect(screen.getByRole('button', { name: 'Next image' })).toBeEnabled()
    fireEvent.keyDown(dialog(), { key: 'ArrowRight' })
    expect(shown()).toHaveAttribute('alt', 'One')
    fireEvent.keyDown(dialog(), { key: 'ArrowLeft' })
    expect(shown()).toHaveAttribute('alt', 'Three')
  })

  it('shows a controlled index', () => {
    setup({ index: 1 })
    expect(shown()).toHaveAttribute('alt', 'Two')
    fireEvent.keyDown(dialog(), { key: 'ArrowRight' })
    expect(shown()).toHaveAttribute('alt', 'Two')
  })

  it('closes with Escape', () => {
    const { onClose } = setup()
    fireEvent.keyDown(dialog(), { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('closes with the button', () => {
    const { onClose } = setup()
    fireEvent.click(screen.getByRole('button', { name: 'Close' }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('closes on a click on the dark area, not on the image', () => {
    const { onClose } = setup()
    fireEvent.click(shown())
    expect(onClose).not.toHaveBeenCalled()
    fireEvent.click(dialog())
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('has no previous or next button with a single image', () => {
    setup({ images: [images[0]] })
    expect(screen.queryByRole('button', { name: 'Next image' })).toBeNull()
    expect(screen.queryByText('1 / 1')).toBeNull()
  })

  it('forwards the ref to the dialog and has no violations', async () => {
    const ref = React.createRef<HTMLDialogElement>()
    const { container } = setup({ ref })
    expect(ref.current).toBeInstanceOf(HTMLDialogElement)
    const result = await axe.run(container.ownerDocument.body, {
      rules: { region: { enabled: false } }
    })
    expect(result.violations.map((v) => v.id)).toEqual([])
  })
})
