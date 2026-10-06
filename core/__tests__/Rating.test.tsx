import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { BolioUIProvider, Rating } from '..'

const wrap = (ui: React.ReactElement) =>
  render(<BolioUIProvider>{ui}</BolioUIProvider>)

describe('<Rating />', () => {
  it('starts empty and does not change on hover alone', () => {
    const onChange = jest.fn()
    const onHoverChange = jest.fn()
    wrap(<Rating onChange={onChange} onHoverChange={onHoverChange} />)
    expect(screen.getByRole('radio', { name: '0 of 5' })).toBeChecked()
    fireEvent.mouseEnter(
      screen.getByRole('radio', { name: '3 of 5' }).parentElement as Element
    )
    expect(onHoverChange).toHaveBeenLastCalledWith(3)
    expect(onChange).not.toHaveBeenCalled()
    fireEvent.mouseLeave(screen.getByRole('radiogroup'))
    expect(onHoverChange).toHaveBeenLastCalledWith(null)
  })

  it('follows the value when it is controlled', () => {
    const { rerender } = wrap(<Rating value={2} />)
    expect(screen.getByRole('radio', { name: '2 of 5' })).toBeChecked()
    rerender(
      <BolioUIProvider>
        <Rating value={4} />
      </BolioUIProvider>
    )
    expect(screen.getByRole('radio', { name: '4 of 5' })).toBeChecked()
  })

  it('picks half values with precision 0.5', () => {
    const onChange = jest.fn()
    wrap(<Rating precision={0.5} count={3} onChange={onChange} />)
    // 0 and 6 steps
    expect(screen.getAllByRole('radio')).toHaveLength(7)
    fireEvent.click(screen.getByRole('radio', { name: '2.5 of 3' }))
    expect(onChange).toHaveBeenLastCalledWith(2.5)
  })

  it('clears the value on the same click when clearable', () => {
    const onChange = jest.fn()
    wrap(<Rating clearable value={3} onChange={onChange} />)
    fireEvent.click(screen.getByRole('radio', { name: '3 of 5' }))
    expect(onChange).toHaveBeenLastCalledWith(0)
  })

  it('is an image with no inputs when read only', () => {
    wrap(<Rating readOnly value={3.5} precision={0.5} />)
    expect(screen.getByRole('img', { name: '3.5 of 5' })).toBeInTheDocument()
    expect(screen.queryByRole('radio')).toBeNull()
  })

  it('disables every radio', () => {
    wrap(<Rating disabled value={2} />)
    expect(screen.getByRole('img')).toHaveAttribute('aria-disabled', 'true')
  })
})
