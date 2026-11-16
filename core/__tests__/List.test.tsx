import React from 'react'
import { render, screen } from '@testing-library/react'
import { BolioUIProvider, List } from '..'

const wrap = (ui: React.ReactElement) =>
  render(<BolioUIProvider>{ui}</BolioUIProvider>)

describe('List', () => {
  it('renders a bulleted list by default', () => {
    wrap(
      <List>
        <List.Item>One</List.Item>
        <List.Item>Two</List.Item>
      </List>
    )
    const list = screen.getByRole('list')
    expect(list.tagName).toBe('UL')
    expect(list).toHaveStyle({ listStyleType: 'disc' })
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
  })

  it('numbers the items when ordered', () => {
    wrap(
      <List type="ordered">
        <List.Item>One</List.Item>
      </List>
    )
    const list = screen.getByRole('list')
    expect(list.tagName).toBe('OL')
    expect(list).toHaveStyle({ listStyleType: 'decimal' })
  })

  it('replaces the marker with the icon and hides it from screen readers', () => {
    wrap(
      <List icon={<i data-testid="icon" />}>
        <List.Item>One</List.Item>
        <List.Item icon={<b data-testid="own" />}>Two</List.Item>
      </List>
    )
    expect(screen.getByRole('list')).toHaveStyle({ listStyleType: 'none' })
    expect(screen.getByTestId('icon').parentElement).toHaveAttribute(
      'aria-hidden',
      'true'
    )
    expect(screen.getByTestId('own')).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
  })
})
