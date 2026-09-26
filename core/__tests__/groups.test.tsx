import React, { useState } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { BolioUIProvider, Checkbox, Fieldset, Radio } from '..'

const wrap = (ui: React.ReactElement) =>
  render(<BolioUIProvider>{ui}</BolioUIProvider>)

// Their effects only run inside a group, and they used to be declared in a
// condition. They are unconditional now and check `inGroup` themselves.
describe('grouped components follow their group', () => {
  it('Checkbox.Group checks the boxes whose value is selected', () => {
    const Example = () => {
      const [value, setValue] = useState(['a'])
      return (
        <Checkbox.Group value={value} onChange={setValue}>
          <Checkbox value="a">A</Checkbox>
          <Checkbox value="b">B</Checkbox>
        </Checkbox.Group>
      )
    }
    wrap(<Example />)
    const [a, b] = screen.getAllByRole('checkbox') as HTMLInputElement[]
    expect(a.checked).toBe(true)
    expect(b.checked).toBe(false)

    fireEvent.click(b)
    expect(b.checked).toBe(true)
    fireEvent.click(a)
    expect(a.checked).toBe(false)
  })

  it('a Checkbox outside a group keeps its own state', () => {
    wrap(<Checkbox>Alone</Checkbox>)
    const box = screen.getByRole('checkbox') as HTMLInputElement
    expect(box.checked).toBe(false)
    fireEvent.click(box)
    expect(box.checked).toBe(true)
  })

  it('Radio.Group checks the radio whose value is selected', () => {
    wrap(
      <Radio.Group value="b">
        <Radio value="a">A</Radio>
        <Radio value="b">B</Radio>
      </Radio.Group>
    )
    const [a, b] = screen.getAllByRole('radio') as HTMLInputElement[]
    expect(a.checked).toBe(false)
    expect(b.checked).toBe(true)
    fireEvent.click(a)
    expect(a.checked).toBe(true)
    expect(b.checked).toBe(false)
  })

  it('Fieldset.Group shows only the selected fieldset', () => {
    wrap(
      <Fieldset.Group value="two">
        <Fieldset label="one">
          <Fieldset.Title>First</Fieldset.Title>
        </Fieldset>
        <Fieldset label="two">
          <Fieldset.Title>Second</Fieldset.Title>
        </Fieldset>
      </Fieldset.Group>
    )
    expect(screen.getByText('First')).not.toBeVisible()
    expect(screen.getByText('Second')).toBeVisible()
  })

  it('a Fieldset outside a group is shown', () => {
    wrap(
      <Fieldset>
        <Fieldset.Title>Alone</Fieldset.Title>
      </Fieldset>
    )
    expect(screen.getByText('Alone')).toBeVisible()
  })
})
