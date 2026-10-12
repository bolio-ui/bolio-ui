import React from 'react'
import { act, fireEvent, render, screen } from '@testing-library/react'
import axe from 'axe-core'
import { BolioUIProvider, Select } from '..'

const wrap = (ui: React.ReactElement) =>
  render(<BolioUIProvider>{ui}</BolioUIProvider>)

const settle = () =>
  act(() => new Promise((resolve) => setTimeout(resolve, 400)))

const field = () => screen.getByRole('combobox')
const press = (key: string) => fireEvent.keyDown(field(), { key })
const active = () => {
  const id = field().getAttribute('aria-activedescendant')
  return id ? document.getElementById(id)?.textContent : null
}

const basic = (props: React.ComponentProps<typeof Select> = {}) => (
  <Select placeholder="Pick" {...props}>
    <Select.Option value="1">One</Select.Option>
    <Select.Option value="2" disabled>
      Two
    </Select.Option>
    <Select.Option value="3">Three</Select.Option>
    <Select.Option value="4">Four</Select.Option>
  </Select>
)

describe('<Select /> keyboard', () => {
  it('opens with the arrows, Enter and Space', async () => {
    for (const key of ['ArrowDown', 'ArrowUp', 'Enter', ' ']) {
      const { unmount } = wrap(basic())
      press(key)
      await settle()
      expect(field()).toHaveAttribute('aria-expanded', 'true')
      unmount()
    }
  })

  it('starts on the first option and moves with the arrows, skipping disabled ones', async () => {
    wrap(basic())
    press('ArrowDown')
    await settle()
    expect(active()).toBe('One')
    press('ArrowDown')
    expect(active()).toBe('Three')
    press('ArrowDown')
    press('ArrowDown')
    expect(active()).toBe('Four')
    press('ArrowUp')
    expect(active()).toBe('Three')
  })

  it('starts on the chosen option', async () => {
    wrap(basic({ initialValue: '3' }))
    press('ArrowDown')
    await settle()
    expect(active()).toBe('Three')
  })

  it('goes to the first and last option with Home and End', async () => {
    wrap(basic())
    press('ArrowDown')
    await settle()
    press('End')
    expect(active()).toBe('Four')
    press('Home')
    expect(active()).toBe('One')
  })

  it('picks the active option with Enter and closes', async () => {
    const onChange = jest.fn()
    wrap(basic({ onChange }))
    press('ArrowDown')
    await settle()
    press('ArrowDown')
    press('Enter')
    expect(onChange).toHaveBeenCalledWith('3')
    await settle()
    expect(field()).toHaveAttribute('aria-expanded', 'false')
    expect(screen.getAllByText('Three').length).toBeGreaterThan(0)
  })

  it('closes with Escape without changing the value', async () => {
    const onChange = jest.fn()
    wrap(basic({ onChange }))
    press('Enter')
    await settle()
    press('Escape')
    await settle()
    expect(field()).toHaveAttribute('aria-expanded', 'false')
    expect(onChange).not.toHaveBeenCalled()
  })

  it('keeps the list open and toggles options when multiple', async () => {
    const onChange = jest.fn()
    wrap(basic({ multiple: true, onChange }))
    press('Enter')
    await settle()
    press('Enter')
    expect(onChange).toHaveBeenLastCalledWith(['1'])
    press('ArrowDown')
    press('Enter')
    expect(onChange).toHaveBeenLastCalledWith(['1', '3'])
    expect(field()).toHaveAttribute('aria-expanded', 'true')
  })

  it('ignores the keys when disabled', async () => {
    wrap(basic({ disabled: true }))
    press('ArrowDown')
    await settle()
    expect(field()).toHaveAttribute('aria-expanded', 'false')
  })

  it('exposes a named listbox of options and ties the field to the active one', async () => {
    wrap(basic({ initialValue: '1' }))
    press('Enter')
    await settle()
    const listbox = screen.getByRole('listbox', { name: 'Pick' })
    expect(field()).toHaveAttribute('aria-controls', listbox.id)
    const options = screen.getAllByRole('option')
    expect(options).toHaveLength(4)
    expect(options[0]).toHaveAttribute('aria-selected', 'true')
    expect(options[1]).toHaveAttribute('aria-disabled', 'true')
    expect(field().getAttribute('aria-activedescendant')).toBe(options[0].id)
  })

  it('has no axe violations with the list open', async () => {
    const { container } = wrap(basic({ initialValue: '1' }))
    press('Enter')
    await settle()
    const result = await axe.run(document.body, {
      rules: { region: { enabled: false } }
    })
    expect(result.violations.map((v) => v.id)).toEqual([])
    expect(container).toBeTruthy()
  })
})
