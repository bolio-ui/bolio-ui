import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { BolioUIProvider, Autocomplete, Tag } from '..'

const data = ['Apple', 'Banana', { value: 'cherry', label: 'Cherry' }]

const setup = (
  props: Partial<React.ComponentProps<typeof Autocomplete>> = {}
) => {
  const onChange = jest.fn()
  render(
    <BolioUIProvider>
      <Autocomplete
        aria-label="Fruit"
        data={data}
        onChange={onChange}
        {...props}
      />
    </BolioUIProvider>
  )
  return {
    input: screen.getByRole('combobox', { name: 'Fruit' }) as HTMLInputElement,
    onChange
  }
}

describe('<Autocomplete />', () => {
  it('keeps any typed text and reports it', () => {
    const { input, onChange } = setup()
    fireEvent.change(input, { target: { value: 'Mango' } })
    expect(input.value).toBe('Mango')
    expect(onChange).toHaveBeenLastCalledWith('Mango')
    // nothing matches: no list and no empty message
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    expect(screen.queryByText('No results')).not.toBeInTheDocument()
  })

  it('keeps the text on blur', () => {
    const { input } = setup()
    fireEvent.change(input, { target: { value: 'Mango' } })
    fireEvent.blur(input)
    expect(input.value).toBe('Mango')
  })

  it('suggests matches while typing', () => {
    const { input } = setup()
    fireEvent.change(input, { target: { value: 'an' } })
    expect(screen.getAllByRole('option').map((o) => o.textContent)).toEqual([
      'Banana'
    ])
  })

  it('does not highlight a suggestion, so Enter keeps the text', () => {
    const { input, onChange } = setup()
    fireEvent.change(input, { target: { value: 'a' } })
    expect(input).not.toHaveAttribute('aria-activedescendant')
    onChange.mockClear()
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(onChange).not.toHaveBeenCalled()
    expect(input.value).toBe('a')
  })

  it('picks a suggestion with the arrows and Enter', () => {
    const { input, onChange } = setup()
    // the first press opens the list, the second highlights a suggestion
    fireEvent.keyDown(input, { key: 'ArrowDown' })
    fireEvent.keyDown(input, { key: 'ArrowDown' })
    const [first] = screen.getAllByRole('option')
    expect(input).toHaveAttribute('aria-activedescendant', first.id)
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(input.value).toBe('Apple')
    expect(onChange).toHaveBeenLastCalledWith('Apple')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('puts the value of a labelled suggestion in the input', () => {
    const { input, onChange } = setup()
    fireEvent.change(input, { target: { value: 'che' } })
    fireEvent.mouseDown(screen.getByRole('option', { name: 'Cherry' }))
    expect(input.value).toBe('cherry')
    expect(onChange).toHaveBeenLastCalledWith('cherry')
  })

  it('follows the controlled value', () => {
    const { rerender } = render(
      <BolioUIProvider>
        <Autocomplete aria-label="Fruit" data={data} value="Pear" />
      </BolioUIProvider>
    )
    const input = screen.getByRole('combobox') as HTMLInputElement
    expect(input.value).toBe('Pear')
    rerender(
      <BolioUIProvider>
        <Autocomplete aria-label="Fruit" data={data} value="Kiwi" />
      </BolioUIProvider>
    )
    expect(input.value).toBe('Kiwi')
  })

  it('starts with initialValue', () => {
    const { input } = setup({ initialValue: 'Plum' })
    expect(input.value).toBe('Plum')
  })
})

describe('<Tag onClose />', () => {
  it('renders no button without onClose', () => {
    render(<Tag>Draft</Tag>)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('renders a named button that calls onClose', () => {
    const onClose = jest.fn()
    render(
      <Tag onClose={onClose} closeLabel="Remove Draft">
        Draft
      </Tag>
    )
    fireEvent.click(screen.getByRole('button', { name: 'Remove Draft' }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
