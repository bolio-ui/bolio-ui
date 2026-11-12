import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { BolioUIProvider, NavLink } from '..'

const draw = (node: React.ReactElement) =>
  render(<BolioUIProvider>{node}</BolioUIProvider>)

describe('<NavLink />', () => {
  it('is a link when it has an href, and marks the current page', () => {
    draw(<NavLink label="Reports" href="/reports" active />)
    const link = screen.getByRole('link', { name: 'Reports' })
    expect(link).toHaveAttribute('href', '/reports')
    expect(link).toHaveAttribute('aria-current', 'page')
  })

  it('is a button without an href, and calls onClick', () => {
    const onClick = jest.fn()
    draw(<NavLink label="Logout" onClick={onClick} />)
    fireEvent.click(screen.getByRole('button', { name: 'Logout' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('shows the description and the icon next to the label', () => {
    draw(
      <NavLink
        label="Reports"
        description="Monthly and yearly"
        icon={<svg data-testid="icon" />}
        href="#"
      />
    )
    expect(screen.getByText('Monthly and yearly')).toBeInTheDocument()
    expect(screen.getByTestId('icon')).toBeInTheDocument()
  })

  it('opens and closes the items of a parent', () => {
    const onOpenedChange = jest.fn()
    draw(
      <NavLink label="Settings" onOpenedChange={onOpenedChange}>
        <NavLink label="Profile" href="#" />
      </NavLink>
    )
    const parent = screen.getByRole('button', { name: 'Settings' })
    expect(parent).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('link', { name: 'Profile' })).toBeNull()
    fireEvent.click(parent)
    expect(parent).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('link', { name: 'Profile' })).toBeInTheDocument()
    expect(onOpenedChange).toHaveBeenLastCalledWith(true)
    fireEvent.click(parent)
    expect(screen.queryByRole('link', { name: 'Profile' })).toBeNull()
  })

  it('starts open with defaultOpened, and a parent with an href stays a button', () => {
    draw(
      <NavLink label="Settings" href="/settings" defaultOpened>
        <NavLink label="Profile" href="#" />
      </NavLink>
    )
    expect(screen.getByRole('button', { name: 'Settings' })).toHaveAttribute(
      'aria-expanded',
      'true'
    )
    expect(screen.getByRole('link', { name: 'Profile' })).toBeInTheDocument()
  })

  it('does not act when disabled', () => {
    const onClick = jest.fn()
    draw(<NavLink label="Archived" disabled onClick={onClick} />)
    fireEvent.click(screen.getByRole('button', { name: 'Archived' }))
    expect(onClick).not.toHaveBeenCalled()
  })

  it('takes a link out of the page flow when disabled', () => {
    draw(<NavLink label="Archived" href="/a" disabled />)
    const link = screen.getByText('Archived').closest('a') as HTMLElement
    expect(link).not.toHaveAttribute('href')
    expect(link).toHaveAttribute('aria-disabled', 'true')
  })
})
