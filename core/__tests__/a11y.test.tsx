import React from 'react'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import axe from 'axe-core'
import {
  BolioUIProvider,
  Collapse,
  Drawer,
  Loading,
  Modal,
  Pagination,
  Popover,
  Select,
  Slider,
  Spinner,
  Tabs,
  Toggle,
  Tooltip
} from '..'
import { cases } from './cases'

const wrap = (ui: React.ReactElement) =>
  render(<BolioUIProvider>{ui}</BolioUIProvider>)

describe('semantics', () => {
  it('Toggle is announced as a switch', () => {
    wrap(<Toggle />)
    expect(screen.getByRole('switch')).toBeInTheDocument()
  })

  it('Collapse header works with the keyboard and exposes its state', () => {
    wrap(<Collapse title="Title">Body</Collapse>)
    const header = screen.getByRole('button')
    expect(header).toHaveAttribute('aria-expanded', 'false')
    expect(header).toHaveAttribute('tabindex', '0')

    fireEvent.keyDown(header, { key: 'Enter' })
    expect(header).toHaveAttribute('aria-expanded', 'true')
    fireEvent.keyDown(header, { key: ' ' })
    expect(header).toHaveAttribute('aria-expanded', 'false')
  })

  it('Tabs expose tablist, tab and tabpanel and move with the arrow keys', () => {
    wrap(
      <Tabs initialValue="1">
        <Tabs.Item label="One" value="1">
          One body
        </Tabs.Item>
        <Tabs.Item label="Two" value="2">
          Two body
        </Tabs.Item>
      </Tabs>
    )
    expect(screen.getByRole('tablist')).toBeInTheDocument()
    const [one, two] = screen.getAllByRole('tab')
    expect(one).toHaveAttribute('aria-selected', 'true')
    expect(two).toHaveAttribute('aria-selected', 'false')
    expect(screen.getByRole('tabpanel')).toHaveTextContent('One body')

    fireEvent.keyDown(one, { key: 'ArrowRight' })
    expect(screen.getAllByRole('tab')[1]).toHaveAttribute(
      'aria-selected',
      'true'
    )
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Two body')
  })

  it('Slider exposes its value and answers to the keyboard', () => {
    wrap(<Slider aria-label="Volume" initialValue={20} step={5} />)
    const slider = screen.getByRole('slider', { name: 'Volume' })
    expect(slider).toHaveAttribute('aria-valuemin', '0')
    expect(slider).toHaveAttribute('aria-valuemax', '100')
    expect(slider).toHaveAttribute('aria-valuenow', '20')

    fireEvent.keyDown(slider, { key: 'ArrowRight' })
    expect(slider).toHaveAttribute('aria-valuenow', '25')
    fireEvent.keyDown(slider, { key: 'ArrowLeft' })
    expect(slider).toHaveAttribute('aria-valuenow', '20')
    fireEvent.keyDown(slider, { key: 'Home' })
    expect(slider).toHaveAttribute('aria-valuenow', '0')
    fireEvent.keyDown(slider, { key: 'End' })
    expect(slider).toHaveAttribute('aria-valuenow', '100')
  })

  it('Pagination is a labelled list and marks the current page', () => {
    wrap(<Pagination count={5} initialPage={2} />)
    expect(screen.getByRole('navigation')).toHaveAttribute('aria-label')
    expect(screen.getByRole('list')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '2' })).toHaveAttribute(
      'aria-current',
      'page'
    )
    expect(screen.getByRole('button', { name: '3' })).not.toHaveAttribute(
      'aria-current'
    )
  })

  it('Select takes an accessible name', () => {
    wrap(
      <Select aria-label="Country" placeholder="Pick">
        <Select.Option value="1">One</Select.Option>
      </Select>
    )
    expect(
      screen.getByRole('combobox', { name: 'Country' })
    ).toBeInTheDocument()
  })

  it('Modal and Drawer are modal dialogs', () => {
    wrap(
      <>
        <Modal visible onClose={() => undefined}>
          <Modal.Title>Modal</Modal.Title>
        </Modal>
        <Drawer visible placement="right" onClose={() => undefined}>
          Drawer
        </Drawer>
      </>
    )
    const dialogs = screen.getAllByRole('dialog')
    expect(dialogs).toHaveLength(2)
    dialogs.forEach((dialog) =>
      expect(dialog).toHaveAttribute('aria-modal', 'true')
    )
  })

  it('Tooltip opens with the focus, describes its trigger and closes with Escape', async () => {
    wrap(
      <Tooltip text="Tip">
        <button>Trigger</button>
      </Tooltip>
    )
    const trigger = screen.getByRole('button', { name: 'Trigger' })
    act(() => trigger.focus())

    const tooltip = await screen.findByRole('tooltip')
    expect(tooltip).toHaveTextContent('Tip')
    expect(trigger.parentElement).toHaveAttribute(
      'aria-describedby',
      tooltip.id
    )

    fireEvent.keyDown(trigger, { key: 'Escape' })
    await waitFor(() =>
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
    )
  })

  it('Popover opens from a button and closes with Escape', async () => {
    wrap(
      <Popover content={<span>Popover body</span>}>
        <button>Open</button>
      </Popover>
    )
    const trigger = screen.getByRole('button', { name: 'Open' })
    fireEvent.click(trigger)
    expect(await screen.findByText('Popover body')).toBeInTheDocument()

    fireEvent.keyDown(trigger, { key: 'Escape' })
    await waitFor(() =>
      expect(screen.queryByText('Popover body')).not.toBeInTheDocument()
    )
  })

  it('Spinner and Loading are status indicators', () => {
    wrap(
      <>
        <Spinner />
        <Loading />
      </>
    )
    expect(screen.getAllByRole('status')).toHaveLength(2)
  })
})

// Form controls without a visible label need a name from the app: give them one.
const named: Record<string, () => React.ReactElement> = {
  Select: () => (
    <Select aria-label="Country" placeholder="Pick">
      <Select.Option value="1">One</Select.Option>
    </Select>
  ),
  Slider: () => <Slider aria-label="Volume" initialValue={20} />,
  Toggle: () => <Toggle aria-label="Notifications" />
}

describe('axe: no violations in the default render', () => {
  let errorSpy: jest.SpyInstance

  beforeEach(() => {
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined)
  })

  afterEach(() => {
    errorSpy.mockRestore()
  })

  // colour contrast depends on the theme and jsdom has no layout, so it is not checked here
  it.each(cases)('%s', async (name, factory) => {
    const element = (named[name] || factory)()
    const { container } = wrap(element)
    const result = await axe.run(container, {
      rules: { 'color-contrast': { enabled: false } }
    })
    expect(result.violations.map((v) => `${v.id}: ${v.help}`)).toEqual([])
  })
})
