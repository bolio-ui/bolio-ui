import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { BolioUIProvider, Table } from '..'

const data = Array.from({ length: 12 }, (_, index) => ({
  id: String(index + 1)
}))

const wrap = (ui: React.ReactElement) =>
  render(<BolioUIProvider>{ui}</BolioUIProvider>)

const rows = () => screen.getAllByRole('row').length - 1

describe('<Table /> pagination', () => {
  it('slices the data and changes the page', () => {
    const onPageChange = jest.fn()
    wrap(
      <Table data={data} pagination={{ pageSize: 5, onPageChange }}>
        <Table.Column prop="id" label="id" />
      </Table>
    )
    expect(rows()).toBe(5)
    const cells = () => screen.getAllByRole('cell').map((c) => c.textContent)
    expect(cells()).toEqual(['1', '2', '3', '4', '5'])
    fireEvent.click(screen.getByRole('button', { name: /next/i }))
    expect(onPageChange).toHaveBeenCalledWith(2)
    expect(cells()).toEqual(['6', '7', '8', '9', '10'])
  })

  it('does not slice when total is set', () => {
    wrap(
      <Table data={data.slice(0, 4)} pagination={{ pageSize: 4, total: 12 }}>
        <Table.Column prop="id" label="id" />
      </Table>
    )
    expect(rows()).toBe(4)
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  it('hides the footer with a single page', () => {
    wrap(
      <Table data={data} pagination={{ pageSize: 20 }}>
        <Table.Column prop="id" label="id" />
      </Table>
    )
    expect(screen.queryByRole('navigation')).toBeNull()
  })
})
