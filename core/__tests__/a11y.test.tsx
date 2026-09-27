import React from 'react'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import axe from 'axe-core'
import {
  BolioUIProvider,
  Code,
  Collapse,
  Drawer,
  Input,
  Loading,
  Modal,
  Pagination,
  Popover,
  Rating,
  Select,
  Slider,
  Spinner,
  Tabs,
  Toggle,
  Tooltip,
  useToasts
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

  it('Code tabs expose tablist, tab and tabpanel and move with the arrow keys', () => {
    const Tabbed = () => {
      const [active, setActive] = React.useState(0)
      const codes = ['first code', 'second code']
      return (
        <Code
          block
          tabs={['a.js', 'b.js']}
          activeTab={active}
          onTabChange={setActive}
        >
          {codes[active]}
        </Code>
      )
    }
    wrap(<Tabbed />)
    const [a, b] = screen.getAllByRole('tab')
    expect(a).toHaveAttribute('aria-selected', 'true')
    expect(b).toHaveAttribute('tabindex', '-1')
    expect(screen.getByRole('tabpanel')).toHaveTextContent('first code')
    expect(screen.getByRole('tabpanel')).toHaveAttribute(
      'aria-labelledby',
      a.id
    )

    fireEvent.keyDown(a, { key: 'ArrowRight' })
    expect(screen.getAllByRole('tab')[1]).toHaveAttribute(
      'aria-selected',
      'true'
    )
    expect(screen.getByRole('tabpanel')).toHaveTextContent('second code')
    expect(screen.getAllByRole('tab')[1]).toHaveFocus()

    fireEvent.keyDown(screen.getAllByRole('tab')[1], { key: 'ArrowRight' })
    expect(screen.getAllByRole('tab')[0]).toHaveAttribute(
      'aria-selected',
      'true'
    )
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
    expect(trigger).toHaveAttribute('aria-describedby', tooltip.id)

    fireEvent.keyDown(trigger, { key: 'Escape' })
    await waitFor(() =>
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
    )
  })

  it('Drawer closes with Escape by default, like Modal', () => {
    const onClose = jest.fn()
    wrap(
      <Drawer visible placement="right" onClose={onClose}>
        Drawer
      </Drawer>
    )
    fireEvent.keyDown(screen.getByRole('dialog'), {
      key: 'Escape',
      keyCode: 27
    })
    expect(onClose).toHaveBeenCalled()
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

  it('Popover with a text trigger is a button that opens with the keyboard', async () => {
    wrap(<Popover content={<span>Menu body</span>}>Menu</Popover>)
    const trigger = screen.getByRole('button', { name: 'Menu' })
    expect(trigger).toHaveAttribute('tabindex', '0')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')

    fireEvent.keyDown(trigger, { key: 'Enter' })
    const body = await screen.findByText('Menu body')
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(trigger).toHaveAttribute(
      'aria-controls',
      body.closest('.tooltip-content')?.id
    )
  })

  it('Popover puts its state on a button trigger', async () => {
    wrap(
      <Popover content={<span>Popover body</span>}>
        <button>Open</button>
      </Popover>
    )
    const trigger = screen.getByRole('button', { name: 'Open' })
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    fireEvent.click(trigger)
    await screen.findByText('Popover body')
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
  })

  it('Rating is a radio group that moves with the arrow keys', () => {
    const onValueChange = jest.fn()
    wrap(
      <Rating
        aria-label="Score"
        initialValue={3}
        onValueChange={onValueChange}
      />
    )
    expect(
      screen.getByRole('radiogroup', { name: 'Score' })
    ).toBeInTheDocument()
    const radios = screen.getAllByRole('radio')
    expect(radios).toHaveLength(5)
    expect(radios[2]).toHaveAttribute('aria-checked', 'true')
    expect(radios[2]).toHaveAttribute('tabindex', '0')
    expect(radios[0]).toHaveAttribute('tabindex', '-1')

    fireEvent.keyDown(radios[2], { key: 'ArrowRight' })
    expect(radios[3]).toHaveAttribute('aria-checked', 'true')
    expect(radios[3]).toHaveFocus()
    expect(onValueChange).toHaveBeenLastCalledWith(4)

    fireEvent.keyDown(radios[3], { key: 'End' })
    expect(radios[4]).toHaveAttribute('aria-checked', 'true')
    fireEvent.keyDown(radios[4], { key: 'ArrowRight' })
    expect(radios[4]).toHaveAttribute('aria-checked', 'true')
    fireEvent.keyDown(radios[4], { key: 'Home' })
    expect(radios[0]).toHaveAttribute('aria-checked', 'true')
  })

  it('Input is named by its label and described by its error', () => {
    wrap(
      <Input error errorMessage="Use a valid email">
        Email
      </Input>
    )
    const input = screen.getByLabelText('Email')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveAccessibleDescription('Use a valid email')
  })

  it('Input.Password toggle is a button that works with the keyboard', () => {
    wrap(<Input.Password aria-label="Password" />)
    const input = screen.getByLabelText('Password')
    expect(input).toHaveAttribute('type', 'password')
    fireEvent.click(screen.getByRole('button', { name: 'Show password' }))
    expect(input).toHaveAttribute('type', 'text')
    expect(
      screen.getByRole('button', { name: 'Hide password' })
    ).toBeInTheDocument()
  })

  it('Modal is named by its title and described by its subtitle', () => {
    wrap(
      <Modal visible onClose={() => undefined}>
        <Modal.Title>Delete file</Modal.Title>
        <Modal.Subtitle>This cannot be undone</Modal.Subtitle>
      </Modal>
    )
    const dialog = screen.getByRole('dialog', { name: 'Delete file' })
    expect(dialog).toHaveAccessibleDescription('This cannot be undone')
  })

  it('Modal can be an alert dialog', () => {
    wrap(
      <Modal visible role="alertdialog" onClose={() => undefined}>
        <Modal.Title>Discard changes</Modal.Title>
      </Modal>
    )
    expect(
      screen.getByRole('alertdialog', { name: 'Discard changes' })
    ).toHaveAttribute('aria-modal', 'true')
  })

  it('Toast is announced: status for messages and alert for errors', async () => {
    const Notify = ({ type }: { type: 'success' | 'error' }) => {
      const { setToast } = useToasts()
      React.useEffect(() => {
        setToast({ text: `${type} message`, type })
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [])
      return null
    }
    wrap(
      <>
        <Notify type="success" />
        <Notify type="error" />
      </>
    )
    expect(await screen.findByRole('status')).toHaveTextContent(
      'success message'
    )
    expect(await screen.findByRole('alert')).toHaveTextContent('error message')
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
