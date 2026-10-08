import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import axe from 'axe-core'
import { BolioUIProvider, ImageZoom } from '..'

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

type Props = Partial<React.ComponentProps<typeof ImageZoom>>
const setup = (props: Props = {}) =>
  render(
    <BolioUIProvider>
      <ImageZoom src="/small.jpg" alt="A lake at sunrise" {...props} />
    </BolioUIProvider>
  )

const trigger = () => screen.getByRole('button', { name: 'A lake at sunrise' })
const zoomed = () => document.querySelector('dialog img') as HTMLImageElement

describe('<ImageZoom />', () => {
  it('is a button named by the image, and closed until it is clicked', () => {
    setup()
    expect(trigger()).toHaveAttribute('aria-haspopup', 'dialog')
    expect(trigger().querySelector('img')).toHaveAttribute(
      'alt',
      'A lake at sunrise'
    )
    expect(document.querySelector('dialog')).not.toBeInTheDocument()
  })

  it('opens a modal dialog with the image on a click', () => {
    setup()
    fireEvent.click(trigger())
    const dialog = screen.getByRole('dialog', { name: 'A lake at sunrise' })
    expect(showModal).toHaveBeenCalledTimes(1)
    expect(dialog).toHaveAttribute('open')
    expect(zoomed()).toHaveAttribute('src', '/small.jpg')
    expect(zoomed()).toHaveAttribute('alt', 'A lake at sunrise')
  })

  it('shows the larger image, and does not ask for it before it opens', () => {
    setup({ zoomSrc: '/large.jpg' })
    expect(
      document.querySelector('img[src="/large.jpg"]')
    ).not.toBeInTheDocument()
    fireEvent.click(trigger())
    expect(zoomed()).toHaveAttribute('src', '/large.jpg')
  })

  it('shows the caption', () => {
    setup({ caption: 'Taken in October' })
    fireEvent.click(trigger())
    expect(screen.getByText('Taken in October').tagName).toBe('FIGCAPTION')
  })

  it('closes with its button', () => {
    setup()
    fireEvent.click(trigger())
    fireEvent.click(screen.getByRole('button', { name: 'Close' }))
    expect(document.querySelector('dialog')).not.toBeInTheDocument()
  })

  it('closes when the browser closes it, as Escape does', () => {
    setup()
    fireEvent.click(trigger())
    fireEvent(
      document.querySelector('dialog') as HTMLElement,
      new Event('close')
    )
    expect(document.querySelector('dialog')).not.toBeInTheDocument()
  })

  it('closes with Escape even when the page cancels that key', () => {
    setup()
    fireEvent.click(trigger())
    const dialog = document.querySelector('dialog') as HTMLElement
    // what a global shortcut handler does: the browser would not close it
    window.addEventListener('keydown', (event) => event.preventDefault(), {
      once: true
    })
    fireEvent.keyDown(dialog, { key: 'Escape' })
    expect(document.querySelector('dialog')).not.toBeInTheDocument()
  })

  it('closes with a click on the dark area, but not on the image', () => {
    setup()
    fireEvent.click(trigger())
    fireEvent.click(zoomed())
    expect(document.querySelector('dialog')).toBeInTheDocument()
    fireEvent.click(document.querySelector('dialog') as HTMLElement)
    expect(document.querySelector('dialog')).not.toBeInTheDocument()
  })

  it('can open again after it closed', () => {
    setup()
    fireEvent.click(trigger())
    fireEvent.click(screen.getByRole('button', { name: 'Close' }))
    fireEvent.click(trigger())
    expect(screen.getByRole('dialog')).toHaveAttribute('open')
    expect(showModal).toHaveBeenCalledTimes(2)
  })

  it('uses the label it is given and passes the size to the image', () => {
    setup({ closeLabel: 'Fechar', width: '120px', height: '80px' })
    expect(trigger().querySelector('img')?.style.width).toBe('120px')
    fireEvent.click(trigger())
    expect(screen.getByRole('button', { name: 'Fechar' })).toBeInTheDocument()
  })

  it('has no accessibility violations, closed and open', async () => {
    const { container } = setup({ caption: 'Taken in October' })
    const options = { rules: { region: { enabled: false } } }
    expect((await axe.run(container, options)).violations).toEqual([])
    fireEvent.click(trigger())
    expect((await axe.run(document.body, options)).violations).toEqual([])
  })
})
