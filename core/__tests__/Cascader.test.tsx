import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { BolioUIProvider, Cascader } from '..'

const data = [
  {
    value: 'br',
    label: 'Brazil',
    children: [
      {
        value: 'sp',
        label: 'São Paulo',
        children: [{ value: 'campinas', label: 'Campinas' }]
      },
      { value: 'rj', label: 'Rio' }
    ]
  },
  { value: 'pt', label: 'Portugal' },
  { value: 'xx', label: 'Closed', disabled: true }
]

const setup = (props: Partial<React.ComponentProps<typeof Cascader>> = {}) => {
  const onChange = jest.fn()
  render(
    <BolioUIProvider>
      <Cascader
        aria-label="Place"
        data={data}
        placeholder="Pick"
        onChange={onChange}
        {...props}
      />
    </BolioUIProvider>
  )
  return { onChange }
}

const field = () =>
  screen.getByRole('button', { name: /Place|Pick|Brazil|Portugal/ })
const option = (name: string | RegExp) => screen.getByRole('option', { name })

describe('<Cascader />', () => {
  it('opens a column for each level the user goes into', () => {
    setup()
    expect(field()).toHaveTextContent('Pick')
    fireEvent.click(field())
    expect(screen.getAllByRole('listbox')).toHaveLength(1)
    fireEvent.click(option(/Brazil/))
    expect(screen.getAllByRole('listbox')).toHaveLength(2)
    fireEvent.click(option(/São Paulo/))
    expect(screen.getAllByRole('listbox')).toHaveLength(3)
  })

  it('chooses a leaf, reports the path and shows it in the field', () => {
    const { onChange } = setup()
    fireEvent.click(field())
    fireEvent.click(option(/Brazil/))
    fireEvent.click(option('Rio'))
    expect(onChange).toHaveBeenCalledWith(
      ['br', 'rj'],
      [
        expect.objectContaining({ value: 'br' }),
        expect.objectContaining({ value: 'rj' })
      ]
    )
    expect(screen.queryByRole('listbox')).toBeNull()
    expect(field()).toHaveTextContent('Brazil / Rio')
    expect(document.activeElement).toBe(field())
  })

  it('opens on the chosen path and marks it', () => {
    setup({ initialValue: ['br', 'sp', 'campinas'] })
    fireEvent.click(field())
    expect(screen.getAllByRole('listbox')).toHaveLength(3)
    expect(option('Campinas')).toHaveAttribute('aria-selected', 'true')
    expect(document.activeElement).toBe(option('Campinas'))
  })

  it('moves with the arrow keys, skipping disabled options', () => {
    const { onChange } = setup()
    fireEvent.click(field())
    const first = document.activeElement as HTMLElement
    expect(first).toHaveTextContent('Brazil')
    fireEvent.keyDown(first, { key: 'ArrowDown' })
    expect(document.activeElement).toHaveTextContent('Portugal')
    fireEvent.keyDown(document.activeElement as Element, { key: 'ArrowDown' })
    expect(document.activeElement).toHaveTextContent('Portugal')
    fireEvent.keyDown(document.activeElement as Element, { key: 'Enter' })
    expect(onChange).toHaveBeenCalledWith(['pt'], expect.any(Array))
  })

  it('goes into a column with Right and back with Left', () => {
    setup()
    fireEvent.click(field())
    fireEvent.keyDown(document.activeElement as Element, { key: 'ArrowRight' })
    expect(screen.getAllByRole('listbox')).toHaveLength(2)
    expect(document.activeElement).toHaveTextContent('São Paulo')
    fireEvent.keyDown(document.activeElement as Element, { key: 'ArrowLeft' })
    expect(screen.getAllByRole('listbox')).toHaveLength(1)
    expect(document.activeElement).toHaveTextContent('Brazil')
  })

  it('closes with Escape, and does not open when disabled', () => {
    setup()
    fireEvent.click(field())
    fireEvent.keyDown(document.activeElement as Element, { key: 'Escape' })
    expect(screen.queryByRole('listbox')).toBeNull()
    expect(document.activeElement).toBe(field())
  })

  it('stays closed when disabled', () => {
    setup({ disabled: true })
    fireEvent.click(field())
    expect(screen.queryByRole('listbox')).toBeNull()
  })
})
