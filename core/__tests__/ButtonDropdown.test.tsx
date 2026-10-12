import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { BolioUIProvider, ButtonDropdown } from '..'

const wrap = () =>
  render(
    <BolioUIProvider>
      <ButtonDropdown>
        <ButtonDropdown.Item main>Save</ButtonDropdown.Item>
        <ButtonDropdown.Item>Save as</ButtonDropdown.Item>
        <ButtonDropdown.Item disabled>Archive</ButtonDropdown.Item>
        <ButtonDropdown.Item>Delete</ButtonDropdown.Item>
      </ButtonDropdown>
    </BolioUIProvider>
  )

const summary = () => screen.getByLabelText('More options')

describe('<ButtonDropdown /> keyboard', () => {
  it('opens with ArrowDown and lands on the first item', () => {
    const { container } = wrap()
    fireEvent.keyDown(summary(), { key: 'ArrowDown' })
    expect(container.querySelector('details')).toHaveAttribute('open')
    expect(screen.getByText('Save as')).toHaveFocus()
  })

  it('moves between the items with the arrows and skips disabled ones', () => {
    wrap()
    fireEvent.keyDown(summary(), { key: 'ArrowDown' })
    fireEvent.keyDown(screen.getByText('Save as'), { key: 'ArrowDown' })
    expect(screen.getByText('Delete')).toHaveFocus()
    fireEvent.keyDown(screen.getByText('Delete'), { key: 'ArrowDown' })
    expect(screen.getByText('Delete')).toHaveFocus()
    fireEvent.keyDown(screen.getByText('Delete'), { key: 'ArrowUp' })
    expect(screen.getByText('Save as')).toHaveFocus()
    fireEvent.keyDown(screen.getByText('Save as'), { key: 'ArrowUp' })
    expect(summary()).toHaveFocus()
  })

  it('closes with Escape and gives the focus back to the summary', () => {
    const { container } = wrap()
    fireEvent.keyDown(summary(), { key: 'ArrowDown' })
    fireEvent.keyDown(screen.getByText('Save as'), { key: 'Escape' })
    expect(container.querySelector('details')).not.toHaveAttribute('open')
    expect(summary()).toHaveFocus()
  })

  it('still opens with a click', () => {
    const { container } = wrap()
    fireEvent.click(summary())
    expect(container.querySelector('details')).toHaveAttribute('open')
  })
})
