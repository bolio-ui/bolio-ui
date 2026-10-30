import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { BolioUIProvider, Breadcrumbs, Card, Popover, Snippet, Table } from '..'

const wrap = (ui: React.ReactElement) =>
  render(<BolioUIProvider>{ui}</BolioUIProvider>)

// jsdom does not turn Enter or Space into a click, so the keys are fired
// and the click they cause is what the handler sees
const press = (element: HTMLElement, key: string) =>
  fireEvent.keyDown(element, { key })

describe('clickable elements work with the keyboard', () => {
  it('Snippet copies with a button named Copy', () => {
    wrap(<Snippet text="yarn add @bolio-ui/core" copy="silent" />)
    const button = screen.getByRole('button', { name: 'Copy' })
    expect(button.tagName).toBe('BUTTON')
  })

  it('Popover.Item with onClick is a focusable button that Enter and Space press', () => {
    const onClick = jest.fn()
    wrap(
      <>
        <Popover.Item onClick={onClick}>Edit</Popover.Item>
        <Popover.Item>Only text</Popover.Item>
      </>
    )
    const item = screen.getByRole('button', { name: 'Edit' })
    expect(item).toHaveAttribute('tabindex', '0')
    press(item, 'Enter')
    press(item, ' ')
    expect(onClick).toHaveBeenCalledTimes(2)
    press(item, 'a')
    expect(onClick).toHaveBeenCalledTimes(2)
    expect(screen.queryByRole('button', { name: 'Only text' })).toBeNull()
  })

  it('Table rows with onRow are focusable and Enter picks the row', () => {
    const onRow = jest.fn()
    const data = [{ id: 'one' }, { id: 'two' }]
    wrap(
      <Table data={data} onRow={onRow}>
        <Table.Column prop="id" label="id" />
      </Table>
    )
    const row = screen.getByText('two').closest('tr') as HTMLElement
    expect(row).toHaveAttribute('tabindex', '0')
    press(row, 'Enter')
    expect(onRow).toHaveBeenCalledWith({ id: 'two' }, 1)
  })

  it('Table cells with onCell are focusable and Space picks the cell', () => {
    const onCell = jest.fn()
    wrap(
      <Table data={[{ id: 'one' }]} onCell={onCell}>
        <Table.Column prop="id" label="id" />
      </Table>
    )
    const cell = screen.getByText('one').closest('td') as HTMLElement
    expect(cell).toHaveAttribute('tabindex', '0')
    press(cell, ' ')
    expect(onCell).toHaveBeenCalledWith('one', 0, 0)
  })

  it('a Table without handlers adds no tab stops', () => {
    wrap(
      <Table data={[{ id: 'one' }]}>
        <Table.Column prop="id" label="id" />
      </Table>
    )
    expect(
      screen.getByText('one').closest('tr')?.hasAttribute('tabindex')
    ).toBe(false)
  })

  it('an interactive Card is pressed with Enter, but keys from inside it are not', () => {
    const onClick = jest.fn()
    const { container } = wrap(
      <Card interactive onClick={onClick}>
        <input aria-label="inside" />
        Open
      </Card>
    )
    const card = container.querySelector('.card') as HTMLElement
    press(card, 'Enter')
    expect(onClick).toHaveBeenCalledTimes(1)
    press(screen.getByLabelText('inside'), 'Enter')
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('a Breadcrumbs item with onClick and no href is a button', () => {
    const onClick = jest.fn()
    wrap(
      <Breadcrumbs>
        <Breadcrumbs.Item onClick={onClick}>Home</Breadcrumbs.Item>
        <Breadcrumbs.Item>Plain</Breadcrumbs.Item>
      </Breadcrumbs>
    )
    const item = screen.getByRole('button', { name: 'Home' })
    press(item, 'Enter')
    expect(onClick).toHaveBeenCalledTimes(1)
    expect(screen.queryByRole('button', { name: 'Plain' })).toBeNull()
  })
})
