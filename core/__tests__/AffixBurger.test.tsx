import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { Affix, BolioUIProvider, Burger } from '..'

const draw = (node: React.ReactElement) =>
  render(<BolioUIProvider>{node}</BolioUIProvider>)

describe('<Affix />', () => {
  it('pins its children to the window, outside the page tree', () => {
    const { container } = draw(
      <Affix bottom={20} right="2em" zIndex={5}>
        Pinned
      </Affix>
    )
    const pinned = screen.getByText('Pinned')
    expect(container.contains(pinned)).toBe(false)
    expect(pinned.parentElement).toBe(document.body)
    expect(pinned.style.position).toBe('fixed')
    expect(pinned.style.bottom).toBe('20px')
    expect(pinned.style.right).toBe('2em')
    expect(pinned.style.zIndex).toBe('5')
  })
})

describe('<Burger />', () => {
  it('is a named button that reports whether it is open', () => {
    const onClick = jest.fn()
    const { rerender } = draw(<Burger label="Open menu" onClick={onClick} />)
    const button = screen.getByRole('button', { name: 'Open menu' })
    expect(button).toHaveAttribute('aria-expanded', 'false')
    fireEvent.click(button)
    expect(onClick).toHaveBeenCalledTimes(1)
    rerender(
      <BolioUIProvider>
        <Burger label="Open menu" opened />
      </BolioUIProvider>
    )
    expect(button).toHaveAttribute('aria-expanded', 'true')
  })
})
