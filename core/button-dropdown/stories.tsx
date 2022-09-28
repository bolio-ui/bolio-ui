import { Story, Meta } from '@storybook/react'
import ButtonDropdown from '.'
import Grid from '../grid'
import { Plus } from '@bolio-ui/icons'

export default {
  title: 'Navigation/ButtonDropdown',
  component: ButtonDropdown
} as Meta

export const Default: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <ButtonDropdown>
        <ButtonDropdown.Item main>Default Button</ButtonDropdown.Item>
        <ButtonDropdown.Item>Secondary Button</ButtonDropdown.Item>
        <ButtonDropdown.Item>Tertiary Button</ButtonDropdown.Item>
      </ButtonDropdown>
    </Grid>
  </Grid.Container>
)

export const Loading: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <ButtonDropdown loading>
        <ButtonDropdown.Item main>Default Button</ButtonDropdown.Item>
        <ButtonDropdown.Item>Secondary Button</ButtonDropdown.Item>
        <ButtonDropdown.Item>Tertiary Button</ButtonDropdown.Item>
      </ButtonDropdown>
    </Grid>
  </Grid.Container>
)

export const Disabled: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <ButtonDropdown disabled>
        <ButtonDropdown.Item main>Default Button</ButtonDropdown.Item>
        <ButtonDropdown.Item>Secondary Button</ButtonDropdown.Item>
        <ButtonDropdown.Item>Tertiary Button</ButtonDropdown.Item>
      </ButtonDropdown>
    </Grid>
  </Grid.Container>
)

export const Types: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <ButtonDropdown type="secondary" scale={0.5}>
        <ButtonDropdown.Item main>Secondary Button</ButtonDropdown.Item>
      </ButtonDropdown>
    </Grid>
    <Grid>
      <ButtonDropdown type="success" scale={0.5}>
        <ButtonDropdown.Item main>Success Button</ButtonDropdown.Item>
      </ButtonDropdown>
    </Grid>
    <Grid>
      <ButtonDropdown type="warning" scale={0.5}>
        <ButtonDropdown.Item main>Warning Button</ButtonDropdown.Item>
      </ButtonDropdown>
    </Grid>
    <Grid>
      <ButtonDropdown type="error" scale={0.5}>
        <ButtonDropdown.Item main>Error Button</ButtonDropdown.Item>
      </ButtonDropdown>
    </Grid>
  </Grid.Container>
)

export const MultipleType: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <ButtonDropdown scale={2 / 3} auto>
        <ButtonDropdown.Item main>Check</ButtonDropdown.Item>
        <ButtonDropdown.Item>Block</ButtonDropdown.Item>
        <ButtonDropdown.Item>Lock</ButtonDropdown.Item>
        <ButtonDropdown.Item type="error">Destroy</ButtonDropdown.Item>
      </ButtonDropdown>
    </Grid>
  </Grid.Container>
)

export const CustomIcon: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <ButtonDropdown scale={2 / 3} auto icon={<Plus />}>
        <ButtonDropdown.Item main>Check User</ButtonDropdown.Item>
        <ButtonDropdown.Item>Block User</ButtonDropdown.Item>
        <ButtonDropdown.Item>Lock User</ButtonDropdown.Item>
        <ButtonDropdown.Item type="error">Destroy User</ButtonDropdown.Item>
      </ButtonDropdown>
    </Grid>
  </Grid.Container>
)
