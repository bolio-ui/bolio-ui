import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import axe from 'axe-core'
import { BolioUIProvider, EmojiPicker } from '..'

const data = [
  {
    id: 'people',
    label: 'People',
    emojis: [
      { emoji: '😀', name: 'grinning face', keywords: ['smile', 'happy'] },
      { emoji: '😢', name: 'crying face', keywords: ['sad', 'tear'] },
      { emoji: '😎', name: 'cool face', keywords: ['sunglasses'] }
    ]
  },
  {
    id: 'nature',
    label: 'Nature',
    icon: '🌿',
    emojis: [
      { emoji: '🐶', name: 'dog' },
      { emoji: '🐱', name: 'cat' },
      { emoji: '🌳', name: 'tree', keywords: ['plant'] }
    ]
  }
]

const draw = (props: Partial<React.ComponentProps<typeof EmojiPicker>> = {}) =>
  render(
    <BolioUIProvider>
      <EmojiPicker data={data} columns={2} {...props} />
    </BolioUIProvider>
  )
const emoji = (name: string) => screen.getByRole('button', { name })

describe('<EmojiPicker />', () => {
  it('lists the emojis by category, named by what they are', () => {
    draw()
    expect(screen.getByRole('region', { name: 'People' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Nature' })).toBeInTheDocument()
    expect(emoji('grinning face')).toHaveTextContent('😀')
    expect(emoji('dog')).toHaveTextContent('🐶')
  })

  it('reports the emoji and its category when one is chosen', () => {
    const onEmojiSelect = jest.fn()
    draw({ onEmojiSelect })
    fireEvent.click(emoji('cat'))
    expect(onEmojiSelect).toHaveBeenCalledWith(data[1].emojis[1], data[1])
  })

  it('filters by name and by keyword, and brings the list back', () => {
    draw()
    const search = screen.getByRole('searchbox', { name: 'Search emoji' })
    fireEvent.change(search, { target: { value: 'sad' } })
    expect(
      screen.getAllByRole('button', { name: /face|dog|cat|tree/ })
    ).toHaveLength(1)
    expect(emoji('crying face')).toBeInTheDocument()
    expect(screen.queryByRole('region', { name: 'Nature' })).toBeNull()
    fireEvent.change(search, { target: { value: 'PLANT' } })
    expect(emoji('tree')).toBeInTheDocument()
    fireEvent.change(search, { target: { value: '' } })
    expect(emoji('dog')).toBeInTheDocument()
  })

  it('says so when nothing matches, and the text can change', () => {
    draw({ emptyContent: 'Nothing here' })
    fireEvent.change(screen.getByRole('searchbox'), {
      target: { value: 'zzz' }
    })
    expect(screen.getByRole('status')).toHaveTextContent('Nothing here')
  })

  it('chooses the first result with Enter in the search', () => {
    const onEmojiSelect = jest.fn()
    draw({ onEmojiSelect })
    const search = screen.getByRole('searchbox')
    fireEvent.change(search, { target: { value: 'cat' } })
    fireEvent.keyDown(search, { key: 'Enter' })
    expect(onEmojiSelect.mock.calls[0][0].name).toBe('cat')
  })

  it('moves from the search into the grid with ArrowDown', () => {
    draw()
    const search = screen.getByRole('searchbox')
    search.focus()
    fireEvent.keyDown(search, { key: 'ArrowDown' })
    expect(emoji('grinning face')).toHaveFocus()
  })

  it('has one tab stop in the grid', () => {
    draw()
    const stops = screen
      .getAllByRole('button')
      .filter(
        (b) =>
          b.getAttribute('tabindex') === '0' &&
          /face|dog|cat|tree/.test(b.getAttribute('aria-label') || '')
      )
    expect(stops).toHaveLength(1)
    expect(stops[0]).toHaveAccessibleName('grinning face')
  })

  it('walks the grid with the arrow keys, across rows and categories', () => {
    draw()
    emoji('grinning face').focus()
    const press = (key: string) =>
      fireEvent.keyDown(document.activeElement as Element, { key })
    press('ArrowRight')
    expect(emoji('crying face')).toHaveFocus()
    press('ArrowLeft')
    expect(emoji('grinning face')).toHaveFocus()
    // 2 columns: the second row of People is "cool face" alone
    press('ArrowDown')
    expect(emoji('cool face')).toHaveFocus()
    // there is no row below, so it goes to Nature, on the same column
    press('ArrowDown')
    expect(emoji('dog')).toHaveFocus()
    // and back up, to the last row of People on that column
    press('ArrowUp')
    expect(emoji('cool face')).toHaveFocus()
    press('ArrowRight')
    expect(emoji('dog')).toHaveFocus()
    press('ArrowLeft')
    expect(emoji('cool face')).toHaveFocus()
    press('End')
    expect(emoji('tree')).toHaveFocus()
    press('Home')
    expect(emoji('grinning face')).toHaveFocus()
  })

  it('keeps the column when it crosses into another category', () => {
    draw()
    emoji('crying face').focus()
    fireEvent.keyDown(document.activeElement as Element, { key: 'ArrowDown' })
    expect(emoji('cat')).toHaveFocus()
  })

  it('does not run past the ends', () => {
    draw()
    emoji('grinning face').focus()
    fireEvent.keyDown(document.activeElement as Element, { key: 'ArrowLeft' })
    fireEvent.keyDown(document.activeElement as Element, { key: 'ArrowUp' })
    expect(emoji('grinning face')).toHaveFocus()
  })

  it('shows the focused emoji in the preview, unless turned off', () => {
    const { container } = draw()
    fireEvent.focus(emoji('dog'))
    expect(container).toHaveTextContent('🐶dog')
    const off = draw({ withPreview: false }).container
    fireEvent.focus(within(off, 'cat'))
    expect(off).not.toHaveTextContent('🐱cat')
  })

  it('has a bar to jump to a category, with the icon or the first emoji', () => {
    draw()
    const bar = screen.getByRole('toolbar', { name: 'Categories' })
    expect(bar.querySelectorAll('button')).toHaveLength(2)
    expect(screen.getByRole('button', { name: 'People' })).toHaveTextContent(
      '😀'
    )
    expect(screen.getByRole('button', { name: 'Nature' })).toHaveTextContent(
      '🌿'
    )
    expect(() =>
      fireEvent.click(screen.getByRole('button', { name: 'Nature' }))
    ).not.toThrow()
  })

  it('can leave out the search, the bar and the preview', () => {
    draw({ withSearch: false, withCategoryNav: false, withPreview: false })
    expect(screen.queryByRole('searchbox')).toBeNull()
    expect(screen.queryByRole('toolbar')).toBeNull()
  })

  it('does not break with no data', () => {
    expect(() => draw({ data: [] })).not.toThrow()
    expect(screen.getByRole('status')).toHaveTextContent('No emoji found')
  })

  it('has no accessibility violations', async () => {
    const { container } = draw()
    const result = await axe.run(container, {
      rules: {
        region: { enabled: false },
        'color-contrast': { enabled: false }
      }
    })
    expect(result.violations.map((v) => v.id)).toEqual([])
  })
})

function within(container: HTMLElement, name: string) {
  return container.querySelector(`[aria-label="${name}"]`) as HTMLElement
}
