import React from 'react'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { BolioUIProvider, PhoneInput } from '..'

const draw = (node: React.ReactElement) =>
  render(<BolioUIProvider>{node}</BolioUIProvider>)

const settle = () =>
  act(() => new Promise((resolve) => setTimeout(resolve, 400)))

const number = () => screen.getByLabelText('Phone number') as HTMLInputElement
const type = (text: string) =>
  fireEvent.change(number(), { target: { value: text } })

describe('<PhoneInput />', () => {
  it('writes the number with the calling code of the country', () => {
    const onChange = jest.fn()
    draw(<PhoneInput defaultCountry="BR" onChange={onChange} />)
    type('(11) 99999-9999')
    expect(onChange).toHaveBeenLastCalledWith('+5511999999999')
    expect(number().value).toBe('11999999999')
  })

  it('splits a value into country and number', () => {
    draw(<PhoneInput initialValue="+351912345678" />)
    expect(number().value).toBe('912345678')
    expect(screen.getByText(/Portugal/)).toBeInTheDocument()
  })

  it('reports an empty value when the number is cleared', () => {
    const onChange = jest.fn()
    draw(<PhoneInput initialValue="+5511999999999" onChange={onChange} />)
    type('')
    expect(onChange).toHaveBeenLastCalledWith('')
  })

  it('keeps the number when another country is chosen', async () => {
    const onChange = jest.fn()
    draw(<PhoneInput initialValue="+5511999999999" onChange={onChange} />)
    fireEvent.keyDown(screen.getByRole('combobox', { name: 'Country' }), {
      key: 'ArrowDown'
    })
    await settle()
    fireEvent.click(screen.getByRole('option', { name: /Portugal/ }))
    expect(onChange).toHaveBeenLastCalledWith('+351' + '11999999999')
  })

  it('shows a controlled value and disables both fields', () => {
    draw(<PhoneInput value="+14155550123" disabled />)
    expect(number().value).toBe('4155550123')
    expect(number().disabled).toBe(true)
  })
})
