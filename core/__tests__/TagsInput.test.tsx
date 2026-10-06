import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import axe from 'axe-core'
import { BolioUIProvider, TagsInput } from '..'

const setup = (props: Partial<React.ComponentProps<typeof TagsInput>> = {}) =>
  render(
    <BolioUIProvider>
      <TagsInput aria-label="Skills" {...props} />
    </BolioUIProvider>
  )

const type = (text: string) =>
  fireEvent.change(screen.getByRole('textbox'), { target: { value: text } })
const press = (key: string) =>
  fireEvent.keyDown(screen.getByRole('textbox'), { key })

describe('<TagsInput />', () => {
  it('shows the initial tags, each with a named remove button', () => {
    setup({ initialValue: ['React', 'Vue'] })
    expect(screen.getByText('React')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Remove Vue' })
    ).toBeInTheDocument()
  })

  it('adds the typed text with Enter and clears the field', () => {
    const onChange = jest.fn()
    setup({ onChange })
    type('  svelte ')
    press('Enter')
    expect(onChange).toHaveBeenCalledWith(['svelte'])
    expect(screen.getByRole('textbox')).toHaveValue('')
    expect(screen.getByText('svelte')).toBeInTheDocument()
  })

  it('lets Enter through when the field is empty', () => {
    setup()
    const notPrevented = fireEvent.keyDown(screen.getByRole('textbox'), {
      key: 'Enter'
    })
    expect(notPrevented).toBe(true)
  })

  it('ends a tag with a comma, also when pasted', () => {
    const onChange = jest.fn()
    setup({ onChange })
    type('a, b ,c')
    expect(onChange).toHaveBeenLastCalledWith(['a', 'b'])
    expect(screen.getByRole('textbox')).toHaveValue('c')
  })

  it('adds the pending text on blur', () => {
    const onChange = jest.fn()
    setup({ onChange })
    type('late')
    fireEvent.blur(screen.getByRole('textbox'))
    expect(onChange).toHaveBeenCalledWith(['late'])
  })

  it('removes with the button and with Backspace on an empty field', () => {
    const onChange = jest.fn()
    setup({ initialValue: ['a', 'b', 'c'], onChange })
    fireEvent.click(screen.getByRole('button', { name: 'Remove b' }))
    expect(onChange).toHaveBeenLastCalledWith(['a', 'c'])
    press('Backspace')
    expect(onChange).toHaveBeenLastCalledWith(['a'])
  })

  it('keeps Backspace for the text while there is some', () => {
    const onChange = jest.fn()
    setup({ initialValue: ['a'], onChange })
    type('x')
    press('Backspace')
    expect(onChange).not.toHaveBeenCalled()
  })

  it('skips duplicates unless allowDuplicates, and stops at max', () => {
    const onChange = jest.fn()
    const { unmount } = setup({ initialValue: ['a'], onChange, max: 2 })
    type('a,b,c,')
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith(['a', 'b'])
    unmount()
    setup({ initialValue: ['a'], allowDuplicates: true })
    type('a,')
    expect(screen.getAllByText('a')).toHaveLength(2)
  })

  it('follows value when controlled and only reports the change', () => {
    const onChange = jest.fn()
    setup({ value: ['a'], onChange })
    type('b')
    press('Enter')
    expect(onChange).toHaveBeenCalledWith(['a', 'b'])
    expect(screen.queryByText('b')).not.toBeInTheDocument()
  })

  it('locks tags and field when disabled or read only', () => {
    const { unmount } = setup({ initialValue: ['a'], disabled: true })
    expect(screen.getByRole('textbox')).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Remove a' })).toBeDisabled()
    unmount()
    const onChange = jest.fn()
    setup({ initialValue: ['a'], readOnly: true, onChange })
    expect(screen.getByRole('button', { name: 'Remove a' })).toBeDisabled()
    type('b')
    press('Enter')
    expect(onChange).not.toHaveBeenCalled()
  })

  it('links the error message and marks the input invalid', () => {
    setup({ error: true, errorMessage: 'Add a tag.' })
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveAccessibleDescription('Add a tag.')
  })

  it('has no accessibility violations', async () => {
    const { container } = setup({ initialValue: ['a'] })
    const results = await axe.run(container, {
      rules: { region: { enabled: false } }
    })
    expect(results.violations).toEqual([])
  })
})
