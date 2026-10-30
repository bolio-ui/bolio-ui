import Stepper from '.'

export default function Example() {
  return (
    <Stepper active={1} aria-label="Checkout">
      <Stepper.Step label="Cart" description="Review the items" />
      <Stepper.Step label="Shipping" description="Where to deliver" />
      <Stepper.Step label="Payment" description="Card or invoice" />
    </Stepper>
  )
}
