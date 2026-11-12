import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { BolioUIProvider, WeekPicker } from '..'

const setup = (
  props: Partial<React.ComponentProps<typeof WeekPicker>> = {}
) => {
  const onChange = jest.fn()
  render(
    <BolioUIProvider>
      <WeekPicker
        defaultMonth={new Date(2026, 10, 1)}
        onChange={onChange}
        {...props}
      />
    </BolioUIProvider>
  )
  return { onChange }
}

const day = (label: string) =>
  screen.getByRole('button', { name: new RegExp(label) })

describe('<WeekPicker />', () => {
  it('picks the whole week of the day that is clicked, from Sunday', () => {
    const { onChange } = setup()
    fireEvent.click(day('November 12, 2026'))
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange.mock.calls[0][0]).toEqual([
      new Date(2026, 10, 8),
      new Date(2026, 10, 14)
    ])
  })

  it('starts the week on weekStartsOn', () => {
    const { onChange } = setup({ weekStartsOn: 1 })
    fireEvent.click(day('November 12, 2026'))
    expect(onChange.mock.calls[0][0]).toEqual([
      new Date(2026, 10, 9),
      new Date(2026, 10, 15)
    ])
  })

  it('crosses a month and picks another week on the next click', () => {
    const { onChange } = setup()
    fireEvent.click(day('November 2, 2026'))
    expect(onChange.mock.calls[0][0]).toEqual([
      new Date(2026, 10, 1),
      new Date(2026, 10, 7)
    ])
    fireEvent.click(day('November 18, 2026'))
    expect(onChange.mock.calls[1][0]).toEqual([
      new Date(2026, 10, 15),
      new Date(2026, 10, 21)
    ])
  })

  it('shows a controlled week', () => {
    setup({ value: [new Date(2026, 10, 8), new Date(2026, 10, 14)] })
    const cell = (label: string) => day(label).closest('td')
    expect(cell('November 11, 2026')).toHaveAttribute('aria-selected', 'true')
    expect(cell('November 15, 2026')).toHaveAttribute('aria-selected', 'false')
  })
})
