import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import axe from 'axe-core'
import { BolioUIProvider, Dropzone } from '..'

const createObjectURL = jest.fn((file: File) => `blob:${file.name}`)
const revokeObjectURL = jest.fn()
beforeAll(() => {
  Object.assign(URL, { createObjectURL, revokeObjectURL })
})
beforeEach(() => {
  createObjectURL.mockClear()
  revokeObjectURL.mockClear()
})

type Props = React.ComponentProps<typeof Dropzone>

const setup = (props: Partial<Props> = {}) =>
  render(
    <BolioUIProvider>
      <Dropzone {...props}>Drop files</Dropzone>
    </BolioUIProvider>
  )

const file = (name: string, type: string, size = 10) =>
  new File([new Uint8Array(size)], name, { type })
const zone = () =>
  screen.getByText('Drop files').closest('label') as HTMLElement
const input = () => zone().querySelector('input') as HTMLInputElement
const drop = (...files: File[]) =>
  fireEvent.drop(zone(), { dataTransfer: { files } })

describe('<Dropzone />', () => {
  it('is a file input named by its content', () => {
    setup()
    expect(input()).toHaveAttribute('type', 'file')
    expect(input()).toHaveAccessibleName('Drop files')
  })

  it('passes the dropped files to onDrop', () => {
    const onDrop = jest.fn()
    setup({ onDrop, multiple: true })
    const a = file('a.txt', 'text/plain')
    const b = file('b.txt', 'text/plain')
    drop(a, b)
    expect(onDrop).toHaveBeenCalledWith([a, b], [])
  })

  it('does the same for the files chosen in the picker, and resets it', () => {
    const onDrop = jest.fn()
    setup({ onDrop })
    const a = file('a.txt', 'text/plain')
    fireEvent.change(input(), { target: { files: [a] } })
    expect(onDrop).toHaveBeenCalledWith([a], [])
    expect(input().value).toBe('')
  })

  it('rejects by type with extensions, wildcards and exact types', () => {
    const onDrop = jest.fn()
    setup({ onDrop, multiple: true, accept: '.pdf, image/*, text/csv' })
    const pdf = file('Doc.PDF', '')
    const png = file('a.png', 'image/png')
    const csv = file('a.csv', 'text/csv')
    const zip = file('a.zip', 'application/zip')
    drop(pdf, png, csv, zip)
    expect(onDrop).toHaveBeenCalledWith(
      [pdf, png, csv],
      [{ file: zip, reason: 'file-type' }]
    )
  })

  it('rejects files over maxSize', () => {
    const onDrop = jest.fn()
    setup({ onDrop, maxSize: 100 })
    const big = file('big.txt', 'text/plain', 101)
    drop(big)
    expect(onDrop).toHaveBeenCalledWith(
      [],
      [{ file: big, reason: 'file-too-large' }]
    )
  })

  it('takes one file without multiple, and maxFiles with it', () => {
    const onDrop = jest.fn()
    const { unmount } = setup({ onDrop })
    const [a, b] = [file('a.txt', 'text/plain'), file('b.txt', 'text/plain')]
    drop(a, b)
    expect(onDrop).toHaveBeenLastCalledWith(
      [a],
      [{ file: b, reason: 'too-many-files' }]
    )
    unmount()
    setup({ onDrop, multiple: true, maxFiles: 2 })
    const [c, d, e] = ['c', 'd', 'e'].map((n) => file(n + '.txt', 'text/plain'))
    drop(c, d, e)
    expect(onDrop).toHaveBeenLastCalledWith(
      [c, d],
      [{ file: e, reason: 'too-many-files' }]
    )
  })

  it('highlights while a file is dragged over and clears on drop', () => {
    setup()
    fireEvent.dragEnter(zone())
    expect(zone()).toHaveClass('dragging')
    fireEvent.dragLeave(zone())
    expect(zone()).not.toHaveClass('dragging')
    fireEvent.dragOver(zone())
    fireEvent.drop(zone(), { dataTransfer: { files: [] } })
    expect(zone()).not.toHaveClass('dragging')
  })

  it('ignores drops when disabled', () => {
    const onDrop = jest.fn()
    setup({ onDrop, disabled: true })
    expect(input()).toBeDisabled()
    drop(file('a.txt', 'text/plain'))
    expect(onDrop).not.toHaveBeenCalled()
  })

  it('has no accessibility violations', async () => {
    const { container } = setup()
    const results = await axe.run(container, {
      rules: { region: { enabled: false } }
    })
    expect(results.violations).toEqual([])
  })
})

describe('<Dropzone thumbnails />', () => {
  const png = () => file('photo.png', 'image/png')
  const pdf = () => file('contract.pdf', 'application/pdf')
  const items = () => screen.getAllByRole('listitem')

  it('shows nothing until a file is accepted', () => {
    setup({ thumbnails: true })
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
  })

  it('previews an image and names its format', () => {
    setup({ thumbnails: true })
    drop(png())
    const [item] = items()
    expect(item.querySelector('img')).toHaveAttribute('src', 'blob:photo.png')
    expect(item).toHaveTextContent('PNG')
    expect(item).toHaveTextContent('photo.png')
  })

  it('gives the formats that cannot be previewed an icon and their format', () => {
    setup({ thumbnails: true })
    drop(pdf())
    const [item] = items()
    expect(item.querySelector('img')).toBeNull()
    expect(item.querySelector('svg')).toBeInTheDocument()
    expect(item).toHaveTextContent('PDF')
    expect(createObjectURL).not.toHaveBeenCalled()
  })

  it('takes the format from the type when the name has no extension', () => {
    setup({ thumbnails: true })
    drop(file('README', 'text/markdown'))
    expect(items()[0]).toHaveTextContent('MARK')
  })

  it('adds the next files with multiple, and replaces the file without it', () => {
    const { unmount } = setup({ thumbnails: true, multiple: true })
    drop(png())
    drop(pdf())
    expect(items()).toHaveLength(2)
    unmount()
    setup({ thumbnails: true })
    drop(png())
    drop(pdf())
    expect(items()).toHaveLength(1)
    expect(items()[0]).toHaveTextContent('contract.pdf')
  })

  it('counts the files already there against maxFiles', () => {
    const onDrop = jest.fn()
    setup({ thumbnails: true, multiple: true, maxFiles: 2, onDrop })
    drop(png())
    const extra = [file('b.png', 'image/png'), file('c.png', 'image/png')]
    drop(...extra)
    expect(items()).toHaveLength(2)
    expect(onDrop).toHaveBeenLastCalledWith(
      [extra[0]],
      [{ file: extra[1], reason: 'too-many-files' }]
    )
  })

  it('removes a file with its button, which is named after it', () => {
    const onChange = jest.fn()
    setup({ thumbnails: true, multiple: true, onChange })
    const a = png()
    drop(a, pdf())
    fireEvent.click(screen.getByRole('button', { name: 'Remove photo.png' }))
    expect(items()).toHaveLength(1)
    expect(onChange).toHaveBeenLastCalledWith([
      expect.objectContaining({ name: 'contract.pdf' })
    ])
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:photo.png')
  })

  it('follows value when controlled and only reports the change', () => {
    const onChange = jest.fn()
    setup({ thumbnails: true, value: [pdf()], onChange })
    const dropped = png()
    drop(dropped)
    expect(onChange).toHaveBeenCalledWith([dropped])
    expect(items()).toHaveLength(1)
    expect(items()[0]).toHaveTextContent('contract.pdf')
  })

  it('locks the remove buttons when disabled', () => {
    setup({ thumbnails: true, value: [pdf()], disabled: true })
    expect(
      screen.getByRole('button', { name: 'Remove contract.pdf' })
    ).toBeDisabled()
  })

  it('has no accessibility violations with files shown', async () => {
    const { container } = setup({ thumbnails: true, value: [png(), pdf()] })
    const results = await axe.run(container, {
      rules: { region: { enabled: false } }
    })
    expect(results.violations).toEqual([])
  })
})
