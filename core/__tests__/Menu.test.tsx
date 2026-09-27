import React, { useState } from 'react'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import axe from 'axe-core'
import { BolioUIProvider, Button, Menu } from '..'

const Example = ({
  onEdit = () => undefined,
  onDelete = () => undefined
}: {
  onEdit?: () => void
  onDelete?: () => void
}) => {
  const [grid, setGrid] = useState(true)
  const [sort, setSort] = useState('name')
  return (
    <Menu trigger={<Button effect={false}>Options</Button>}>
      <Menu.Label>Actions</Menu.Label>
      <Menu.Item shortcut="⌘E" onClick={onEdit}>
        Edit
      </Menu.Item>
      <Menu.Item>Duplicate</Menu.Item>
      <Menu.Item disabled>Archive</Menu.Item>
      <Menu.Sub label="Share">
        <Menu.Item>Email</Menu.Item>
        <Menu.Item>Link</Menu.Item>
      </Menu.Sub>
      <Menu.Divider />
      <Menu.CheckboxItem checked={grid} onChange={setGrid}>
        Show grid
      </Menu.CheckboxItem>
      <Menu.RadioGroup aria-label="Sort" value={sort} onChange={setSort}>
        <Menu.RadioItem value="name">Name</Menu.RadioItem>
        <Menu.RadioItem value="date">Date</Menu.RadioItem>
      </Menu.RadioGroup>
      <Menu.Divider />
      <Menu.Item type="error" onClick={onDelete}>
        Delete
      </Menu.Item>
    </Menu>
  )
}

const setup = (props: React.ComponentProps<typeof Example> = {}) => {
  render(
    <BolioUIProvider>
      <Example {...props} />
    </BolioUIProvider>
  )
  return screen.getByRole('button', { name: 'Options' })
}

const focused = () => document.activeElement as HTMLElement
const item = (name: string) => screen.getByRole('menuitem', { name })
const press = (key: string) => fireEvent.keyDown(focused(), { key })

describe('<Menu />', () => {
  // let the open and close transitions finish inside act
  afterEach(() => act(() => new Promise((resolve) => setTimeout(resolve, 200))))

  it('links the trigger and the menu', () => {
    const trigger = setup()
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()

    fireEvent.click(trigger, { detail: 1 })
    const menu = screen.getByRole('menu')
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(trigger).toHaveAttribute('aria-controls', menu.id)
    expect(menu).toHaveAttribute('aria-labelledby', trigger.id)
    // opened with the pointer: the menu takes the focus, not an item
    expect(focused()).toBe(menu)
  })

  it('opens from the keyboard on the first or the last item', async () => {
    const trigger = setup()
    fireEvent.keyDown(trigger, { key: 'ArrowDown' })
    expect(focused()).toBe(item('Edit'))

    press('Escape')
    await waitFor(() =>
      expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    )
    expect(focused()).toBe(trigger)

    fireEvent.keyDown(trigger, { key: 'ArrowUp' })
    expect(focused()).toBe(item('Delete'))
  })

  it('moves with the arrows, Home and End, skipping disabled items', () => {
    const trigger = setup()
    fireEvent.keyDown(trigger, { key: 'ArrowDown' })
    press('ArrowDown')
    expect(focused()).toBe(item('Duplicate'))
    press('ArrowDown')
    expect(focused()).toBe(item('Share'))
    press('End')
    expect(focused()).toBe(item('Delete'))
    press('ArrowDown')
    expect(focused()).toBe(item('Edit'))
    press('ArrowUp')
    expect(focused()).toBe(item('Delete'))
    press('Home')
    expect(focused()).toBe(item('Edit'))
    expect(item('Archive')).toHaveAttribute('aria-disabled', 'true')
  })

  it('runs an item with Enter, closes and returns the focus', async () => {
    const onEdit = jest.fn()
    const trigger = setup({ onEdit })
    fireEvent.keyDown(trigger, { key: 'ArrowDown' })
    press('Enter')
    expect(onEdit).toHaveBeenCalledTimes(1)
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(focused()).toBe(trigger)
    await waitFor(() =>
      expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    )
  })

  it('ignores clicks on a disabled item', () => {
    const trigger = setup()
    fireEvent.click(trigger, { detail: 1 })
    fireEvent.click(item('Archive'), { detail: 1 })
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
  })

  it('toggles a checkbox item and keeps the menu open', () => {
    const trigger = setup()
    fireEvent.click(trigger, { detail: 1 })
    const grid = screen.getByRole('menuitemcheckbox', { name: 'Show grid' })
    expect(grid).toHaveAttribute('aria-checked', 'true')
    fireEvent.click(grid, { detail: 1 })
    expect(grid).toHaveAttribute('aria-checked', 'false')
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
  })

  it('checks one radio item of the group', () => {
    const trigger = setup()
    fireEvent.click(trigger, { detail: 1 })
    expect(screen.getByRole('group', { name: 'Sort' })).toBeInTheDocument()
    const name = screen.getByRole('menuitemradio', { name: 'Name' })
    const date = screen.getByRole('menuitemradio', { name: 'Date' })
    expect(name).toHaveAttribute('aria-checked', 'true')
    fireEvent.click(date, { detail: 1 })
    expect(date).toHaveAttribute('aria-checked', 'true')
    expect(name).toHaveAttribute('aria-checked', 'false')
  })

  it('opens a submenu with ArrowRight and leaves it with ArrowLeft', () => {
    const trigger = setup()
    fireEvent.keyDown(trigger, { key: 'ArrowDown' })
    press('End')
    press('Home')
    const share = item('Share')
    share.focus()
    expect(share).toHaveAttribute('aria-haspopup', 'menu')
    expect(share).toHaveAttribute('aria-expanded', 'false')

    press('ArrowRight')
    expect(share).toHaveAttribute('aria-expanded', 'true')
    const sub = screen.getAllByRole('menu')[1]
    expect(share).toHaveAttribute('aria-controls', sub.id)
    expect(focused()).toBe(item('Email'))

    // arrows stay inside the submenu
    press('ArrowDown')
    expect(focused()).toBe(item('Link'))
    press('ArrowDown')
    expect(focused()).toBe(item('Email'))

    press('ArrowLeft')
    expect(screen.getAllByRole('menu')).toHaveLength(1)
    expect(focused()).toBe(share)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
  })

  it('closes only the submenu with Escape, and everything after a choice', () => {
    const trigger = setup()
    fireEvent.keyDown(trigger, { key: 'ArrowDown' })
    item('Share').focus()
    press('Enter')
    expect(focused()).toBe(item('Email'))

    press('Escape')
    expect(screen.getAllByRole('menu')).toHaveLength(1)
    expect(focused()).toBe(item('Share'))
    expect(trigger).toHaveAttribute('aria-expanded', 'true')

    fireEvent.mouseEnter(item('Share'))
    fireEvent.click(item('Link'), { detail: 1 })
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(focused()).toBe(trigger)
  })

  it('opens a submenu on hover and closes it when another item is hovered', () => {
    const trigger = setup()
    fireEvent.click(trigger, { detail: 1 })
    fireEvent.mouseEnter(item('Share'))
    expect(item('Share')).toHaveAttribute('aria-expanded', 'true')
    fireEvent.mouseMove(item('Duplicate'))
    expect(item('Share')).toHaveAttribute('aria-expanded', 'false')
    expect(focused()).toBe(item('Duplicate'))
  })

  it('jumps to an item by typing the start of its name', () => {
    let now = 1000
    const clock = jest.spyOn(Date, 'now').mockImplementation(() => now)
    const trigger = setup()
    fireEvent.keyDown(trigger, { key: 'ArrowDown' })
    press('d')
    expect(focused()).toBe(item('Duplicate'))
    // the same letter again goes to the next item that starts with it
    press('d')
    expect(focused()).toHaveTextContent('Date')
    press('d')
    expect(focused()).toBe(item('Delete'))

    // after a pause the letters start a new search
    now += 1000
    press('s')
    expect(focused()).toBe(item('Share'))
    press('h')
    press('o')
    expect(focused()).toHaveTextContent('Show grid')
    clock.mockRestore()
  })

  it('closes on a click outside', () => {
    const trigger = setup()
    fireEvent.click(trigger, { detail: 1 })
    fireEvent.click(document.body)
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })

  it('can be controlled', () => {
    const onVisibleChange = jest.fn()
    render(
      <BolioUIProvider>
        <Menu
          visible
          onVisibleChange={onVisibleChange}
          trigger={<Button>Options</Button>}
        >
          <Menu.Item>Edit</Menu.Item>
        </Menu>
      </BolioUIProvider>
    )
    expect(screen.getByRole('menu')).toBeInTheDocument()
    press('Escape')
    expect(onVisibleChange).toHaveBeenCalledWith(false)
    // the parent did not change `visible`, so the menu stays
    expect(screen.getByRole('menu')).toBeInTheDocument()
  })

  it('has no axe violations while open, with a submenu', async () => {
    const trigger = setup()
    fireEvent.click(trigger, { detail: 1 })
    fireEvent.mouseEnter(item('Share'))
    // the menu lives in a portal, so axe checks the whole body; a test page
    // has no landmarks, which is what `region` reports
    const result = await axe.run(document.body, {
      rules: {
        'color-contrast': { enabled: false },
        region: { enabled: false }
      }
    })
    expect(result.violations.map((v) => `${v.id}: ${v.help}`)).toEqual([])
  })
})
