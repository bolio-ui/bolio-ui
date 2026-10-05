import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import axe from 'axe-core'
import { BolioUIProvider, SegmentedControl } from '..'

const setup = (
  props: Partial<React.ComponentProps<typeof SegmentedControl>> = {}
) =>
  render(
    <BolioUIProvider>
      <SegmentedControl aria-label="Period" {...props}>
        <SegmentedControl.Item value="day">Day</SegmentedControl.Item>
        <SegmentedControl.Item value="week">Week</SegmentedControl.Item>
        <SegmentedControl.Item value="month" disabled>
          Month
        </SegmentedControl.Item>
      </SegmentedControl>
    </BolioUIProvider>
  )

describe('<SegmentedControl />', () => {
  it('is a named radiogroup whose options share one name', () => {
    setup()
    const group = screen.getByRole('radiogroup', { name: 'Period' })
    const radios = screen.getAllByRole('radio')
    expect(group).toBeInTheDocument()
    expect(radios).toHaveLength(3)
    expect(new Set(radios.map((r) => r.getAttribute('name'))).size).toBe(1)
  })

  it('starts on initialValue and moves the selection on click', () => {
    const onChange = jest.fn()
    setup({ initialValue: 'day', onChange })
    expect(screen.getByLabelText('Day')).toBeChecked()
    fireEvent.click(screen.getByLabelText('Week'))
    expect(screen.getByLabelText('Week')).toBeChecked()
    expect(screen.getByLabelText('Day')).not.toBeChecked()
    expect(onChange).toHaveBeenCalledWith('week')
  })

  it('follows value when controlled and only reports the change', () => {
    const onChange = jest.fn()
    setup({ value: 'day', onChange })
    fireEvent.click(screen.getByLabelText('Week'))
    expect(onChange).toHaveBeenCalledWith('week')
    expect(screen.getByLabelText('Day')).toBeChecked()
  })

  it('disables one item with its own disabled and disables everything with disabled', () => {
    const { unmount } = setup({ initialValue: 'day' })
    expect(screen.getByLabelText('Month')).toBeDisabled()
    expect(screen.getByLabelText('Week')).toBeEnabled()
    unmount()
    setup({ disabled: true })
    screen.getAllByRole('radio').forEach((r) => expect(r).toBeDisabled())
  })

  it('keeps a consumer style next to the computed one', () => {
    setup({ style: { margin: '7px' } })
    const group = screen.getByRole('radiogroup')
    expect(group.style.margin).toBe('7px')
    expect(group.style.height).not.toBe('')
  })

  it('has no accessibility violations', async () => {
    const { container } = setup({ initialValue: 'day' })
    const results = await axe.run(container, {
      rules: { region: { enabled: false } }
    })
    expect(results.violations).toEqual([])
  })
})
