import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import axe from 'axe-core'
import { BolioUIProvider, Tour } from '..'
import type { TourStep } from '..'

const rect = (left: number, top: number, width = 200, height = 40) =>
  ({
    left,
    top,
    width,
    height,
    right: left + width,
    bottom: top + height
  }) as DOMRect

let targetRect = rect(100, 50)
const scrollIntoView = jest.fn()
beforeEach(() => {
  targetRect = rect(100, 50)
  scrollIntoView.mockClear()
  Object.assign(Element.prototype, { scrollIntoView })
  jest.spyOn(console, 'error').mockImplementation(() => undefined)
  jest.spyOn(console, 'warn').mockImplementation(() => undefined)
})
afterEach(() => jest.restoreAllMocks())

const steps: Array<TourStep> = [
  { target: '#target', title: 'First', content: 'About the target' },
  { target: '#target', title: 'Second', content: 'More' },
  { title: 'Last', content: 'Nothing to point at' }
]

type Props = Partial<React.ComponentProps<typeof Tour>>
const setup = (props: Props = {}) => {
  const view = render(
    <BolioUIProvider>
      <button id="target">Target</button>
      <Tour open steps={steps} onClose={() => undefined} {...props} />
    </BolioUIProvider>
  )
  const target = document.getElementById('target') as HTMLElement
  target.getBoundingClientRect = () => targetRect
  // a step that was drawn before the rect was set is drawn again
  act(() => void window.dispatchEvent(new Event('resize')))
  return view
}

const card = () => screen.getByRole('dialog')
const spotlight = () =>
  document.querySelector('.spotlight') as HTMLElement | null
const button = (name: string) => screen.getByRole('button', { name })

describe('<Tour />', () => {
  it('shows nothing while it is closed', () => {
    setup({ open: false })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('is a dialog named by the title and described by the content', () => {
    setup()
    expect(card()).toHaveAccessibleName('First')
    expect(card()).toHaveAccessibleDescription('About the target')
    expect(card()).toHaveAttribute('aria-modal', 'true')
    expect(screen.getByText('1 of 3')).toBeInTheDocument()
  })

  it('puts the focus on the card', () => {
    setup()
    expect(card()).toHaveFocus()
  })

  it('highlights the target, with some room around it', () => {
    setup()
    expect(spotlight()?.style.left).toBe('94px')
    expect(spotlight()?.style.top).toBe('44px')
    expect(spotlight()?.style.width).toBe('212px')
    expect(spotlight()?.style.height).toBe('52px')
  })

  it('scrolls the target into view', () => {
    setup()
    expect(scrollIntoView).toHaveBeenCalledWith({
      block: 'center',
      inline: 'nearest'
    })
  })

  it('places the card under the target, and above it when there is no room', () => {
    const { unmount } = setup()
    expect(card().style.top).toBe('104px')
    expect(card().style.left).toBe('100px')
    unmount()
    targetRect = rect(100, 700)
    setup()
    expect(card().style.top).toBe('')
    expect(card().style.bottom).toBe('82px')
  })

  it('keeps the card inside the screen', () => {
    targetRect = rect(1000, 50)
    setup()
    expect(card().style.left).toBe('696px')
  })

  it('goes forward and back, and has no way back on the first step', () => {
    const onCurrentChange = jest.fn()
    setup({ onCurrentChange })
    expect(
      screen.queryByRole('button', { name: 'Back' })
    ).not.toBeInTheDocument()
    fireEvent.click(button('Next'))
    expect(card()).toHaveAccessibleName('Second')
    expect(onCurrentChange).toHaveBeenLastCalledWith(1)
    fireEvent.click(button('Back'))
    expect(card()).toHaveAccessibleName('First')
    expect(onCurrentChange).toHaveBeenLastCalledWith(0)
  })

  it('ends with Done on the last step, which calls onFinish and then onClose', () => {
    const calls: Array<string> = []
    setup({
      initialCurrent: 2,
      onFinish: () => calls.push('finish'),
      onClose: () => calls.push('close')
    })
    expect(
      screen.queryByRole('button', { name: 'Next' })
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Skip' })
    ).not.toBeInTheDocument()
    fireEvent.click(button('Done'))
    expect(calls).toEqual(['finish', 'close'])
  })

  it('closes with Skip and with Escape', () => {
    const onClose = jest.fn()
    setup({ onClose })
    fireEvent.click(button('Skip'))
    expect(onClose).toHaveBeenCalledTimes(1)
    fireEvent.keyDown(card(), { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(2)
  })

  it('centers the card and highlights nothing when a step has no target', () => {
    setup({ initialCurrent: 2 })
    expect(spotlight()).toBeNull()
    expect(card()).toHaveClass('centered')
  })

  it('does the same when the target is not found', () => {
    setup({ steps: [{ target: '#nope', title: 'Lost', content: 'x' }] })
    expect(spotlight()).toBeNull()
    expect(card()).toHaveClass('centered')
  })

  it('takes the target as an element or as a function', () => {
    const element = document.createElement('button')
    element.getBoundingClientRect = () => targetRect
    document.body.appendChild(element)
    const { unmount } = setup({
      steps: [{ target: element, title: 'E', content: 'x' }]
    })
    expect(spotlight()).not.toBeNull()
    unmount()
    setup({ steps: [{ target: () => element, title: 'F', content: 'x' }] })
    expect(spotlight()).not.toBeNull()
    element.remove()
  })

  it('follows current when controlled and only reports the change', () => {
    const onCurrentChange = jest.fn()
    setup({ current: 0, onCurrentChange })
    fireEvent.click(button('Next'))
    expect(onCurrentChange).toHaveBeenCalledWith(1)
    expect(card()).toHaveAccessibleName('First')
  })

  it('keeps the focus on its buttons while it is open', () => {
    setup()
    const skip = button('Skip')
    const next = button('Next')
    next.focus()
    fireEvent.keyDown(next, { key: 'Tab' })
    expect(skip).toHaveFocus()
    fireEvent.keyDown(skip, { key: 'Tab', shiftKey: true })
    expect(next).toHaveFocus()
  })

  it('gives the focus back to where it was when it closes', () => {
    const Harness = () => {
      const [open, setOpen] = React.useState(false)
      return (
        <BolioUIProvider>
          <button onClick={() => setOpen(true)}>Start</button>
          <Tour
            open={open}
            steps={[{ title: 'Only', content: 'x' }]}
            onClose={() => setOpen(false)}
          />
        </BolioUIProvider>
      )
    }
    render(<Harness />)
    const start = screen.getByRole('button', { name: 'Start' })
    start.focus()
    fireEvent.click(start)
    expect(card()).toHaveFocus()
    fireEvent.click(button('Done'))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(start).toHaveFocus()
  })

  describe('on a dark and on a light theme', () => {
    const vars = (themeType: string) => {
      const view = render(
        <BolioUIProvider themeType={themeType}>
          <Tour open steps={steps} onClose={() => undefined} />
        </BolioUIProvider>
      )
      const root = document.querySelector('.tour') as HTMLElement
      const read = (name: string) => root.style.getPropertyValue(name)
      const result = {
        bg: read('--tour-bg'),
        shadow: read('--tour-shadow'),
        dim: read('--tour-dim')
      }
      view.unmount()
      return result
    }

    it('lifts the card with a lighter surface, and a tight shadow, on a dark theme', () => {
      const dark = vars('dark')
      expect(dark.bg).toBe('#171a20')
      expect(dark.shadow).toBe(
        '0 2px 6px rgb(0 0 0 / 40%), 0 8px 30px rgba(0, 0, 0, 0.35)'
      )
      expect(dark.dim).toBe('rgb(0 0 0 / 60%)')
    })

    it('uses the shadow of the theme on a light theme too', () => {
      const light = vars('light')
      expect(light.bg).toBe('#fff')
      expect(light.shadow).toBe('0 8px 30px rgba(0, 0, 0, 0.12)')
      expect(light.dim).toBe('rgb(0 0 0 / 55%)')
    })
  })

  it('uses the labels it is given', () => {
    setup({
      initialCurrent: 1,
      previousLabel: 'Voltar',
      nextLabel: 'Seguinte',
      skipLabel: 'Pular',
      stepLabel: (index, count) => `Passo ${index + 1} de ${count}`
    })
    expect(button('Voltar')).toBeInTheDocument()
    expect(button('Seguinte')).toBeInTheDocument()
    expect(button('Pular')).toBeInTheDocument()
    expect(screen.getByText('Passo 2 de 3')).toBeInTheDocument()
  })

  it('has no accessibility violations', async () => {
    setup()
    const results = await axe.run(document.body, {
      rules: { region: { enabled: false } }
    })
    expect(results.violations).toEqual([])
  })
})
