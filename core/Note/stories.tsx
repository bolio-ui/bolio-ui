import type { StoryFn, Meta } from '@storybook/react-vite'
import Note from '.'
import Grid from '../Grid'

export default {
  title: 'Feedback/Note',
  component: Note
} as Meta

export const Default: StoryFn = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Note>Check payment pending.</Note>
    </Grid>
  </Grid.Container>
)

export const Types: StoryFn = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Note>Check payment pending.</Note>
    </Grid>
    <Grid>
      <Note type="primary">Check payment pending.</Note>
    </Grid>
    <Grid>
      <Note type="secondary">Check payment pending.</Note>
    </Grid>
    <Grid>
      <Note type="success">Check payment pending.</Note>
    </Grid>
    <Grid>
      <Note type="warning">Check payment pending.</Note>
    </Grid>
    <Grid>
      <Note type="error">Check payment pending.</Note>
    </Grid>
    <Grid>
      <Note type="info">Check payment pending.</Note>
    </Grid>
  </Grid.Container>
)

export const HiddenLabel: StoryFn = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Note label={false}>Demo note!</Note>
    </Grid>
  </Grid.Container>
)

export const CustomLabel: StoryFn = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Note label="custom">Customize a note.</Note>
    </Grid>
  </Grid.Container>
)

export const FilledVariant: StoryFn = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Note label="custom" filled>
        Customize a note.
      </Note>
    </Grid>
    <Grid>
      <Note label={false} filled>
        Demo note!
      </Note>
    </Grid>
    <Grid>
      <Note type="success" label="success" filled>
        Check payment pending.
      </Note>
    </Grid>
    <Grid>
      <Note type="warning" label="warning" filled>
        Check payment pending.
      </Note>
    </Grid>
    <Grid>
      <Note type="error" label="error" filled>
        Check payment pending.
      </Note>
    </Grid>
    <Grid>
      <Note type="secondary" filled>
        Check payment pending.
      </Note>
    </Grid>
  </Grid.Container>
)
