import React from 'react'
import { render, screen, fireEvent, within } from '@testing-library/react'
import axe from 'axe-core'
import { BolioUIProvider, Table } from '..'

type Person = { id: string; name: string; age: number; file: string }
const people: Array<Person> = [
  { id: 'c', name: 'Cora', age: 100, file: 'item 10' },
  { id: 'a', name: 'Ada', age: 9, file: 'item 2' },
  { id: 'b', name: 'Bruno', age: 36, file: 'item 1' }
]

type Props = Partial<React.ComponentProps<typeof Table<Person>>>
const setup = (props: Props = {}, sortable = true) =>
  render(
    <BolioUIProvider>
      <Table data={people} {...props}>
        <Table.Column prop="name" label="name" sortable={sortable} />
        <Table.Column prop="age" label="age" sortable={sortable} />
        <Table.Column prop="file" label="file" sortable={sortable} />
        <Table.Column prop="id" label="id" />
      </Table>
    </BolioUIProvider>
  )

const bodyRows = () => screen.getAllByRole('row').slice(1)
// the text of one column, in the order of the rows; `lead` skips the checkboxes
const column = (index: number, lead = 0) =>
  bodyRows().map(
    (row) => within(row).getAllByRole('cell')[index + lead].textContent
  )
const header = (name: string) =>
  screen.getByRole('columnheader', { name: new RegExp(name, 'i') })
const sortBy = (name: string) =>
  fireEvent.click(within(header(name)).getByRole('button'))

describe('<Table /> sorting', () => {
  it('turns the header of a sortable column into a button', () => {
    setup()
    expect(within(header('name')).getByRole('button')).toBeInTheDocument()
    expect(header('name')).toHaveAttribute('aria-sort', 'none')
    expect(within(header('id')).queryByRole('button')).not.toBeInTheDocument()
    expect(header('id')).not.toHaveAttribute('aria-sort')
  })

  it('keeps the order of the data until a header is clicked', () => {
    setup()
    expect(column(0)).toEqual(['Cora', 'Ada', 'Bruno'])
  })

  it('goes ascending, descending, and back to the order of the data', () => {
    const onSortChange = jest.fn()
    setup({ onSortChange })
    sortBy('name')
    expect(column(0)).toEqual(['Ada', 'Bruno', 'Cora'])
    expect(header('name')).toHaveAttribute('aria-sort', 'ascending')
    expect(onSortChange).toHaveBeenLastCalledWith({
      prop: 'name',
      direction: 'asc'
    })
    sortBy('name')
    expect(column(0)).toEqual(['Cora', 'Bruno', 'Ada'])
    expect(header('name')).toHaveAttribute('aria-sort', 'descending')
    expect(onSortChange).toHaveBeenLastCalledWith({
      prop: 'name',
      direction: 'desc'
    })
    sortBy('name')
    expect(column(0)).toEqual(['Cora', 'Ada', 'Bruno'])
    expect(header('name')).toHaveAttribute('aria-sort', 'none')
    expect(onSortChange).toHaveBeenLastCalledWith(null)
  })

  it('sorts numbers by value and text with the numbers in it by number', () => {
    setup()
    sortBy('age')
    expect(column(1)).toEqual(['9', '36', '100'])
    sortBy('file')
    expect(column(2)).toEqual(['item 1', 'item 2', 'item 10'])
  })

  it('sorts by one column at a time', () => {
    setup()
    sortBy('name')
    sortBy('age')
    expect(header('name')).toHaveAttribute('aria-sort', 'none')
    expect(header('age')).toHaveAttribute('aria-sort', 'ascending')
  })

  it('uses the sorter of the column when it has one', () => {
    render(
      <BolioUIProvider>
        <Table data={people}>
          <Table.Column
            prop="name"
            label="name"
            sortable
            sorter={(a: Person, b: Person) => b.age - a.age}
          />
        </Table>
      </BolioUIProvider>
    )
    sortBy('name')
    expect(column(0)).toEqual(['Cora', 'Bruno', 'Ada'])
  })

  it('starts on initialSort', () => {
    setup({ initialSort: { prop: 'age', direction: 'desc' } })
    expect(column(1)).toEqual(['100', '36', '9'])
    expect(header('age')).toHaveAttribute('aria-sort', 'descending')
  })

  it('follows sort when controlled and only reports the click', () => {
    const onSortChange = jest.fn()
    setup({ sort: { prop: 'name', direction: 'asc' }, onSortChange })
    sortBy('age')
    expect(onSortChange).toHaveBeenCalledWith({ prop: 'age', direction: 'asc' })
    expect(column(0)).toEqual(['Ada', 'Bruno', 'Cora'])
    expect(header('name')).toHaveAttribute('aria-sort', 'ascending')
  })

  it('sorts all the rows before it slices them into pages', () => {
    setup({ pagination: { pageSize: 2 } })
    sortBy('age')
    expect(column(1)).toEqual(['9', '36'])
    fireEvent.click(screen.getByRole('button', { name: /next/i }))
    expect(column(1)).toEqual(['100'])
  })

  it('leaves the order to the server when the total is set', () => {
    const onSortChange = jest.fn()
    setup({ pagination: { pageSize: 3, total: 9 }, onSortChange })
    sortBy('name')
    expect(onSortChange).toHaveBeenCalledWith({
      prop: 'name',
      direction: 'asc'
    })
    expect(column(0)).toEqual(['Cora', 'Ada', 'Bruno'])
  })
})

describe('<Table /> selection', () => {
  const checkbox = (index: number) =>
    screen.getAllByRole('checkbox', { name: 'Select row' })[index]
  const all = () => screen.getByRole('checkbox', { name: 'Select all rows' })

  it('has a checkbox on each row and one in the header', () => {
    setup({ selectable: true })
    expect(
      screen.getAllByRole('checkbox', { name: 'Select row' })
    ).toHaveLength(3)
    expect(all()).not.toBeChecked()
  })

  it('has none unless selectable', () => {
    setup()
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
  })

  it('selects a row by its position when there is no rowKey', () => {
    const onSelectionChange = jest.fn()
    setup({ selectable: true, onSelectionChange })
    fireEvent.click(checkbox(1))
    expect(checkbox(1)).toBeChecked()
    expect(onSelectionChange).toHaveBeenLastCalledWith([1], [people[1]])
    fireEvent.click(checkbox(1))
    expect(onSelectionChange).toHaveBeenLastCalledWith([], [])
  })

  it('selects by rowKey, as a prop or as a function', () => {
    const onSelectionChange = jest.fn()
    const { unmount } = setup({
      selectable: true,
      rowKey: 'id',
      onSelectionChange
    })
    fireEvent.click(checkbox(0))
    expect(onSelectionChange).toHaveBeenLastCalledWith(['c'], [people[0]])
    unmount()
    setup({
      selectable: true,
      rowKey: (row) => `p-${row.id}`,
      onSelectionChange
    })
    fireEvent.click(checkbox(2))
    expect(onSelectionChange).toHaveBeenLastCalledWith(['p-b'], [people[2]])
  })

  it('marks the selected rows', () => {
    setup({ selectable: true, initialSelectedKeys: [0] })
    expect(bodyRows()[0]).toHaveClass('selected')
    expect(bodyRows()[1]).not.toHaveClass('selected')
  })

  it('selects every row in view from the header, and clears them', () => {
    const onSelectionChange = jest.fn()
    setup({ selectable: true, onSelectionChange })
    fireEvent.click(all())
    expect(onSelectionChange).toHaveBeenLastCalledWith([0, 1, 2], people)
    expect(all()).toBeChecked()
    fireEvent.click(all())
    expect(onSelectionChange).toHaveBeenLastCalledWith([], [])
    expect(all()).not.toBeChecked()
  })

  it('shows the state in between when only some rows are selected', () => {
    setup({ selectable: true })
    fireEvent.click(checkbox(0))
    expect((all() as HTMLInputElement).indeterminate).toBe(true)
    expect(all()).not.toBeChecked()
    fireEvent.click(all())
    expect((all() as HTMLInputElement).indeterminate).toBe(false)
    expect(all()).toBeChecked()
  })

  it('keeps the selection across pages, and the header is about the page in view', () => {
    const onSelectionChange = jest.fn()
    setup({ selectable: true, pagination: { pageSize: 2 }, onSelectionChange })
    fireEvent.click(all())
    expect(onSelectionChange).toHaveBeenLastCalledWith(
      [0, 1],
      [people[0], people[1]]
    )
    fireEvent.click(screen.getByRole('button', { name: /next/i }))
    expect(all()).not.toBeChecked()
    fireEvent.click(checkbox(0))
    expect(onSelectionChange).toHaveBeenLastCalledWith([0, 1, 2], people)
    fireEvent.click(screen.getByRole('button', { name: /prev/i }))
    expect(all()).toBeChecked()
  })

  it('follows selectedKeys when controlled and only reports the change', () => {
    const onSelectionChange = jest.fn()
    setup({ selectable: true, selectedKeys: [0], onSelectionChange })
    fireEvent.click(checkbox(1))
    expect(onSelectionChange).toHaveBeenCalledWith(
      [0, 1],
      [people[0], people[1]]
    )
    expect(checkbox(1)).not.toBeChecked()
    expect(checkbox(0)).toBeChecked()
  })

  it('keeps a row selected when the table is sorted', () => {
    setup({ selectable: true, rowKey: 'id' })
    fireEvent.click(checkbox(1))
    sortBy('name')
    expect(column(0, 1)).toEqual(['Ada', 'Bruno', 'Cora'])
    expect(checkbox(0)).toBeChecked()
    expect(checkbox(1)).not.toBeChecked()
  })

  it('is not a click on the row', () => {
    const onRow = jest.fn()
    setup({ selectable: true, onRow })
    fireEvent.click(checkbox(0))
    expect(onRow).not.toHaveBeenCalled()
  })

  it('uses the labels it is given', () => {
    setup({
      selectable: true,
      selectRowLabel: 'Escolher linha',
      selectAllLabel: 'Escolher todas'
    })
    expect(
      screen.getByRole('checkbox', { name: 'Escolher todas' })
    ).toBeInTheDocument()
    expect(
      screen.getAllByRole('checkbox', { name: 'Escolher linha' })
    ).toHaveLength(3)
  })

  it('has no accessibility violations with sorting and selection', async () => {
    const { container } = setup({
      selectable: true,
      initialSelectedKeys: [0],
      initialSort: { prop: 'name', direction: 'asc' }
    })
    const results = await axe.run(container, {
      rules: { region: { enabled: false } }
    })
    expect(results.violations).toEqual([])
  })
})
