import React, { useState } from 'react'
import type { StoryFn, Meta } from '@storybook/react-vite'
import Stepper from '.'
import Button from '../Button'
import Grid from '../Grid'

export default {
  title: 'Navigation/Stepper',
  component: Stepper
} as Meta

export const Default: StoryFn = () => (
  <Stepper active={1} aria-label="Checkout">
    <Stepper.Step label="Cart" description="Review the items" />
    <Stepper.Step label="Shipping" description="Where to deliver" />
    <Stepper.Step label="Payment" description="Card or invoice" />
  </Stepper>
)

export const Clickable: StoryFn = () => {
  const [active, setActive] = useState(0)
  return (
    <Grid.Container gap={2} direction="column">
      <Grid>
        <Stepper active={active} onStepClick={setActive} aria-label="Signup">
          <Stepper.Step label="Account" />
          <Stepper.Step label="Profile" />
          <Stepper.Step label="Confirm" />
        </Stepper>
      </Grid>
      <Grid>
        <Button
          auto
          scale={0.75}
          disabled={active === 0}
          onClick={() => setActive(active - 1)}
        >
          Back
        </Button>{' '}
        <Button
          auto
          scale={0.75}
          type="secondary"
          disabled={active === 3}
          onClick={() => setActive(active + 1)}
        >
          Next
        </Button>
      </Grid>
    </Grid.Container>
  )
}

export const ErrorAndVertical: StoryFn = () => (
  <Stepper active={2} orientation="vertical" aria-label="Deploy">
    <Stepper.Step label="Build" description="2m 14s" />
    <Stepper.Step label="Test" description="3 failed" error />
    <Stepper.Step label="Release" />
  </Stepper>
)
