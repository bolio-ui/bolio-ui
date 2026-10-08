import React, { useState } from 'react'
import type { StoryFn, Meta } from '@storybook/react-vite'
import Alert from '.'
import Grid from '../Grid'

export default {
  title: 'Feedback/Alert',
  component: Alert
} as Meta

export const Default: StoryFn = () => (
  <Alert title="Heads up">Your trial ends in 3 days.</Alert>
)

export const Types: StoryFn = () => (
  <Grid.Container gap={2} direction="column">
    {(['default', 'success', 'warning', 'error', 'info'] as const).map(
      (type) => (
        <Grid key={type}>
          <Alert type={type} title={type}>
            Your trial ends in 3 days.
          </Alert>
        </Grid>
      )
    )}
  </Grid.Container>
)

export const Dismissible: StoryFn = () => {
  const [open, setOpen] = useState(true)
  return open ? (
    <Alert type="info" title="New version" onClose={() => setOpen(false)}>
      Reload the page to get it.
    </Alert>
  ) : null
}
