import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { BolioUIProvider, Checkbox, Radio } from '..'

const wrap = (ui: React.ReactElement) =>
  render(<BolioUIProvider>{ui}</BolioUIProvider>)

describe('Radio.Card', () => {
  it('selects the option inside a group', () => {
    const onChange = jest.fn()
    wrap(
      <Radio.Group onChange={onChange}>
        <Radio.Card value="free">Free</Radio.Card>
        <Radio.Card value="pro">
          Pro
          <Radio.Description>US$ 12</Radio.Description>
        </Radio.Card>
      </Radio.Group>
    )
    fireEvent.click(screen.getByRole('radio', { name: /Pro/ }))
    expect(onChange).toHaveBeenCalledWith('pro')
    expect(screen.getByRole('radio', { name: /Pro/ })).toBeChecked()
  })

  it('forwards the ref to the input', () => {
    const ref = React.createRef<HTMLInputElement>()
    wrap(
      <Radio.Card ref={ref} value="a">
        A
      </Radio.Card>
    )
    expect(ref.current?.type).toBe('radio')
  })
})

describe('Checkbox.Card', () => {
  it('toggles the box', () => {
    const onChange = jest.fn()
    wrap(<Checkbox.Card onChange={onChange}>Weekly summary</Checkbox.Card>)
    fireEvent.click(screen.getByRole('checkbox', { name: 'Weekly summary' }))
    expect(onChange).toHaveBeenCalled()
    expect(screen.getByRole('checkbox')).toBeChecked()
  })
})
