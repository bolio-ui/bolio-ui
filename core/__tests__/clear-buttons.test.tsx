import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { BolioUIProvider, Input, Select } from '..'

const wrap = (ui: React.ReactElement) =>
  render(<BolioUIProvider>{ui}</BolioUIProvider>)

describe('clear buttons are real buttons', () => {
  it('Input clears its value with a button named Clear', () => {
    const onChange = jest.fn()
    wrap(
      <Input
        clearable
        initialValue="abc"
        aria-label="Name"
        onChange={onChange}
      />
    )
    const button = screen.getByRole('button', { name: 'Clear' })
    expect(button.tagName).toBe('BUTTON')
    expect(button).toHaveAttribute('type', 'button')
    fireEvent.click(button)
    expect(screen.getByLabelText('Name')).toHaveValue('')
    expect(onChange).toHaveBeenCalled()
  })

  it('Select with multiple removes a value with its button', () => {
    const onChange = jest.fn()
    wrap(
      <Select multiple initialValue={['1', '2']} onChange={onChange}>
        <Select.Option value="1">One</Select.Option>
        <Select.Option value="2">Two</Select.Option>
      </Select>
    )
    expect(screen.getAllByRole('button')).toHaveLength(2)
    fireEvent.click(screen.getByRole('button', { name: 'Remove One' }))
    expect(onChange).toHaveBeenCalledWith(['2'])
    expect(screen.getByRole('button', { name: 'Remove Two' })).toBeTruthy()
  })
})
