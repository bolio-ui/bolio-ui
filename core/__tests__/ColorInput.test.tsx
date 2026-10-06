import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import axe from 'axe-core'
import { BolioUIProvider, ColorInput } from '..'

type Props = Partial<React.ComponentProps<typeof ColorInput>>
const setup = (props: Props = {}) =>
  render(
    <BolioUIProvider>
      <ColorInput aria-label="Brand color" {...props} />
    </BolioUIProvider>
  )

const field = () => screen.getByRole('textbox', { name: 'Brand color' })
const button = () => screen.getByRole('button', { name: 'Choose color' })

describe('<ColorInput />', () => {
  it('is a text field with the code and a button that opens a dialog', () => {
    setup({ initialValue: '#2563eb' })
    expect(field()).toHaveValue('#2563eb')
    expect(button()).toHaveAttribute('aria-haspopup', 'dialog')
    expect(button()).toHaveAttribute('aria-expanded', 'false')
    expect(button().style.backgroundColor).toBe('rgb(37, 99, 235)')
  })

  it('commits a typed 6 digit code, and a short one on blur', () => {
    const onChange = jest.fn()
    setup({ initialValue: '#ff0000', onChange })
    fireEvent.change(field(), { target: { value: 'AA00FF' } })
    expect(onChange).toHaveBeenLastCalledWith('#aa00ff')
    fireEvent.change(field(), { target: { value: '#0f0' } })
    expect(onChange).toHaveBeenCalledTimes(1)
    fireEvent.blur(field())
    expect(onChange).toHaveBeenLastCalledWith('#00ff00')
    expect(field()).toHaveValue('#00ff00')
  })

  it('restores the last color when the text is not one', () => {
    const onChange = jest.fn()
    setup({ initialValue: '#ff0000', onChange })
    fireEvent.change(field(), { target: { value: 'red' } })
    fireEvent.blur(field())
    expect(onChange).not.toHaveBeenCalled()
    expect(field()).toHaveValue('#ff0000')
  })

  it('opens the picker with the focus on its panel, and Escape closes it', () => {
    setup({ initialValue: '#ff0000' })
    fireEvent.click(button())
    expect(button()).toHaveAttribute('aria-expanded', 'true')
    const dialog = screen.getByRole('dialog', { name: 'Choose color' })
    const panel = screen.getByRole('slider', {
      name: 'Saturation and brightness'
    })
    expect(dialog).toContainElement(panel)
    expect(panel).toHaveFocus()
    fireEvent.keyDown(panel, { key: 'Escape' })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(button()).toHaveFocus()
  })

  it('has one field for the code, not two', () => {
    setup()
    fireEvent.click(button())
    expect(screen.getAllByRole('textbox')).toHaveLength(1)
  })

  it('updates the field from the picker, and the picker from the field', () => {
    const onChange = jest.fn()
    setup({ initialValue: '#ff0000', swatches: ['#0000ff'], onChange })
    fireEvent.click(button())
    fireEvent.click(screen.getByRole('button', { name: '#0000ff' }))
    expect(onChange).toHaveBeenLastCalledWith('#0000ff')
    expect(field()).toHaveValue('#0000ff')
    fireEvent.change(field(), { target: { value: '#00ff00' } })
    expect(screen.getByRole('slider', { name: 'Hue' })).toHaveValue('120')
  })

  it('follows value when controlled and only reports the change', () => {
    const onChange = jest.fn()
    setup({ value: '#ff0000', onChange })
    fireEvent.change(field(), { target: { value: '#00ff00' } })
    expect(onChange).toHaveBeenCalledWith('#00ff00')
    fireEvent.blur(field())
    expect(field()).toHaveValue('#ff0000')
  })

  it('is named by a label passed as children', () => {
    render(
      <BolioUIProvider>
        <ColorInput initialValue="#2563eb">Primary</ColorInput>
      </BolioUIProvider>
    )
    expect(screen.getByRole('textbox', { name: 'Primary' })).toHaveValue(
      '#2563eb'
    )
  })

  it('uses the label it is given', () => {
    setup({ pickerLabel: 'Escolher cor' })
    expect(
      screen.getByRole('button', { name: 'Escolher cor' })
    ).toBeInTheDocument()
  })

  it('locks the field and the button when disabled', () => {
    setup({ disabled: true })
    expect(field()).toBeDisabled()
    expect(button()).toBeDisabled()
  })

  it('has no accessibility violations, closed and open', async () => {
    const { container } = setup({
      initialValue: '#2563eb',
      swatches: ['#dc2626']
    })
    const options = { rules: { region: { enabled: false } } }
    expect((await axe.run(container, options)).violations).toEqual([])
    fireEvent.click(button())
    expect((await axe.run(container, options)).violations).toEqual([])
  })
})
