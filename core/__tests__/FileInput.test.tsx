import React from 'react'
import { fireEvent, render } from '@testing-library/react'
import { BolioUIProvider, FileInput } from '..'

const draw = (node: React.ReactElement) =>
  render(<BolioUIProvider>{node}</BolioUIProvider>)

const pick = (container: HTMLElement, files: File[]) =>
  fireEvent.change(container.querySelector('input[type="file"]') as Element, {
    target: { files }
  })

const a = new File(['a'], 'a.png', { type: 'image/png' })
const b = new File(['b'], 'b.png', { type: 'image/png' })

describe('<FileInput />', () => {
  it('shows the placeholder until a file is picked', () => {
    const { getByRole, container } = draw(
      <FileInput aria-label="Upload" placeholder="Pick one" />
    )
    expect(getByRole('button', { name: 'Upload' }).textContent).toBe('Pick one')
    pick(container, [a])
    expect(getByRole('button', { name: 'Upload' }).textContent).toBe('a.png')
  })

  it('opens the file dialog from the field', () => {
    const { getByRole, container } = draw(<FileInput aria-label="Upload" />)
    const click = jest.spyOn(
      container.querySelector('input[type="file"]') as HTMLInputElement,
      'click'
    )
    fireEvent.click(getByRole('button', { name: 'Upload' }))
    expect(click).toHaveBeenCalled()
  })

  it('reports one file, or a list with multiple', () => {
    const onChange = jest.fn()
    const single = draw(<FileInput aria-label="One" onChange={onChange} />)
    pick(single.container, [a, b])
    expect(onChange).toHaveBeenLastCalledWith(a)

    const many = draw(
      <FileInput aria-label="Many" multiple onChange={onChange} />
    )
    pick(many.container, [a, b])
    expect(onChange).toHaveBeenLastCalledWith([a, b])
    expect(many.getByRole('button', { name: 'Many' }).textContent).toBe(
      'a.png, b.png'
    )
  })

  it('clears the files when it is clearable', () => {
    const onChange = jest.fn()
    const { getByRole, queryByRole, container } = draw(
      <FileInput aria-label="Upload" clearable onChange={onChange} />
    )
    expect(queryByRole('button', { name: 'Clear' })).toBeNull()
    pick(container, [a])
    fireEvent.click(getByRole('button', { name: 'Clear' }))
    expect(onChange).toHaveBeenLastCalledWith(null)
    expect(getByRole('button', { name: 'Upload' }).textContent).toBe(
      'Select a file'
    )
  })

  it('shows a controlled value and does not open when disabled', () => {
    const { getByRole } = draw(
      <FileInput aria-label="Upload" value={b} disabled />
    )
    const field = getByRole('button', { name: 'Upload' })
    expect(field.textContent).toBe('b.png')
    expect((field as HTMLButtonElement).disabled).toBe(true)
  })
})
