import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Mention } from '..'

const options = [
  { value: 'ana', label: 'Ana Souza' },
  { value: 'bruno', label: 'Bruno Lima' },
  { value: 'diego', label: 'Diego Prado', disabled: true }
]

// types `text` with the caret at the end, the way a user would
const type = (field: HTMLElement, text: string) => {
  const input = field as HTMLTextAreaElement
  fireEvent.change(input, {
    target: { value: text, selectionStart: text.length }
  })
  input.setSelectionRange(text.length, text.length)
}

const setup = (props = {}) => {
  render(<Mention aria-label="Comment" options={options} {...props} />)
  return screen.getByRole('textbox', { name: 'Comment' })
}

describe('<Mention />', () => {
  it('stays closed until the trigger is typed', () => {
    const field = setup()
    type(field, 'hello ')
    expect(screen.queryByRole('listbox')).toBeNull()
  })

  it('opens on the trigger and filters by what follows it', () => {
    const field = setup()
    type(field, 'hi @')
    expect(screen.getAllByRole('option')).toHaveLength(3)
    type(field, 'hi @br')
    expect(screen.getAllByRole('option').map((o) => o.textContent)).toEqual([
      'Bruno Lima'
    ])
    expect(field).toHaveAttribute(
      'aria-controls',
      screen.getByRole('listbox').id
    )
  })

  it('does not open for a trigger in the middle of a word', () => {
    const field = setup()
    type(field, 'mail me@')
    expect(screen.queryByRole('listbox')).toBeNull()
  })

  it('inserts the option with Enter and moves the caret after it', () => {
    const onChange = jest.fn()
    const onSelect = jest.fn()
    const field = setup({ onChange, onSelect }) as HTMLTextAreaElement
    type(field, 'hi @an')
    fireEvent.keyDown(field, { key: 'Enter' })
    expect(field.value).toBe('hi @ana ')
    expect(onChange).toHaveBeenLastCalledWith('hi @ana ')
    expect(onSelect).toHaveBeenCalledWith(options[0])
    expect(field.selectionStart).toBe(8)
    expect(screen.queryByRole('listbox')).toBeNull()
  })

  it('keeps the text after the caret when inserting in the middle', () => {
    const field = setup({ initialValue: 'hi @an, bye' }) as HTMLTextAreaElement
    field.setSelectionRange(6, 6)
    fireEvent.click(field)
    fireEvent.keyDown(field, { key: 'Tab' })
    expect(field.value).toBe('hi @ana , bye')
  })

  it('moves with the arrows, skips a disabled option and wraps', () => {
    const field = setup()
    type(field, '@')
    expect(field).toHaveAttribute(
      'aria-activedescendant',
      screen.getAllByRole('option')[0].id
    )
    fireEvent.keyDown(field, { key: 'ArrowDown' })
    expect(screen.getAllByRole('option')[1]).toHaveAttribute(
      'aria-selected',
      'true'
    )
    fireEvent.keyDown(field, { key: 'ArrowDown' })
    expect(screen.getAllByRole('option')[0]).toHaveAttribute(
      'aria-selected',
      'true'
    )
    fireEvent.keyDown(field, { key: 'ArrowUp' })
    expect(screen.getAllByRole('option')[1]).toHaveAttribute(
      'aria-selected',
      'true'
    )
  })

  it('closes with Escape until the user types again', () => {
    const field = setup()
    type(field, '@a')
    fireEvent.keyDown(field, { key: 'Escape' })
    expect(screen.queryByRole('listbox')).toBeNull()
    type(field, '@an')
    expect(screen.getByRole('listbox')).toBeInTheDocument()
  })

  it('does not insert a disabled option', () => {
    const onChange = jest.fn()
    const field = setup({ onChange })
    type(field, '@die')
    // the only match is disabled, so the list opens but nothing is active
    expect(field).not.toHaveAttribute('aria-activedescendant')
    fireEvent.keyDown(field, { key: 'Enter' })
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it('inserts with a click and keeps the focus in the field', () => {
    const field = setup()
    field.focus()
    type(field, '@br')
    fireEvent.mouseDown(screen.getByRole('option', { name: 'Bruno Lima' }))
    expect((field as HTMLTextAreaElement).value).toBe('@bruno ')
    expect(field).toHaveFocus()
  })

  it('says when nothing matches', () => {
    const field = setup()
    type(field, '@zzz')
    expect(screen.getByText('No results')).toBeInTheDocument()
  })

  it('uses another trigger', () => {
    const field = setup({ trigger: '#' })
    type(field, '@')
    expect(screen.queryByRole('listbox')).toBeNull()
    type(field, '#a')
    expect(screen.getByRole('listbox')).toBeInTheDocument()
  })

  it('follows value when controlled', () => {
    const { rerender } = render(
      <Mention aria-label="Comment" options={options} value="a" />
    )
    rerender(<Mention aria-label="Comment" options={options} value="b" />)
    expect(screen.getByRole('textbox')).toHaveValue('b')
  })
})
