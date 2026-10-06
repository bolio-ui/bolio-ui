import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import axe from 'axe-core'
import { BolioUIProvider, Carousel } from '..'

// jsdom does no layout: each slide sits 100px after the previous one
beforeAll(() => {
  Object.defineProperty(HTMLElement.prototype, 'offsetLeft', {
    configurable: true,
    get(this: HTMLElement) {
      return Array.from(this.parentElement?.children || []).indexOf(this) * 100
    }
  })
})
afterAll(() => {
  delete (HTMLElement.prototype as { offsetLeft?: number }).offsetLeft
})
beforeEach(() => jest.useFakeTimers())
afterEach(() => jest.useRealTimers())

type Props = Partial<React.ComponentProps<typeof Carousel>>
const setup = (props: Props = {}, count = 5) =>
  render(
    <BolioUIProvider>
      <Carousel aria-label="Highlights" {...props}>
        {Array.from({ length: count }, (_, index) => (
          <div key={index}>Slide {index + 1}</div>
        ))}
      </Carousel>
    </BolioUIProvider>
  )

const viewport = () =>
  screen.getByRole('region', { name: 'Highlights' })
    .firstElementChild as HTMLElement
const current = () =>
  screen
    .getAllByRole('button', { name: /Go to slide/ })
    .findIndex((dot) => dot.hasAttribute('aria-current'))
const settle = () => act(() => void jest.advanceTimersByTime(150))

describe('<Carousel />', () => {
  it('is a named carousel with every slide labeled by its position', () => {
    setup()
    expect(screen.getByRole('region', { name: 'Highlights' })).toHaveAttribute(
      'aria-roledescription',
      'carousel'
    )
    const slides = screen.getAllByRole('group')
    expect(slides).toHaveLength(5)
    expect(slides[0]).toHaveAccessibleName('1 of 5')
    expect(slides[4]).toHaveAttribute('aria-roledescription', 'slide')
  })

  it('has one indicator per position, the first one current', () => {
    setup()
    expect(screen.getAllByRole('button', { name: /Go to slide/ })).toHaveLength(
      5
    )
    expect(current()).toBe(0)
  })

  it('goes to a slide from its indicator and reports it', () => {
    const onChange = jest.fn()
    setup({ onChange })
    fireEvent.click(screen.getByRole('button', { name: 'Go to slide 3' }))
    expect(viewport().scrollLeft).toBe(200)
    expect(onChange).toHaveBeenCalledWith(2)
    expect(current()).toBe(2)
  })

  it('moves with the previous and next buttons, which stop at the ends', () => {
    setup()
    const previous = screen.getByRole('button', { name: 'Previous slide' })
    const next = screen.getByRole('button', { name: 'Next slide' })
    expect(previous).toBeDisabled()
    fireEvent.click(next)
    expect(current()).toBe(1)
    expect(previous).toBeEnabled()
    for (let step = 0; step < 3; step += 1) fireEvent.click(next)
    expect(current()).toBe(4)
    expect(next).toBeDisabled()
  })

  it('follows the scroll and reports the slide it rests on', () => {
    const onChange = jest.fn()
    setup({ onChange })
    viewport().scrollLeft = 290
    fireEvent.scroll(viewport())
    expect(onChange).not.toHaveBeenCalled()
    settle()
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith(3)
    expect(current()).toBe(3)
  })

  it('shows several slides, and only the positions the first one can take', () => {
    setup({ slidesToShow: 3 })
    expect(screen.getAllByRole('button', { name: /Go to slide/ })).toHaveLength(
      3
    )
    fireEvent.click(screen.getByRole('button', { name: 'Go to slide 3' }))
    expect(screen.getByRole('button', { name: 'Next slide' })).toBeDisabled()
  })

  it('hides the controls when every slide is in view', () => {
    setup({ slidesToShow: 3 }, 3)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('can hide the buttons or the indicators', () => {
    const { unmount } = setup({ controls: false })
    expect(
      screen.queryByRole('button', { name: 'Next slide' })
    ).not.toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /Go to slide/ })).toHaveLength(
      5
    )
    unmount()
    setup({ indicators: false })
    expect(
      screen.queryByRole('button', { name: /Go to slide/ })
    ).not.toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Next slide' })
    ).toBeInTheDocument()
  })

  it('follows value when controlled and only reports the change', () => {
    const onChange = jest.fn()
    setup({ value: 1, onChange })
    expect(viewport().scrollLeft).toBe(100)
    expect(current()).toBe(1)
    fireEvent.click(screen.getByRole('button', { name: 'Next slide' }))
    expect(onChange).toHaveBeenCalledWith(2)
    expect(current()).toBe(1)
  })

  it('starts on initialValue', () => {
    setup({ initialValue: 2 })
    expect(current()).toBe(2)
  })

  it('uses the labels it is given', () => {
    setup({
      previousLabel: 'Anterior',
      nextLabel: 'Próximo',
      slideLabel: (index, count) => `Slide ${index + 1} de ${count}`,
      indicatorLabel: (index) => `Ir para ${index + 1}`
    })
    expect(screen.getByRole('button', { name: 'Anterior' })).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Ir para 2' })
    ).toBeInTheDocument()
    expect(screen.getAllByRole('group')[0]).toHaveAccessibleName('Slide 1 de 5')
  })

  it('has no accessibility violations', async () => {
    jest.useRealTimers()
    const { container } = setup()
    const results = await axe.run(container, {
      rules: { region: { enabled: false } }
    })
    expect(results.violations).toEqual([])
  })
})
