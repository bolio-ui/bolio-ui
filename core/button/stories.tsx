import { Story, Meta } from '@storybook/react'
import Button from '.'
import Grid from '../grid'
import { Zap, ZapOff, AlertCircle, XSquare } from '@bolio-ui/icons'

export default {
  title: 'General/Button',
  component: Button
} as Meta

export const Default: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Button>Button</Button>
    </Grid>
  </Grid.Container>
)

export const Loading: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Button loading>Button</Button>
    </Grid>
    <Grid>
      <Button loading scale={0.75}>
        Button
      </Button>
    </Grid>
    <Grid>
      <Button loading auto type="success" scale={2 / 3}>
        Button
      </Button>
    </Grid>
  </Grid.Container>
)

export const Disabled: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Button disabled>Button</Button>
    </Grid>
  </Grid.Container>
)

export const Shadow: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Button shadow type="secondary">
        Button Shadow
      </Button>
    </Grid>
  </Grid.Container>
)

export const Types: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Button auto type="secondary">
        Secondary
      </Button>
    </Grid>
    <Grid>
      <Button auto type="info">
        Info
      </Button>
    </Grid>
    <Grid>
      <Button auto type="success">
        Success
      </Button>
    </Grid>
    <Grid>
      <Button auto type="warning">
        Warning
      </Button>
    </Grid>
    <Grid>
      <Button auto type="error">
        Error
      </Button>
    </Grid>
    <Grid>
      <Button auto type="abort">
        Abort
      </Button>
    </Grid>
    <Grid>
      <Button auto type="secondary-light">
        Secondary Light
      </Button>
    </Grid>
    <Grid>
      <Button auto type="info-light">
        Info Light
      </Button>
    </Grid>
    <Grid>
      <Button auto type="success-light">
        Success Light
      </Button>
    </Grid>
    <Grid>
      <Button auto type="warning-light">
        Warning Light
      </Button>
    </Grid>
    <Grid>
      <Button auto type="error-light">
        Error Light
      </Button>
    </Grid>
  </Grid.Container>
)

export const Ghost: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Button type="secondary" ghost auto scale={0.7}>
        Secondary
      </Button>
    </Grid>
    <Grid>
      <Button type="success" ghost auto scale={0.7}>
        Success
      </Button>
    </Grid>
    <Grid>
      <Button type="warning" ghost auto scale={0.7}>
        Warning
      </Button>
    </Grid>
    <Grid>
      <Button type="error" ghost auto scale={0.7}>
        Error
      </Button>
    </Grid>
  </Grid.Container>
)

export const Scale: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Button auto scale={0.25}>
        0.25
      </Button>
    </Grid>
    <Grid>
      <Button auto scale={0.35}>
        0.35
      </Button>
    </Grid>
    <Grid>
      <Button auto scale={1 / 2}>
        1 / 2
      </Button>
    </Grid>
    <Grid>
      <Button auto scale={0.75}>
        0.75
      </Button>
    </Grid>
    <Grid>
      <Button auto padding={0}>
        NoPadding
      </Button>
    </Grid>
    <Grid>
      <Button auto font={0.25}>
        Small Font
      </Button>
    </Grid>
    <Grid>
      <Button auto pl={0} ml="25px">
        Offset
      </Button>
    </Grid>
    <Grid xs={12}>
      <Button width="100%">Full Width</Button>
    </Grid>
    <Grid xs={12}>
      <Button auto width="30%" mx="5px">
        proportion
      </Button>
      <Button auto width="30%" mx="5px">
        proportion
      </Button>
      <Button auto width="30%" mx="5px">
        proportion
      </Button>
    </Grid>
  </Grid.Container>
)

export const WithIcons: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Button iconRight={<Zap />} auto scale={2 / 3} />
    </Grid>
    <Grid>
      <Button iconRight={<ZapOff />} auto scale={2 / 3} px={0.6} />
    </Grid>
    <Grid>
      <Button icon={<AlertCircle />} auto>
        Button
      </Button>
    </Grid>
    <Grid>
      <Button icon={<AlertCircle />} type="success" scale={0.85}>
        Button
      </Button>
    </Grid>
    <Grid>
      <Button icon={<AlertCircle />} type="secondary">
        Button
      </Button>
    </Grid>
    <Grid>
      <Button icon={<XSquare />} type="error" ghost>
        Remove Button
      </Button>
    </Grid>
    <Grid>
      <Button icon={<XSquare />} disabled>
        Remove Button
      </Button>
    </Grid>
  </Grid.Container>
)
