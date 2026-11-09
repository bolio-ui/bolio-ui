import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { BolioUIProvider, Diff } from '..'
import { diffInline, diffLines } from '../Diff/diff-lines'

const draw = (props: Partial<React.ComponentProps<typeof Diff>> = {}) =>
  render(
    <BolioUIProvider>
      <Diff previousValue={'a\nb\nc'} currentValue={'a\nB\nc'} {...props} />
    </BolioUIProvider>
  ).container

describe('diffLines', () => {
  it('keeps equal lines, and numbers each side', () => {
    const lines = diffLines('a\nb\nc', 'a\nB\nc')
    expect(lines.map((l) => [l.kind, l.text])).toEqual([
      ['equal', 'a'],
      ['remove', 'b'],
      ['add', 'B'],
      ['equal', 'c']
    ])
    expect(lines[0]).toMatchObject({ oldNo: 1, newNo: 1 })
    expect(lines[1]).toMatchObject({ oldNo: 2 })
    expect(lines[2]).toMatchObject({ newNo: 2 })
    expect(lines[3]).toMatchObject({ oldNo: 3, newNo: 3 })
  })

  it('finds an inserted and a deleted line', () => {
    expect(diffLines('a\nc', 'a\nb\nc').map((l) => l.kind)).toEqual([
      'equal',
      'add',
      'equal'
    ])
    expect(diffLines('a\nb\nc', 'a\nc').map((l) => l.kind)).toEqual([
      'equal',
      'remove',
      'equal'
    ])
  })

  it('handles empty sides', () => {
    expect(diffLines('', 'x\ny').map((l) => l.kind)).toEqual(['add', 'add'])
    expect(diffLines('x\ny', '').map((l) => l.kind)).toEqual([
      'remove',
      'remove'
    ])
    expect(diffLines('', '')).toEqual([])
  })

  it('reports no change for equal texts', () => {
    expect(diffLines('a\nb', 'a\nb').every((l) => l.kind === 'equal')).toBe(
      true
    )
  })
})

describe('diffInline', () => {
  it('marks the words that changed', () => {
    const [left, right] = diffInline('the quick fox', 'the slow fox', 'words')
    expect(left.filter((s) => s.changed).map((s) => s.text)).toEqual(['quick'])
    expect(right.filter((s) => s.changed).map((s) => s.text)).toEqual(['slow'])
  })

  it('marks single characters', () => {
    const [left, right] = diffInline('cat', 'cut', 'chars')
    expect(left.filter((s) => s.changed).map((s) => s.text)).toEqual(['a'])
    expect(right.filter((s) => s.changed).map((s) => s.text)).toEqual(['u'])
  })

  it('marks nothing for the lines method', () => {
    const [left, right] = diffInline('a', 'b', 'lines')
    expect([...left, ...right].some((s) => s.changed)).toBe(false)
  })
})

describe('<Diff />', () => {
  it('writes a mark and the text of every line', () => {
    const container = draw()
    const rows = Array.from(container.querySelectorAll('tr')).map(
      (tr) => tr.textContent
    )
    expect(rows).toHaveLength(4)
    expect(rows[1]).toMatch(/-b/)
    expect(rows[2]).toMatch(/\+B/)
  })

  it('shows the line numbers of both sides, unless turned off', () => {
    const first = draw().querySelectorAll('tr')[1]
    // removed line: old number 2, no new number
    expect(
      Array.from(first.querySelectorAll('td'))
        .slice(0, 2)
        .map((td) => td.textContent)
    ).toEqual(['2', ''])
    expect(
      draw({ withLineNumbers: false })
        .querySelectorAll('tr')[1]
        .querySelectorAll('td')
    ).toHaveLength(1)
  })

  it('highlights the words that changed inside paired lines', () => {
    const container = draw({
      previousValue: 'the quick fox',
      currentValue: 'the slow fox'
    })
    expect(
      Array.from(container.querySelectorAll('mark')).map((m) => m.textContent)
    ).toEqual(['quick', 'slow'])
  })

  it('does not highlight inside lines with the lines method', () => {
    expect(
      draw({
        previousValue: 'the quick fox',
        currentValue: 'the slow fox',
        diffMethod: 'lines'
      }).querySelectorAll('mark')
    ).toHaveLength(0)
  })

  it('puts the previous and the current side by side in split mode', () => {
    const container = draw({ mode: 'split' })
    const rows = container.querySelectorAll('tr')
    expect(rows).toHaveLength(3)
    const changed = rows[1].querySelectorAll('td')
    expect(changed).toHaveLength(4)
    expect(changed[1].textContent).toMatch(/-b/)
    expect(changed[3].textContent).toMatch(/\+B/)
  })

  it('leaves the empty side of a split row blank', () => {
    const container = draw({
      mode: 'split',
      previousValue: 'a',
      currentValue: 'a\nb'
    })
    const last = container.querySelectorAll('tr')[1].querySelectorAll('td')
    expect(last[1].textContent).toBe('')
    expect(last[3].textContent).toMatch(/\+b/)
  })

  it('folds the unchanged lines beyond the context and expands them', () => {
    const before = Array.from({ length: 20 }, (_, i) => `line ${i}`).join('\n')
    const after = before.replace('line 10', 'changed')
    draw({ previousValue: before, currentValue: after, contextLines: 2 })
    const buttons = screen.getAllByRole('button')
    expect(buttons.map((b) => b.textContent)).toEqual([
      'Show 8 hidden lines',
      'Show 7 hidden lines'
    ])
    expect(screen.queryByText(/line 0/)).toBeNull()
    fireEvent.click(buttons[0])
    expect(screen.getByText(/line 0/)).toBeInTheDocument()
    expect(screen.getAllByRole('button')).toHaveLength(1)
  })

  it('says "line" for a single hidden line, and uses expandLabel', () => {
    const before = ['a', 'b', 'c', 'd', 'e'].join('\n')
    draw({
      previousValue: before,
      currentValue: before.replace('e', 'E'),
      contextLines: 1
    })
    expect(screen.getByRole('button')).toHaveTextContent('Show 3 hidden lines')
    draw({
      previousValue: 'a\nb\nc',
      currentValue: 'a\nb\nC',
      contextLines: 1,
      expandLabel: (n) => `${n} más`
    })
    expect(screen.getByText('1 más')).toBeInTheDocument()
  })

  it('shows every line when the context is not limited', () => {
    expect(
      draw({
        previousValue: 'a\nb\nc\nd\ne',
        currentValue: 'a\nb\nc\nd\nE'
      }).querySelectorAll('button')
    ).toHaveLength(0)
  })

  it('takes the colors it is given', () => {
    const root = draw({ addColor: '#2563eb', removeColor: '#f59e0b' })
      .firstElementChild as HTMLElement
    expect(root.style.getPropertyValue('--diff-add-color')).toBe('#2563eb')
    expect(root.style.getPropertyValue('--diff-remove-color')).toBe('#f59e0b')
  })

  it('forwards the ref', () => {
    const ref = React.createRef<HTMLDivElement>()
    render(
      <BolioUIProvider>
        <Diff ref={ref} previousValue="a" currentValue="b" />
      </BolioUIProvider>
    )
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })
})
