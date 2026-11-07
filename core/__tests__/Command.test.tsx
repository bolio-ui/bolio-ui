import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { BolioUIProvider, Command } from '..'

const items = [
  { value: 'new', label: 'New file', hint: 'N', onSelect: jest.fn() },
  { value: 'open', label: 'Open folder', icon: <i>o</i>, onSelect: jest.fn() },
  { value: 'save', label: 'Save all' }
]

const wrap = (props: Partial<React.ComponentProps<typeof Command>> = {}) => (
  <BolioUIProvider>
    <Command visible items={items} {...props} />
  </BolioUIProvider>
)

const selected = () =>
  screen
    .getAllByRole('option')
    .filter((option) => option.getAttribute('aria-selected') === 'true')
    .map((option) => option.textContent)

describe('<Command />', () => {
  beforeEach(() => jest.clearAllMocks())

  it('lists every item, with its icon and hint', async () => {
    render(wrap())
    expect(await screen.findAllByRole('option')).toHaveLength(3)
    expect(screen.getByText('N')).toBeInTheDocument()
    expect(screen.getByText('o')).toBeInTheDocument()
    expect(selected()).toEqual(['New fileN'])
  })

  it('filters by what is typed, and explains an empty result', async () => {
    render(wrap({ emptyText: 'Nothing here' }))
    const input = await screen.findByRole('combobox')
    fireEvent.change(input, { target: { value: ' OPEN ' } })
    expect(screen.getAllByRole('option')).toHaveLength(1)
    fireEvent.change(input, { target: { value: 'zzz' } })
    expect(screen.queryAllByRole('option')).toHaveLength(0)
    expect(screen.getByText('Nothing here')).toBeInTheDocument()
  })

  it('moves the active item with the arrows and wraps around', async () => {
    render(wrap())
    const input = await screen.findByRole('combobox')
    fireEvent.keyDown(input, { key: 'ArrowUp' })
    expect(selected()).toEqual(['Save all'])
    fireEvent.keyDown(input, { key: 'ArrowDown' })
    expect(selected()).toEqual(['New fileN'])
    fireEvent.keyDown(input, { key: 'ArrowDown' })
    expect(selected()).toEqual(['oOpen folder'])
  })

  it('selects the active item with Enter and closes', async () => {
    const onClose = jest.fn()
    render(wrap({ onClose }))
    const input = await screen.findByRole('combobox')
    fireEvent.keyDown(input, { key: 'ArrowDown' })
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(items[1].onSelect).toHaveBeenCalledTimes(1)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('selects with a click, and follows the mouse', async () => {
    const onClose = jest.fn()
    render(wrap({ onClose }))
    const [, open] = await screen.findAllByRole('option')
    fireEvent.mouseEnter(open)
    expect(selected()).toEqual([open.textContent])
    fireEvent.click(open)
    expect(items[1].onSelect).toHaveBeenCalledTimes(1)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('closes on an item without onSelect, and ignores Enter without results', async () => {
    const onClose = jest.fn()
    render(wrap({ onClose }))
    const input = await screen.findByRole('combobox')
    fireEvent.click(screen.getByText('Save all'))
    expect(onClose).toHaveBeenCalledTimes(1)
    fireEvent.change(input, { target: { value: 'zzz' } })
    fireEvent.keyDown(input, { key: 'ArrowDown' })
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('starts empty every time it opens', async () => {
    const { rerender } = render(wrap())
    const input = await screen.findByRole('combobox')
    fireEvent.change(input, { target: { value: 'save' } })
    rerender(wrap({ visible: false }))
    rerender(wrap({ visible: true }))
    expect(await screen.findAllByRole('option')).toHaveLength(3)
    expect(screen.getByRole('combobox')).toHaveValue('')
  })
})
