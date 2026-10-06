import React from 'react'
import { render, screen, fireEvent, within } from '@testing-library/react'
import axe from 'axe-core'
import { BolioUIProvider, Tree } from '..'
import type { TreeNodeData } from '..'

const data: Array<TreeNodeData> = [
  {
    value: 'src',
    label: 'src',
    children: [
      {
        value: 'components',
        label: 'components',
        children: [{ value: 'button', label: 'Button.tsx' }]
      },
      { value: 'index', label: 'index.ts' }
    ]
  },
  { value: 'locked', label: 'locked', disabled: true },
  { value: 'package', label: 'package.json' }
]

type Props = Partial<React.ComponentProps<typeof Tree>>
const setup = (props: Props = {}) =>
  render(
    <BolioUIProvider>
      <Tree aria-label="Files" data={data} {...props} />
    </BolioUIProvider>
  )

const item = (name: string) => screen.getByRole('treeitem', { name })
const press = (name: string, key: string) =>
  fireEvent.keyDown(item(name), { key })

describe('<Tree />', () => {
  it('is a named tree with the first level in view and the rest closed', () => {
    setup()
    expect(screen.getByRole('tree', { name: 'Files' })).toBeInTheDocument()
    expect(screen.getAllByRole('treeitem')).toHaveLength(3)
    expect(item('src')).toHaveAttribute('aria-expanded', 'false')
    expect(item('package.json')).not.toHaveAttribute('aria-expanded')
    expect(item('src')).toHaveAttribute('aria-level', '1')
  })

  it('shows the children of the initially expanded nodes with their level', () => {
    setup({ initialExpanded: ['src', 'components'] })
    const group = within(item('src')).getAllByRole('group')[0]
    expect(group).toBeInTheDocument()
    expect(item('src')).toHaveAttribute('aria-expanded', 'true')
    expect(item('components')).toHaveAttribute('aria-level', '2')
    expect(item('Button.tsx')).toHaveAttribute('aria-level', '3')
  })

  it('selects a node on click, and a parent also opens or closes', () => {
    const onChange = jest.fn()
    setup({ onChange })
    fireEvent.click(screen.getByText('package.json'))
    expect(item('package.json')).toHaveAttribute('aria-selected', 'true')
    expect(onChange).toHaveBeenCalledWith('package', data[2])
    fireEvent.click(screen.getByText('src'))
    expect(item('src')).toHaveAttribute('aria-expanded', 'true')
    expect(item('src')).toHaveAttribute('aria-selected', 'true')
    expect(item('package.json')).toHaveAttribute('aria-selected', 'false')
    fireEvent.click(screen.getByText('src'))
    expect(item('src')).toHaveAttribute('aria-expanded', 'false')
    expect(onChange).toHaveBeenCalledTimes(2)
  })

  it('ignores a disabled node', () => {
    const onChange = jest.fn()
    setup({ onChange })
    fireEvent.click(screen.getByText('locked'))
    expect(onChange).not.toHaveBeenCalled()
    expect(item('locked')).toHaveAttribute('aria-disabled', 'true')
  })

  it('has one tab stop: the selected node, else the first', () => {
    const { unmount } = setup()
    const stops = () =>
      screen
        .getAllByRole('treeitem')
        .filter((node) => node.getAttribute('tabindex') === '0')
    expect(stops().map((node) => node.dataset.value)).toEqual(['src'])
    unmount()
    setup({ initialValue: 'package' })
    expect(stops().map((node) => node.dataset.value)).toEqual(['package'])
  })

  it('moves focus with the arrows, Home and End, skipping disabled nodes', () => {
    setup({ initialExpanded: ['src'] })
    item('src').focus()
    press('src', 'ArrowDown')
    expect(item('components')).toHaveFocus()
    press('components', 'ArrowDown')
    expect(item('index.ts')).toHaveFocus()
    press('index.ts', 'ArrowDown')
    expect(item('package.json')).toHaveFocus()
    press('package.json', 'ArrowUp')
    expect(item('index.ts')).toHaveFocus()
    press('index.ts', 'End')
    expect(item('package.json')).toHaveFocus()
    press('package.json', 'Home')
    expect(item('src')).toHaveFocus()
  })

  it('opens with ArrowRight, goes in, and closes or goes up with ArrowLeft', () => {
    setup()
    item('src').focus()
    press('src', 'ArrowRight')
    expect(item('src')).toHaveAttribute('aria-expanded', 'true')
    press('src', 'ArrowRight')
    expect(item('components')).toHaveFocus()
    press('components', 'ArrowLeft')
    expect(item('src')).toHaveFocus()
    press('src', 'ArrowLeft')
    expect(item('src')).toHaveAttribute('aria-expanded', 'false')
  })

  it('selects with Enter and Space', () => {
    const onChange = jest.fn()
    setup({ onChange })
    item('package.json').focus()
    press('package.json', 'Enter')
    expect(onChange).toHaveBeenLastCalledWith('package', data[2])
    press('src', ' ')
    expect(onChange).toHaveBeenLastCalledWith('src', data[0])
  })

  it('follows value and expanded when controlled and only reports the change', () => {
    const onChange = jest.fn()
    const onExpandedChange = jest.fn()
    setup({ value: 'package', expanded: [], onChange, onExpandedChange })
    fireEvent.click(screen.getByText('src'))
    expect(onChange).toHaveBeenCalledWith('src', data[0])
    expect(onExpandedChange).toHaveBeenCalledWith(['src'])
    expect(item('package.json')).toHaveAttribute('aria-selected', 'true')
    expect(item('src')).toHaveAttribute('aria-expanded', 'false')
  })

  it('shows the icon of a node', () => {
    setup({
      data: [{ value: 'a', label: 'A', icon: <i data-testid="icon" /> }]
    })
    expect(screen.getByTestId('icon')).toBeInTheDocument()
  })

  it('has no accessibility violations', async () => {
    const { container } = setup({
      initialExpanded: ['src'],
      initialValue: 'index'
    })
    const results = await axe.run(container, {
      rules: { region: { enabled: false } }
    })
    expect(results.violations).toEqual([])
  })
})
