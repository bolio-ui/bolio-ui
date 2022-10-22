import { Story, Meta } from '@storybook/react'
import Tag from '.'
import Grid from '../grid'

export default {
  title: 'Data Display/Tag',
  component: Tag
} as Meta

export const Default: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Tag>Status: Unstable</Tag>
    </Grid>
  </Grid.Container>
)

export const Types: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Tag>Default</Tag>
    </Grid>
    <Grid>
      <Tag type="primary">Primary</Tag>
    </Grid>
    <Grid>
      <Tag type="secondary">Secondary</Tag>
    </Grid>
    <Grid>
      <Tag type="success">Success</Tag>
    </Grid>
    <Grid>
      <Tag type="warning">Warning</Tag>
    </Grid>
    <Grid>
      <Tag type="error">Error</Tag>
    </Grid>
    <Grid>
      <Tag type="dark">Dark</Tag>
    </Grid>
    <Grid>
      <Tag type="lite">Lite</Tag>
    </Grid>
  </Grid.Container>
)

export const TypesInvert: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Tag invert>Default</Tag>
    </Grid>
    <Grid>
      <Tag type="primary" invert>
        Primary
      </Tag>
    </Grid>
    <Grid>
      <Tag type="secondary" invert>
        Secondary
      </Tag>
    </Grid>
    <Grid>
      <Tag type="success" invert>
        Success
      </Tag>
    </Grid>
    <Grid>
      <Tag type="warning" invert>
        Warning
      </Tag>
    </Grid>
    <Grid>
      <Tag type="error" invert>
        Error
      </Tag>
    </Grid>
    <Grid>
      <Tag type="dark" invert>
        Dark
      </Tag>
    </Grid>
    <Grid>
      <Tag type="lite" invert>
        Lite
      </Tag>
    </Grid>
  </Grid.Container>
)
