import React from 'react'
import { render, screen, fireEvent, within } from '@testing-library/react'
import axe from 'axe-core'
import { BolioUIProvider, Stepper } from '..'

const setup = (props: Partial<React.ComponentProps<typeof Stepper>> = {}) =>
  render(
    <BolioUIProvider>
      <Stepper active={1} aria-label="Checkout" {...props}>
        <Stepper.Step label="Cart" description="Review the items" />
        <Stepper.Step label="Shipping" />
        <Stepper.Step label="Payment" error />
        <Stepper.Step label="Done" disabled />
      </Stepper>
    </BolioUIProvider>
  )

describe('<Stepper />', () => {
  it('is a named ordered list with one item per step', () => {
    setup()
    const list = screen.getByRole('list', { name: 'Checkout' })
    expect(list.tagName).toBe('OL')
    expect(within(list).getAllByRole('listitem')).toHaveLength(4)
  })

  it('marks the completed, current, upcoming and error steps', () => {
    setup()
    const [cart, shipping, payment, done] = screen.getAllByRole('listitem')
    expect(cart).toHaveClass('completed')
    expect(cart).toHaveTextContent('Completed')
    expect(shipping).toHaveClass('current')
    expect(shipping).toHaveAttribute('aria-current', 'step')
    expect(cart).not.toHaveAttribute('aria-current')
    expect(payment).toHaveClass('upcoming', 'error')
    expect(payment).toHaveTextContent('Error')
    expect(done).toHaveClass('upcoming', 'last')
    // numbers only for the steps that are not completed or in error
    expect(shipping.querySelector('.indicator')).toHaveTextContent('2')
    expect(payment.querySelector('.indicator')).toHaveTextContent('!')
    expect(cart.querySelector('.indicator svg')).toBeInTheDocument()
  })

  it('draws a connector between steps, not after the last one', () => {
    const { container } = setup()
    expect(container.querySelectorAll('.connector')).toHaveLength(3)
  })

  it('renders plain steps when they cannot be clicked', () => {
    setup()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('turns the steps into buttons with onStepClick', () => {
    const onStepClick = jest.fn()
    setup({ onStepClick })
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(4)
    fireEvent.click(screen.getByRole('button', { name: /Cart/ }))
    expect(onStepClick).toHaveBeenCalledWith(0)
    expect(screen.getByRole('button', { name: /Done/ })).toBeDisabled()
  })

  it('lays out vertically', () => {
    setup({ orientation: 'vertical' })
    expect(screen.getByRole('list')).toHaveClass('vertical')
    screen
      .getAllByRole('listitem')
      .forEach((step) => expect(step).toHaveClass('vertical'))
  })

  it('has no axe violations, with clickable steps', async () => {
    const { container } = setup({ onStepClick: () => undefined })
    const result = await axe.run(container, {
      rules: { 'color-contrast': { enabled: false } }
    })
    expect(result.violations.map((v) => `${v.id}: ${v.help}`)).toEqual([])
  })
})
