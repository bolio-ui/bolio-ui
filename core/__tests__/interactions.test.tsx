import React from 'react'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import {
  BolioUIProvider,
  Collapse,
  Pagination,
  Popover,
  Select,
  Table,
  Tooltip
} from '..'

const wrap = (ui: React.ReactElement) =>
  render(<BolioUIProvider>{ui}</BolioUIProvider>)

const settle = () =>
  act(() => new Promise((resolve) => setTimeout(resolve, 400)))

// What these components did before their hooks were checked by
// react-hooks/exhaustive-deps; they must keep doing it.
describe('interactions keep working', () => {
  let errors: jest.SpyInstance
  beforeEach(() => {
    errors = jest.spyOn(console, 'error').mockImplementation(() => undefined)
  })
  afterEach(() => {
    // no React warning, and no "maximum update depth" from an effect that
    // loops. Updates from timers outside act() are a test matter, not a bug.
    const problems = errors.mock.calls
      .map((call) => String(call[0]))
      .filter((message) => !message.includes('not wrapped in act'))
    expect(problems).toEqual([])
    errors.mockRestore()
  })

  it('Select picks an option, reports it and closes', async () => {
    const onChange = jest.fn()
    wrap(
      <Select placeholder="Pick" onChange={onChange}>
        <Select.Option value="1">One</Select.Option>
        <Select.Option value="2">Two</Select.Option>
      </Select>
    )
    fireEvent.click(screen.getByRole('combobox'))
    await settle()
    fireEvent.click(screen.getByText('Two'))
    expect(onChange).toHaveBeenCalledWith('2')
    await settle()
    expect(screen.getByRole('combobox')).toHaveAttribute(
      'aria-expanded',
      'false'
    )
  })

  it('Select with multiple values toggles the options', async () => {
    const onChange = jest.fn()
    wrap(
      <Select multiple initialValue={['1']} onChange={onChange}>
        <Select.Option value="1">One</Select.Option>
        <Select.Option value="2">Two</Select.Option>
      </Select>
    )
    fireEvent.click(screen.getByRole('combobox'))
    await settle()
    fireEvent.click(screen.getAllByText('Two').pop() as HTMLElement)
    expect(onChange).toHaveBeenLastCalledWith(['1', '2'])
  })

  it('Select follows a controlled value', async () => {
    const ui = (value: string) => (
      <BolioUIProvider>
        <Select value={value}>
          <Select.Option value="1">One</Select.Option>
          <Select.Option value="2">Two</Select.Option>
        </Select>
      </BolioUIProvider>
    )
    const { rerender } = render(ui('1'))
    expect(screen.getByText('One')).toBeInTheDocument()
    rerender(ui('2'))
    await settle()
    expect(screen.getByText('Two')).toBeInTheDocument()
  })

  it('Popover asks to close when one of its items is chosen', async () => {
    const onVisibleChange = jest.fn()
    wrap(
      <Popover
        onVisibleChange={onVisibleChange}
        content={
          <Popover.Item>
            <span>Item</span>
          </Popover.Item>
        }
        trigger="click"
      >
        <span>Open</span>
      </Popover>
    )
    fireEvent.click(screen.getByText('Open'))
    await settle()
    expect(onVisibleChange).toHaveBeenLastCalledWith(true)
    fireEvent.click(screen.getByText('Item'))
    expect(onVisibleChange).toHaveBeenLastCalledWith(false)
  })

  it('Tooltip follows its controlled visible prop', async () => {
    const ui = (visible: boolean) => (
      <BolioUIProvider>
        <Tooltip text="Tip" visible={visible}>
          <span>Trigger</span>
        </Tooltip>
      </BolioUIProvider>
    )
    const { rerender } = render(ui(false))
    expect(screen.queryByText('Tip')).not.toBeInTheDocument()
    rerender(ui(true))
    await waitFor(() => expect(screen.getByText('Tip')).toBeInTheDocument())
    rerender(ui(false))
    await waitFor(() =>
      expect(screen.queryByText('Tip')).not.toBeInTheDocument()
    )
  })

  it('Collapse expands and collapses', async () => {
    wrap(<Collapse title="Title">Body</Collapse>)
    const header = screen.getByRole('button')
    fireEvent.click(header)
    await settle()
    expect(header).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText('Body').closest('.container')).toHaveClass(
      'expanded'
    )

    fireEvent.click(header)
    await settle()
    expect(header).toHaveAttribute('aria-expanded', 'false')
    expect(screen.getByText('Body').closest('.container')).not.toHaveClass(
      'expanded'
    )
  })

  it('Collapse.Group in accordion mode keeps one open', async () => {
    wrap(
      <Collapse.Group accordion>
        <Collapse title="One">A</Collapse>
        <Collapse title="Two">B</Collapse>
      </Collapse.Group>
    )
    const [one, two] = screen.getAllByRole('button')
    fireEvent.click(one)
    await settle()
    expect(one).toHaveAttribute('aria-expanded', 'true')
    fireEvent.click(two)
    await settle()
    expect(two).toHaveAttribute('aria-expanded', 'true')
    expect(one).toHaveAttribute('aria-expanded', 'false')
  })

  it('Pagination goes to the next page and reports it', () => {
    const onChange = jest.fn()
    wrap(<Pagination count={5} initialPage={1} onChange={onChange} />)
    const current = () =>
      screen.getByRole('button', { current: 'page' }).textContent
    expect(current()).toBe('1')
    fireEvent.click(screen.getAllByRole('button').slice(-1)[0])
    expect(current()).toBe('2')
    expect(onChange).toHaveBeenLastCalledWith(2)
  })

  it('Table shows its columns and follows a changed label', () => {
    const data = [{ name: 'Ada', age: 36 }]
    const ui = (label: string) => (
      <BolioUIProvider>
        <Table data={data}>
          <Table.Column prop="name" label={label} />
          <Table.Column prop="age" label="Age" />
        </Table>
      </BolioUIProvider>
    )
    const { rerender } = render(ui('Name'))
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Age')).toBeInTheDocument()
    expect(screen.getByText('Ada')).toBeInTheDocument()
    rerender(ui('Person'))
    expect(screen.getByText('Person')).toBeInTheDocument()
    expect(screen.queryByText('Name')).not.toBeInTheDocument()
  })
})
