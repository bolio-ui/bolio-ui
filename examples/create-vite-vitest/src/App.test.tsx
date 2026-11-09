import { screen, waitFor, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App.tsx'
import { renderWithBolio } from './test/render.tsx'

describe('<App />', () => {
  it('shows the form', () => {
    renderWithBolio(<App />)
    expect(
      screen.getByRole('heading', { name: 'Newsletter' })
    ).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
  })

  it('asks for a valid email before it goes on', async () => {
    const { user } = renderWithBolio(<App />)
    await user.type(screen.getByLabelText('Email'), 'nope')
    await user.click(screen.getByRole('button', { name: 'Subscribe' }))

    expect(screen.getByLabelText('Email')).toBeInvalid()
    expect(
      screen.getByText('Enter an email like name@example.com')
    ).toBeInTheDocument()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('confirms in a modal and then shows a toast', async () => {
    const { user } = renderWithBolio(<App />)
    await user.type(screen.getByLabelText('Email'), 'ada@example.com')
    await user.click(screen.getByRole('button', { name: 'Subscribe' }))

    // the Modal is rendered in a portal, so query the whole screen
    const dialog = await screen.findByRole('dialog', {
      name: 'Confirm subscription'
    })
    expect(dialog).toHaveTextContent('ada@example.com')

    await user.click(within(dialog).getByRole('button', { name: 'Confirm' }))

    expect(await screen.findByText('Subscribed')).toBeInTheDocument()
    // the Modal fades out before it leaves the page, so wait for it
    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    )
  })

  it('closes the modal without subscribing', async () => {
    const { user } = renderWithBolio(<App />)
    await user.type(screen.getByLabelText('Email'), 'ada@example.com')
    await user.click(screen.getByRole('button', { name: 'Subscribe' }))

    const dialog = await screen.findByRole('dialog')
    await user.click(within(dialog).getByRole('button', { name: 'Cancel' }))

    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    )
    expect(screen.queryByText('Subscribed')).not.toBeInTheDocument()
  })
})
