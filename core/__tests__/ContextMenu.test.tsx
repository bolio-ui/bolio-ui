import React from 'react'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import axe from 'axe-core'
import { BolioUIProvider, ContextMenu, Menu } from '..'

type Props = Partial<React.ComponentProps<typeof ContextMenu>>
const setup = (props: Props = {}, onCopy = () => undefined) =>
  render(
    <BolioUIProvider>
      <ContextMenu
        tabIndex={0}
        data-testid="area"
        content={
          <>
            <Menu.Item onClick={onCopy}>Copy</Menu.Item>
            <Menu.Item>Paste</Menu.Item>
            <Menu.Divider />
            <Menu.Item type="error">Delete</Menu.Item>
          </>
        }
        {...props}
      >
        Right click here
      </ContextMenu>
    </BolioUIProvider>
  )

const area = () => screen.getByTestId('area')
const rightClick = (x = 120, y = 80) =>
  fireEvent.contextMenu(area(), { clientX: x, clientY: y })
// the point where the menu is anchored
const anchor = () =>
  document.querySelector('[aria-haspopup="menu"]')?.parentElement as HTMLElement

describe('<ContextMenu />', () => {
  // let the open and close transitions finish inside act
  afterEach(() => act(() => new Promise((resolve) => setTimeout(resolve, 200))))

  it('opens a menu on the right click, instead of the one of the browser', () => {
    setup()
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    const notPrevented = rightClick()
    expect(notPrevented).toBe(false)
    expect(screen.getByRole('menu')).toBeInTheDocument()
    expect(screen.getAllByRole('menuitem')).toHaveLength(3)
  })

  it('anchors the menu at the pointer', () => {
    setup()
    rightClick(120, 80)
    expect(anchor().style.position).toBe('fixed')
    expect(anchor().style.left).toBe('120px')
    expect(anchor().style.top).toBe('80px')
  })

  it('moves the menu to the point of a new right click', () => {
    setup()
    rightClick(120, 80)
    rightClick(300, 200)
    expect(screen.getAllByRole('menu')).toHaveLength(1)
    expect(anchor().style.left).toBe('300px')
    expect(anchor().style.top).toBe('200px')
  })

  it('runs the item, closes, and gives the focus back to the area', async () => {
    const onCopy = jest.fn()
    setup({}, onCopy)
    rightClick()
    fireEvent.click(screen.getByRole('menuitem', { name: 'Copy' }), {
      detail: 1
    })
    expect(onCopy).toHaveBeenCalledTimes(1)
    await waitFor(() =>
      expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    )
    expect(area()).toHaveFocus()
  })

  it('closes with Escape', async () => {
    setup()
    rightClick()
    fireEvent.keyDown(screen.getByRole('menu'), { key: 'Escape' })
    await waitFor(() =>
      expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    )
    expect(area()).toHaveFocus()
  })

  it('closes when the page scrolls', async () => {
    setup()
    rightClick()
    fireEvent.scroll(window)
    await waitFor(() =>
      expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    )
  })

  it('reports when it opens and closes', async () => {
    const onVisibleChange = jest.fn()
    setup({ onVisibleChange })
    rightClick()
    expect(onVisibleChange).toHaveBeenLastCalledWith(true)
    fireEvent.keyDown(screen.getByRole('menu'), { key: 'Escape' })
    await waitFor(() => expect(onVisibleChange).toHaveBeenLastCalledWith(false))
  })

  it('leaves the menu of the browser alone when disabled', () => {
    setup({ disabled: true })
    const notPrevented = rightClick()
    expect(notPrevented).toBe(true)
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('lets a handler of the area refuse the menu', () => {
    setup({ onContextMenu: (event) => event.preventDefault() })
    rightClick()
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('has no accessibility violations with the menu open', async () => {
    const { container } = setup()
    rightClick()
    const results = await axe.run(container, {
      rules: { region: { enabled: false } }
    })
    expect(results.violations).toEqual([])
  })
})
