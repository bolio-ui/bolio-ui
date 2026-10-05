import React from 'react'
import { render, screen, fireEvent, within } from '@testing-library/react'
import axe from 'axe-core'
import { BolioUIProvider, DateRangePicker } from '..'
import { toISO } from '../Calendar/date-utils'

type Props = React.ComponentProps<typeof DateRangePicker>

const setup = (props: Partial<Props> = {}) =>
  render(
    <BolioUIProvider>
      <DateRangePicker aria-label="Stay" {...props} />
    </BolioUIProvider>
  )

const start = () => screen.getByLabelText('Start date')
const end = () => screen.getByLabelText('End date')
const jan = (day: number) => new Date(2026, 0, day)
const iso = (range: unknown) =>
  (range as Array<Date | null>).map((date) => (date ? toISO(date) : null))
const day = (dialog: HTMLElement, date: Date) =>
  dialog.querySelector(`[data-date="${toISO(date)}"]`) as HTMLElement

describe('<DateRangePicker />', () => {
  it('is a named group with two labeled inputs and a calendar button', () => {
    setup({ initialValue: [jan(10), jan(12)] })
    expect(screen.getByRole('group', { name: 'Stay' })).toBeInTheDocument()
    expect(start()).toHaveValue('2026-01-10')
    expect(end()).toHaveValue('2026-01-12')
    expect(
      screen.getByRole('button', { name: 'Choose dates' })
    ).toBeInTheDocument()
  })

  it('commits a typed date and ignores one that breaks the order', () => {
    const onChange = jest.fn()
    setup({ initialValue: [jan(10), jan(12)], onChange })
    fireEvent.change(start(), { target: { value: '2026-01-05' } })
    expect(iso(onChange.mock.lastCall[0])).toEqual(['2026-01-05', '2026-01-12'])
    fireEvent.change(end(), { target: { value: '2026-01-01' } })
    expect(onChange).toHaveBeenCalledTimes(1)
    fireEvent.change(start(), { target: { value: '2026-01-20' } })
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it('clears one edge when its field is emptied, and restores the text on blur', () => {
    const onChange = jest.fn()
    setup({ initialValue: [jan(10), jan(12)], onChange })
    fireEvent.change(end(), { target: { value: '' } })
    expect(iso(onChange.mock.lastCall[0])).toEqual(['2026-01-10', null])
    fireEvent.change(start(), { target: { value: '2026-1' } })
    fireEvent.blur(start())
    expect(start()).toHaveValue('2026-01-10')
  })

  it('ignores typed dates outside min and max', () => {
    const onChange = jest.fn()
    setup({ min: jan(5), max: jan(20), onChange })
    fireEvent.change(start(), { target: { value: '2026-01-02' } })
    fireEvent.change(start(), { target: { value: '2026-01-25' } })
    expect(onChange).not.toHaveBeenCalled()
    fireEvent.change(start(), { target: { value: '2026-01-06' } })
    expect(iso(onChange.mock.lastCall[0])).toEqual(['2026-01-06', null])
  })

  it('picks a range in two clicks and closes on the second', () => {
    const onChange = jest.fn()
    setup({ initialValue: [jan(10), jan(12)], onChange })
    fireEvent.click(screen.getByRole('button', { name: 'Choose dates' }))
    const dialog = screen.getByRole('dialog')

    fireEvent.click(day(dialog, jan(20)))
    expect(iso(onChange.mock.lastCall[0])).toEqual(['2026-01-20', null])
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    fireEvent.click(day(dialog, jan(25)))
    expect(iso(onChange.mock.lastCall[0])).toEqual(['2026-01-20', '2026-01-25'])
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(end()).toHaveFocus()
    expect(start()).toHaveValue('2026-01-20')
    expect(end()).toHaveValue('2026-01-25')
  })

  it('closes on Escape and returns the focus to the button', () => {
    setup({ initialValue: [jan(10), jan(12)] })
    const toggle = screen.getByRole('button', { name: 'Choose dates' })
    fireEvent.click(toggle)
    fireEvent.keyDown(within(screen.getByRole('dialog')).getByRole('grid'), {
      key: 'Escape'
    })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(toggle).toHaveFocus()
  })

  it('follows value when controlled and only reports the change', () => {
    const onChange = jest.fn()
    setup({ value: [jan(10), jan(12)], onChange })
    fireEvent.change(start(), { target: { value: '2026-01-05' } })
    expect(onChange).toHaveBeenCalledTimes(1)
    fireEvent.blur(start())
    expect(start()).toHaveValue('2026-01-10')
  })

  it('locks everything when disabled', () => {
    setup({ disabled: true })
    expect(start()).toBeDisabled()
    expect(end()).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Choose dates' })).toBeDisabled()
  })

  it('has no accessibility violations, closed and open', async () => {
    const { container } = setup({ initialValue: [jan(10), jan(12)] })
    const options = { rules: { region: { enabled: false } } }
    expect((await axe.run(container, options)).violations).toEqual([])
    fireEvent.click(screen.getByRole('button', { name: 'Choose dates' }))
    expect((await axe.run(container, options)).violations).toEqual([])
  })
})
