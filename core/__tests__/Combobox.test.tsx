import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { BolioUIProvider, Combobox } from '..'

const options = [
  { value: 'br', label: 'Brazil' },
  { value: 'pt', label: 'Portugal' },
  { value: 'us', label: 'United States' },
  { value: 'xx', label: 'Nowhere', disabled: true }
]

const setup = (props: Partial<React.ComponentProps<typeof Combobox>> = {}) => {
  const onChange = jest.fn()
  render(
    <BolioUIProvider>
      <Combobox
        aria-label="Country"
        options={options}
        onChange={onChange}
        {...props}
      />
    </BolioUIProvider>
  )
  return { input: screen.getByRole('combobox', { name: 'Country' }), onChange }
}

describe('<Combobox />', () => {
  it('starts closed and opens with the arrow key', () => {
    const { input } = setup()
    expect(input).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()

    fireEvent.keyDown(input, { key: 'ArrowDown' })
    expect(input).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('listbox')).toBeInTheDocument()
    expect(screen.getAllByRole('option')).toHaveLength(4)
  })

  it('filters the options while typing', () => {
    const { input } = setup()
    fireEvent.change(input, { target: { value: 'por' } })
    expect(screen.getAllByRole('option').map((o) => o.textContent)).toEqual([
      'Portugal'
    ])
  })

  it('moves the active option with the arrows and skips disabled ones', () => {
    const { input } = setup()
    fireEvent.keyDown(input, { key: 'ArrowDown' })
    const [first, second, third] = screen.getAllByRole('option')
    expect(input).toHaveAttribute('aria-activedescendant', first.id)

    fireEvent.keyDown(input, { key: 'ArrowDown' })
    expect(input).toHaveAttribute('aria-activedescendant', second.id)
    fireEvent.keyDown(input, { key: 'ArrowDown' })
    expect(input).toHaveAttribute('aria-activedescendant', third.id)
    // the last option is disabled: it wraps to the first
    fireEvent.keyDown(input, { key: 'ArrowDown' })
    expect(input).toHaveAttribute('aria-activedescendant', first.id)
    fireEvent.keyDown(input, { key: 'ArrowUp' })
    expect(input).toHaveAttribute('aria-activedescendant', third.id)
  })

  it('selects with Enter, shows the label and closes', () => {
    const { input, onChange } = setup()
    fireEvent.keyDown(input, { key: 'ArrowDown' })
    fireEvent.keyDown(input, { key: 'ArrowDown' })
    fireEvent.keyDown(input, { key: 'Enter' })

    expect(onChange).toHaveBeenCalledWith('pt')
    expect(input).toHaveValue('Portugal')
    expect(input).toHaveAttribute('aria-expanded', 'false')
  })

  it('selects with a click and marks the option as selected', () => {
    const { input, onChange } = setup()
    fireEvent.focus(input)
    fireEvent.keyDown(input, { key: 'ArrowDown' })
    fireEvent.mouseDown(screen.getByRole('option', { name: 'United States' }))

    expect(onChange).toHaveBeenCalledWith('us')
    expect(input).toHaveValue('United States')

    fireEvent.keyDown(input, { key: 'ArrowDown' })
    expect(
      screen.getByRole('option', { name: 'United States' })
    ).toHaveAttribute('aria-selected', 'true')
  })

  it('does not select a disabled option', () => {
    const { input, onChange } = setup()
    fireEvent.keyDown(input, { key: 'ArrowDown' })
    fireEvent.mouseDown(screen.getByRole('option', { name: 'Nowhere' }))
    expect(onChange).not.toHaveBeenCalled()
    expect(input).toHaveAttribute('aria-expanded', 'true')
  })

  it('closes with Escape', () => {
    const { input } = setup()
    fireEvent.keyDown(input, { key: 'ArrowDown' })
    fireEvent.keyDown(input, { key: 'Escape' })
    expect(input).toHaveAttribute('aria-expanded', 'false')
  })

  it('restores the selected label when it loses the focus with other text', () => {
    const { input } = setup({ initialValue: 'br' })
    expect(input).toHaveValue('Brazil')
    fireEvent.change(input, { target: { value: 'zzz' } })
    fireEvent.blur(input)
    expect(input).toHaveValue('Brazil')
  })

  it('clears the selection when the text is emptied', () => {
    const { input, onChange } = setup({ initialValue: 'br' })
    fireEvent.change(input, { target: { value: '' } })
    expect(onChange).toHaveBeenCalledWith(null)
  })

  it('shows the empty text and announces the number of results', () => {
    const { input } = setup({ emptyText: 'Nothing found' })
    fireEvent.change(input, { target: { value: 'zzz' } })
    expect(screen.getByText('Nothing found')).toBeInTheDocument()
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    expect(input).toHaveAttribute('aria-expanded', 'false')

    fireEvent.change(input, { target: { value: 'b' } })
    expect(screen.getByRole('status')).toHaveTextContent('1 result available')
  })

  it('follows the value when it is controlled', () => {
    const { rerender } = render(
      <BolioUIProvider>
        <Combobox aria-label="Country" options={options} value="us" />
      </BolioUIProvider>
    )
    expect(screen.getByRole('combobox')).toHaveValue('United States')
    rerender(
      <BolioUIProvider>
        <Combobox aria-label="Country" options={options} value="br" />
      </BolioUIProvider>
    )
    expect(screen.getByRole('combobox')).toHaveValue('Brazil')
  })

  it('does nothing when disabled', () => {
    const { input } = setup({ disabled: true })
    expect(input).toBeDisabled()
  })
})
