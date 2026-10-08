import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Chip } from '..'

describe('<Chip />', () => {
  it('works alone as a checkbox, with its own state', () => {
    const onChange = jest.fn()
    render(<Chip onChange={onChange}>Free shipping</Chip>)
    const input = screen.getByRole('checkbox', { name: 'Free shipping' })
    expect(input).not.toBeChecked()
    fireEvent.click(input)
    expect(input).toBeChecked()
    expect(onChange).toHaveBeenLastCalledWith(true)
  })

  it('starts checked with initialChecked and follows checked when controlled', () => {
    const { rerender } = render(<Chip initialChecked>A</Chip>)
    expect(screen.getByRole('checkbox')).toBeChecked()
    rerender(<Chip checked={false}>A</Chip>)
    expect(screen.getByRole('checkbox')).not.toBeChecked()
  })

  it('does not change while disabled', () => {
    render(<Chip disabled>A</Chip>)
    expect(screen.getByRole('checkbox')).toBeDisabled()
  })

  describe('Chip.Group', () => {
    it('checks several chips with multiple, in a group', () => {
      const onChange = jest.fn()
      render(
        <Chip.Group multiple onChange={onChange} aria-label="Stack">
          <Chip value="react">React</Chip>
          <Chip value="vue">Vue</Chip>
        </Chip.Group>
      )
      expect(screen.getByRole('group', { name: 'Stack' })).toBeInTheDocument()
      fireEvent.click(screen.getByRole('checkbox', { name: 'React' }))
      fireEvent.click(screen.getByRole('checkbox', { name: 'Vue' }))
      expect(onChange).toHaveBeenLastCalledWith(['react', 'vue'])
      fireEvent.click(screen.getByRole('checkbox', { name: 'React' }))
      expect(onChange).toHaveBeenLastCalledWith(['vue'])
    })

    it('checks one chip at a time without multiple, as radios', () => {
      render(
        <Chip.Group initialValue={['s']} aria-label="Size">
          <Chip value="s">S</Chip>
          <Chip value="m">M</Chip>
        </Chip.Group>
      )
      expect(
        screen.getByRole('radiogroup', { name: 'Size' })
      ).toBeInTheDocument()
      expect(screen.getByRole('radio', { name: 'S' })).toBeChecked()
      fireEvent.click(screen.getByRole('radio', { name: 'M' }))
      expect(screen.getByRole('radio', { name: 'M' })).toBeChecked()
      expect(screen.getByRole('radio', { name: 'S' })).not.toBeChecked()
    })

    it('follows value when controlled', () => {
      const { rerender } = render(
        <Chip.Group multiple value={['a']}>
          <Chip value="a">A</Chip>
          <Chip value="b">B</Chip>
        </Chip.Group>
      )
      fireEvent.click(screen.getByRole('checkbox', { name: 'B' }))
      expect(screen.getByRole('checkbox', { name: 'B' })).not.toBeChecked()
      rerender(
        <Chip.Group multiple value={['a', 'b']}>
          <Chip value="a">A</Chip>
          <Chip value="b">B</Chip>
        </Chip.Group>
      )
      expect(screen.getByRole('checkbox', { name: 'B' })).toBeChecked()
    })

    it('blocks every chip with disabled', () => {
      render(
        <Chip.Group multiple disabled>
          <Chip value="a">A</Chip>
        </Chip.Group>
      )
      expect(screen.getByRole('checkbox')).toBeDisabled()
    })
  })
})
