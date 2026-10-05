import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import axe from 'axe-core'
import { BolioUIProvider, Collapse } from '..'

const wrap = (ui: React.ReactElement) =>
  render(<BolioUIProvider>{ui}</BolioUIProvider>)

describe('<Collapse />', () => {
  it('names the panel it controls', () => {
    wrap(<Collapse title="Title">Body</Collapse>)
    const header = screen.getByRole('button', { name: 'Title' })
    const panel = document.getElementById(
      header.getAttribute('aria-controls') as string
    )
    expect(panel).toHaveTextContent('Body')
  })

  it('still toggles from a click on the subtitle area', () => {
    wrap(
      <Collapse title="Title" subtitle="Sub">
        Body
      </Collapse>
    )
    fireEvent.click(screen.getByText('Sub'))
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true')
  })

  it('follows visible when controlled and only reports the change', () => {
    const onVisibleChange = jest.fn()
    const { rerender } = wrap(
      <Collapse title="Title" visible={false} onVisibleChange={onVisibleChange}>
        Body
      </Collapse>
    )
    const header = screen.getByRole('button')
    fireEvent.click(header)
    expect(onVisibleChange).toHaveBeenCalledWith(true)
    expect(header).toHaveAttribute('aria-expanded', 'false')

    rerender(
      <BolioUIProvider>
        <Collapse title="Title" visible onVisibleChange={onVisibleChange}>
          Body
        </Collapse>
      </BolioUIProvider>
    )
    expect(header).toHaveAttribute('aria-expanded', 'true')
    fireEvent.click(header)
    expect(onVisibleChange).toHaveBeenLastCalledWith(false)
  })

  it('does not toggle when disabled', () => {
    const onVisibleChange = jest.fn()
    wrap(
      <Collapse
        title="Title"
        subtitle="Sub"
        disabled
        onVisibleChange={onVisibleChange}
      >
        Body
      </Collapse>
    )
    expect(screen.getByRole('button')).toBeDisabled()
    fireEvent.click(screen.getByText('Sub'))
    expect(onVisibleChange).not.toHaveBeenCalled()
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false')
  })

  it('has no accessibility violations', async () => {
    const { container } = wrap(
      <Collapse.Group>
        <Collapse title="One">A</Collapse>
        <Collapse title="Two" disabled>
          B
        </Collapse>
      </Collapse.Group>
    )
    const results = await axe.run(container, {
      rules: { region: { enabled: false } }
    })
    expect(results.violations).toEqual([])
  })
})

describe('<Collapse.Group /> keyboard', () => {
  const setup = (onKeyDown?: () => void) => {
    wrap(
      <Collapse.Group onKeyDown={onKeyDown}>
        <Collapse title="One">A</Collapse>
        <Collapse title="Two" disabled>
          B
        </Collapse>
        <Collapse title="Three">C</Collapse>
        <Collapse title="Four">D</Collapse>
      </Collapse.Group>
    )
    const [one, , three, four] = screen.getAllByRole('button')
    return { one, three, four }
  }

  it('moves focus with the arrows, wrapping and skipping disabled ones', () => {
    const { one, three, four } = setup()
    one.focus()
    fireEvent.keyDown(one, { key: 'ArrowDown' })
    expect(three).toHaveFocus()
    fireEvent.keyDown(three, { key: 'ArrowDown' })
    expect(four).toHaveFocus()
    fireEvent.keyDown(four, { key: 'ArrowDown' })
    expect(one).toHaveFocus()
    fireEvent.keyDown(one, { key: 'ArrowUp' })
    expect(four).toHaveFocus()
  })

  it('jumps to the first and last with Home and End', () => {
    const { one, three, four } = setup()
    three.focus()
    fireEvent.keyDown(three, { key: 'End' })
    expect(four).toHaveFocus()
    fireEvent.keyDown(four, { key: 'Home' })
    expect(one).toHaveFocus()
  })

  it('keeps calling the onKeyDown of the consumer', () => {
    const onKeyDown = jest.fn()
    const { one } = setup(onKeyDown)
    fireEvent.keyDown(one, { key: 'ArrowDown' })
    expect(onKeyDown).toHaveBeenCalledTimes(1)
  })
})
