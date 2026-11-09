import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import axe from 'axe-core'
import { BolioUIProvider, JsonViewer } from '..'

const value = {
  name: 'Ada',
  age: 36,
  admin: true,
  nothing: null,
  tags: ['math', 'code'],
  address: { city: 'London', geo: { lat: 51.5 } }
}

const draw = (props: Partial<React.ComponentProps<typeof JsonViewer>> = {}) =>
  render(
    <BolioUIProvider>
      <JsonViewer value={value} {...props} />
    </BolioUIProvider>
  )

// the text of a row starts with its chevron
const item = (text: RegExp | string) =>
  screen.getAllByRole('treeitem').find((el) => {
    const content = (el.textContent || '').replace(/^[▸▾]/, '')
    return typeof text === 'string'
      ? content.includes(text)
      : text.test(content)
  }) as HTMLElement

describe('<JsonViewer />', () => {
  it('is a tree named JSON, or by rootName', () => {
    draw()
    expect(screen.getByRole('tree', { name: 'JSON' })).toBeInTheDocument()
    draw({ rootName: 'user' })
    expect(screen.getByRole('tree', { name: 'user' })).toBeInTheDocument()
  })

  it('shows the first level open and the deeper ones folded', () => {
    draw()
    expect(item(/^"name"/)).toHaveTextContent('"Ada"')
    expect(item(/^"age"/)).toHaveTextContent('36')
    expect(item(/^"admin"/)).toHaveTextContent('true')
    expect(item(/^"nothing"/)).toHaveTextContent('null')
    expect(item(/^"address"/)).toHaveAttribute('aria-expanded', 'false')
    expect(item(/^"address"/)).toHaveTextContent('2 items')
    expect(screen.queryByText('"London"')).toBeNull()
  })

  it('opens and closes a node with a click', () => {
    draw()
    fireEvent.click(item(/^"address"/))
    expect(item(/^"address"/)).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText('"London"')).toBeInTheDocument()
    fireEvent.click(item(/^"address"/))
    expect(screen.queryByText('"London"')).toBeNull()
  })

  it('opens more levels with defaultExpandDepth, or all with allExpanded', () => {
    draw({ defaultExpandDepth: 2 })
    expect(screen.getByText('"London"')).toBeInTheDocument()
    expect(screen.queryByText('51.5')).toBeNull()
    draw({ allExpanded: true })
    expect(screen.getAllByText('51.5').length).toBeGreaterThan(0)
  })

  it('gives each node its level and position', () => {
    draw({ defaultExpandDepth: 2 })
    expect(item(/^"city"/)).toHaveAttribute('aria-level', '3')
    expect(item(/^"tags"/)).toHaveAttribute('aria-posinset', '5')
    expect(item(/^"tags"/)).toHaveAttribute('aria-setsize', '6')
  })

  it('has one tab stop', () => {
    draw()
    const stops = screen
      .getAllByRole('treeitem')
      .filter((el) => el.getAttribute('tabindex') === '0')
    expect(stops).toHaveLength(1)
  })

  it('walks the tree with the arrow keys', () => {
    draw()
    const root = screen.getAllByRole('treeitem')[0]
    root.focus()
    fireEvent.keyDown(root, { key: 'ArrowDown' })
    expect(item(/^"name"/)).toHaveFocus()
    fireEvent.keyDown(document.activeElement as Element, { key: 'ArrowDown' })
    expect(item(/^"age"/)).toHaveFocus()
    fireEvent.keyDown(document.activeElement as Element, { key: 'ArrowUp' })
    expect(item(/^"name"/)).toHaveFocus()
    fireEvent.keyDown(document.activeElement as Element, { key: 'End' })
    expect(item(/^"address"/)).toHaveFocus()
    fireEvent.keyDown(document.activeElement as Element, { key: 'Home' })
    expect(screen.getAllByRole('treeitem')[0]).toHaveFocus()
  })

  it('opens with ArrowRight, goes into the first child, and goes back with ArrowLeft', () => {
    draw()
    const address = item(/^"address"/)
    address.focus()
    fireEvent.keyDown(address, { key: 'ArrowRight' })
    expect(item(/^"address"/)).toHaveAttribute('aria-expanded', 'true')
    fireEvent.keyDown(document.activeElement as Element, { key: 'ArrowRight' })
    expect(item(/^"city"/)).toHaveFocus()
    fireEvent.keyDown(document.activeElement as Element, { key: 'ArrowLeft' })
    expect(item(/^"address"/)).toHaveFocus()
    fireEvent.keyDown(document.activeElement as Element, { key: 'ArrowLeft' })
    expect(item(/^"address"/)).toHaveAttribute('aria-expanded', 'false')
  })

  it('toggles with Enter and Space', () => {
    draw()
    const address = item(/^"address"/)
    address.focus()
    fireEvent.keyDown(address, { key: 'Enter' })
    expect(item(/^"address"/)).toHaveAttribute('aria-expanded', 'true')
    fireEvent.keyDown(document.activeElement as Element, { key: ' ' })
    expect(item(/^"address"/)).toHaveAttribute('aria-expanded', 'false')
  })

  it('never closes the root', () => {
    draw()
    const root = screen.getAllByRole('treeitem')[0]
    root.focus()
    fireEvent.keyDown(root, { key: 'ArrowLeft' })
    fireEvent.click(root)
    expect(screen.getAllByRole('treeitem')[0]).toHaveAttribute(
      'aria-expanded',
      'true'
    )
  })

  it('reports the path and value of a primitive that is chosen', () => {
    const onValueSelect = jest.fn()
    draw({ onValueSelect, defaultExpandDepth: 2 })
    fireEvent.click(item(/^"city"/))
    expect(onValueSelect).toHaveBeenCalledWith(['address', 'city'], 'London')
    const age = item(/^"age"/)
    age.focus()
    fireEvent.keyDown(age, { key: 'Enter' })
    expect(onValueSelect).toHaveBeenLastCalledWith(['age'], 36)
  })

  it('does not report a container', () => {
    const onValueSelect = jest.fn()
    draw({ onValueSelect })
    fireEvent.click(item(/^"address"/))
    expect(onValueSelect).not.toHaveBeenCalled()
  })

  it('cuts long lists and says how many are left', () => {
    draw({ value: Array.from({ length: 5 }, (_, i) => i), maxDisplayLength: 2 })
    expect(screen.getByText(/3 more items/)).toBeInTheDocument()
    expect(screen.getAllByRole('treeitem')).toHaveLength(3)
  })

  it('sorts the keys on request', () => {
    draw({ value: { b: 1, a: 2, c: 3 }, sortKeys: true })
    expect(
      screen
        .getAllByRole('treeitem')
        .slice(1)
        .map((el) => el.textContent?.match(/"(\w)"/)?.[1])
    ).toEqual(['a', 'b', 'c'])
  })

  it('shows empty containers without a toggle', () => {
    draw({ value: { list: [], map: {} } })
    expect(item(/^"list"/)).not.toHaveAttribute('aria-expanded')
    expect(item(/^"list"/)).toHaveTextContent('[]')
    expect(item(/^"map"/)).toHaveTextContent('{}')
  })

  it('shows a lone primitive as the root', () => {
    draw({ value: 42 })
    expect(screen.getAllByRole('treeitem')).toHaveLength(1)
    expect(screen.getByRole('treeitem')).toHaveTextContent('42')
  })

  it('opens and closes everything with the controls', () => {
    draw({ withControls: true })
    fireEvent.click(screen.getByRole('button', { name: 'Expand all' }))
    expect(screen.getAllByText('51.5').length).toBeGreaterThan(0)
    fireEvent.click(screen.getByRole('button', { name: 'Collapse all' }))
    expect(screen.queryByText('"London"')).toBeNull()
    expect(screen.getAllByRole('treeitem')[0]).toHaveAttribute(
      'aria-expanded',
      'true'
    )
  })

  it('copies the JSON', () => {
    const execCommand = jest.fn(() => true)
    Object.defineProperty(document, 'execCommand', {
      value: execCommand,
      configurable: true
    })
    jest.useFakeTimers()
    draw({ withCopyButton: true, copyLabel: 'Copy', copiedLabel: 'Done' })
    fireEvent.click(screen.getByRole('button', { name: 'Copy' }))
    expect(screen.getByRole('button', { name: 'Done' })).toBeInTheDocument()
    act(() => {
      jest.advanceTimersByTime(1500)
    })
    expect(screen.getByRole('button', { name: 'Copy' })).toBeInTheDocument()
    jest.useRealTimers()
  })

  it('has no accessibility violations', async () => {
    const { container } = draw({ withControls: true, withCopyButton: true })
    const result = await axe.run(container, {
      rules: {
        region: { enabled: false },
        'color-contrast': { enabled: false }
      }
    })
    expect(result.violations.map((v) => v.id)).toEqual([])
  })
})
