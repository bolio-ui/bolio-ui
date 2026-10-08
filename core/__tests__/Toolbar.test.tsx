import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Toolbar } from '..'

const setup = (orientation?: 'vertical') =>
  render(
    <Toolbar aria-label="Formatting" orientation={orientation}>
      <button type="button">Bold</button>
      <button type="button" disabled>
        Italic
      </button>
      <Toolbar.Separator />
      <button type="button">Link</button>
    </Toolbar>
  )

describe('<Toolbar />', () => {
  it('is a named toolbar with a separator', () => {
    setup()
    const toolbar = screen.getByRole('toolbar', { name: 'Formatting' })
    expect(toolbar).toHaveAttribute('aria-orientation', 'horizontal')
    expect(screen.getByRole('separator')).toBeInTheDocument()
  })

  it('keeps one enabled item in the Tab order', () => {
    setup()
    expect(screen.getByText('Bold')).toHaveAttribute('tabindex', '0')
    expect(screen.getByText('Link')).toHaveAttribute('tabindex', '-1')
  })

  it('moves the focus with the arrows, skipping a disabled item and wrapping', () => {
    setup()
    const bold = screen.getByText('Bold')
    const link = screen.getByText('Link')
    bold.focus()
    fireEvent.keyDown(bold, { key: 'ArrowRight' })
    expect(link).toHaveFocus()
    // the item with focus is now the one that takes Tab
    expect(link).toHaveAttribute('tabindex', '0')
    expect(bold).toHaveAttribute('tabindex', '-1')
    fireEvent.keyDown(link, { key: 'ArrowRight' })
    expect(bold).toHaveFocus()
    fireEvent.keyDown(bold, { key: 'ArrowLeft' })
    expect(link).toHaveFocus()
  })

  it('goes to the first and the last item with Home and End', () => {
    setup()
    const bold = screen.getByText('Bold')
    const link = screen.getByText('Link')
    bold.focus()
    fireEvent.keyDown(bold, { key: 'End' })
    expect(link).toHaveFocus()
    fireEvent.keyDown(link, { key: 'Home' })
    expect(bold).toHaveFocus()
  })

  it('uses Up and Down when vertical, and ignores Left and Right', () => {
    setup('vertical')
    const bold = screen.getByText('Bold')
    const link = screen.getByText('Link')
    bold.focus()
    fireEvent.keyDown(bold, { key: 'ArrowRight' })
    expect(bold).toHaveFocus()
    fireEvent.keyDown(bold, { key: 'ArrowDown' })
    expect(link).toHaveFocus()
  })
})
