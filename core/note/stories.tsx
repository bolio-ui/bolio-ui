import { Story, Meta } from '@storybook/react'
import Note from '.'

export default {
  title: 'Feedback/Note',
  component: Note
} as Meta

export const Default: Story = () => <Note>Check payment pending.</Note>

export const Secondary: Story = () => (
  <Note type="secondary">Check payment pending.</Note>
)

export const Status: Story = () => (
  <>
    <Note type="success">Check payment pending.</Note>
    <br />
    <Note type="warning">Check payment pending.</Note>
    <br />
    <Note type="error">Check payment pending.</Note>
  </>
)

export const HiddenLabel: Story = () => <Note label={false}>Demo note!</Note>

export const CustomLabel: Story = () => (
  <Note label="custom">Customize a note.</Note>
)

export const FilledVariant: Story = () => (
  <>
    <Note label="custom" filled>
      Customize a note.
    </Note>
    <br />
    <Note label={false} filled>
      Demo note!
    </Note>
    <br />
    <Note type="success" label="success" filled>
      Check payment pending.
    </Note>
    <br />
    <Note type="warning" label="warning" filled>
      Check payment pending.
    </Note>
    <br />
    <Note type="error" label="error" filled>
      Check payment pending.
    </Note>
    <br />
    <Note type="secondary" filled>
      Check payment pending.
    </Note>
  </>
)
