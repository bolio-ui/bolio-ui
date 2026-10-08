import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Alert } from '..'

describe('<Alert />', () => {
  it('shows the title and the text', () => {
    render(<Alert title="Heads up">Trial ends soon</Alert>)
    expect(screen.getByRole('status')).toHaveTextContent(
      'Heads upTrial ends soon'
    )
  })

  it.each([
    ['error', 'alert'],
    ['warning', 'alert'],
    ['success', 'status'],
    ['info', 'status'],
    ['default', 'status']
  ] as const)('a %s alert has the role %s', (type, role) => {
    render(<Alert type={type}>Message</Alert>)
    expect(screen.getByRole(role)).toBeInTheDocument()
  })

  it('lets the role be replaced', () => {
    render(
      <Alert type="error" role="note">
        Message
      </Alert>
    )
    expect(screen.getByRole('note')).toBeInTheDocument()
  })

  it('has no close button without onClose', () => {
    render(<Alert>Message</Alert>)
    expect(screen.queryByRole('button')).toBeNull()
  })

  it('closes through a named button', () => {
    const onClose = jest.fn()
    render(
      <Alert onClose={onClose} closeLabel="Dismiss">
        Message
      </Alert>
    )
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss' }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('hides the icon from a screen reader', () => {
    const { container } = render(
      <Alert icon={<i data-testid="icon" />}>Message</Alert>
    )
    expect(container.querySelector('[aria-hidden="true"]')).toContainElement(
      screen.getByTestId('icon')
    )
  })

  it('keeps a custom style', () => {
    render(<Alert style={{ marginTop: 7 }}>Message</Alert>)
    expect(screen.getByRole('status').style.marginTop).toBe('7px')
  })
})
