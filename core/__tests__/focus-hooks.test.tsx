import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { useFocusTrap, useRovingIndex } from 'core'

const Trap = ({ active = true }: { active?: boolean }) => {
  const ref = useFocusTrap<HTMLDivElement>(active)
  return (
    <div>
      <button>outside</button>
      <div ref={ref} data-testid="trap">
        <button>first</button>
        <button disabled>disabled</button>
        <a href="#x">link</a>
        <button>last</button>
      </div>
    </div>
  )
}

describe('useFocusTrap', () => {
  it('moves the focus to the first focusable element', () => {
    render(<Trap />)
    expect(screen.getByText('first')).toHaveFocus()
  })

  it('does nothing while inactive', () => {
    render(<Trap active={false} />)
    expect(screen.getByText('first')).not.toHaveFocus()
  })

  it('wraps Tab from the last element to the first', () => {
    render(<Trap />)
    screen.getByText('last').focus()
    const prevented = !fireEvent.keyDown(screen.getByTestId('trap'), {
      key: 'Tab'
    })
    expect(prevented).toBe(true)
    expect(screen.getByText('first')).toHaveFocus()
  })

  it('wraps Shift+Tab from the first element to the last', () => {
    render(<Trap />)
    const prevented = !fireEvent.keyDown(screen.getByTestId('trap'), {
      key: 'Tab',
      shiftKey: true
    })
    expect(prevented).toBe(true)
    expect(screen.getByText('last')).toHaveFocus()
  })

  it('leaves Tab alone in the middle and ignores other keys', () => {
    render(<Trap />)
    const trap = screen.getByTestId('trap')
    expect(fireEvent.keyDown(trap, { key: 'Tab' })).toBe(true)
    screen.getByText('last').focus()
    expect(fireEvent.keyDown(trap, { key: 'Enter' })).toBe(true)
    expect(screen.getByText('last')).toHaveFocus()
  })

  it('stops trapping when it becomes inactive', () => {
    const { rerender } = render(<Trap />)
    rerender(<Trap active={false} />)
    screen.getByText('last').focus()
    expect(fireEvent.keyDown(screen.getByTestId('trap'), { key: 'Tab' })).toBe(
      true
    )
    expect(screen.getByText('last')).toHaveFocus()
  })
})

const Roving = ({
  orientation,
  loop,
  onChange
}: {
  orientation?: 'horizontal' | 'vertical'
  loop?: boolean
  onChange?: (index: number) => void
}) => {
  const { selected, getItemProps } = useRovingIndex({
    total: 3,
    orientation,
    loop,
    onChange
  })
  return (
    <div>
      {['a', 'b', 'c'].map((name, index) => (
        <button key={name} {...getItemProps(index)}>
          {name}
        </button>
      ))}
      <output>{selected}</output>
    </div>
  )
}

describe('useRovingIndex', () => {
  it('lets only the selected item be reached with Tab', () => {
    render(<Roving />)
    expect(screen.getByText('a')).toHaveAttribute('tabindex', '0')
    expect(screen.getByText('b')).toHaveAttribute('tabindex', '-1')
  })

  it('moves with the arrows of its orientation', () => {
    const onChange = jest.fn()
    render(<Roving onChange={onChange} />)
    fireEvent.keyDown(screen.getByText('a'), { key: 'ArrowRight' })
    expect(screen.getByText('b')).toHaveFocus()
    expect(onChange).toHaveBeenLastCalledWith(1)
    fireEvent.keyDown(screen.getByText('b'), { key: 'ArrowLeft' })
    expect(screen.getByText('a')).toHaveFocus()
    // the other axis does nothing
    expect(fireEvent.keyDown(screen.getByText('a'), { key: 'ArrowDown' })).toBe(
      true
    )
    expect(screen.getByText('a')).toHaveFocus()
  })

  it('uses the vertical arrows when vertical', () => {
    render(<Roving orientation="vertical" />)
    fireEvent.keyDown(screen.getByText('a'), { key: 'ArrowDown' })
    expect(screen.getByText('b')).toHaveFocus()
    fireEvent.keyDown(screen.getByText('b'), { key: 'ArrowUp' })
    expect(screen.getByText('a')).toHaveFocus()
  })

  it('jumps with Home and End', () => {
    render(<Roving />)
    fireEvent.keyDown(screen.getByText('a'), { key: 'End' })
    expect(screen.getByText('c')).toHaveFocus()
    fireEvent.keyDown(screen.getByText('c'), { key: 'Home' })
    expect(screen.getByText('a')).toHaveFocus()
  })

  it('loops at the ends, or stops there without loop', () => {
    const { unmount } = render(<Roving />)
    fireEvent.keyDown(screen.getByText('a'), { key: 'ArrowLeft' })
    expect(screen.getByText('c')).toHaveFocus()
    fireEvent.keyDown(screen.getByText('c'), { key: 'ArrowRight' })
    expect(screen.getByText('a')).toHaveFocus()
    unmount()

    render(<Roving loop={false} />)
    fireEvent.keyDown(screen.getByText('a'), { key: 'ArrowLeft' })
    expect(screen.getByText('a')).toHaveFocus()
    fireEvent.keyDown(screen.getByText('a'), { key: 'End' })
    fireEvent.keyDown(screen.getByText('c'), { key: 'ArrowRight' })
    expect(screen.getByText('c')).toHaveFocus()
  })

  it('follows the focus, and ignores other keys', () => {
    render(<Roving />)
    fireEvent.focus(screen.getByText('c'))
    expect(screen.getByRole('status')).toHaveTextContent('2')
    expect(screen.getByText('c')).toHaveAttribute('tabindex', '0')
    expect(fireEvent.keyDown(screen.getByText('c'), { key: 'x' })).toBe(true)
  })
})
