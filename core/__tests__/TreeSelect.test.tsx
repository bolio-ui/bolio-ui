import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { BolioUIProvider, TreeSelect } from '..'

const data = [
  {
    value: 'src',
    label: 'src',
    children: [
      { value: 'src/index.ts', label: 'index.ts' },
      { value: 'src/app.tsx', label: 'app.tsx' }
    ]
  },
  { value: 'README.md', label: 'README.md' }
]

const setup = (
  props: Partial<React.ComponentProps<typeof TreeSelect>> = {}
) => {
  const onChange = jest.fn()
  render(
    <BolioUIProvider>
      <TreeSelect
        aria-label="File"
        data={data}
        placeholder="Pick a file"
        onChange={onChange}
        {...props}
      />
    </BolioUIProvider>
  )
  return { onChange }
}

const field = () =>
  screen.getByRole('button', { name: /File|Pick|index|app|README/ })

describe('<TreeSelect />', () => {
  it('shows the placeholder and opens the tree', () => {
    setup()
    expect(field()).toHaveTextContent('Pick a file')
    expect(field()).toHaveAttribute('aria-expanded', 'false')
    fireEvent.click(field())
    expect(field()).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('tree')).toBeInTheDocument()
  })

  it('only opens a node with children, and chooses a leaf', () => {
    const { onChange } = setup()
    fireEvent.click(field())
    fireEvent.click(screen.getByText('src'))
    expect(onChange).not.toHaveBeenCalled()
    expect(screen.getByRole('tree')).toBeInTheDocument()
    fireEvent.click(screen.getByText('app.tsx'))
    expect(onChange).toHaveBeenCalledWith(
      'src/app.tsx',
      expect.objectContaining({ value: 'src/app.tsx' })
    )
    expect(screen.queryByRole('tree')).toBeNull()
    expect(field()).toHaveTextContent('app.tsx')
  })

  it('opens on the chosen node and takes the focus', () => {
    setup({ initialValue: 'src/index.ts' })
    fireEvent.click(field())
    const item = screen.getByRole('treeitem', { name: 'index.ts' })
    expect(item).toHaveAttribute('aria-selected', 'true')
    expect(document.activeElement).toBe(item)
  })

  it('closes with Escape and gives the focus back', () => {
    setup()
    fireEvent.click(field())
    fireEvent.keyDown(screen.getByRole('tree'), { key: 'Escape' })
    expect(screen.queryByRole('tree')).toBeNull()
    expect(document.activeElement).toBe(field())
  })

  it('closes on a click outside, and shows a controlled value', () => {
    setup({ value: 'README.md' })
    expect(field()).toHaveTextContent('README.md')
    fireEvent.click(field())
    fireEvent.click(document.body)
    expect(screen.queryByRole('tree')).toBeNull()
  })

  it('does not open when disabled', () => {
    setup({ disabled: true })
    fireEvent.click(field())
    expect(screen.queryByRole('tree')).toBeNull()
  })
})
