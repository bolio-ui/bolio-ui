import { Story, Meta } from '@storybook/react'
import Avatar from '.'
import Grid from '../Grid'

export default {
  title: 'Data Display/Avatar',
  component: Avatar
} as Meta

export const Default: Story = () => {
  return (
    <Grid.Container gap={2}>
      <Grid>
        <Avatar
          src="https://i.pravatar.cc/150?img=60"
          isSquare
          width={1.5}
          height={1.5}
        />
      </Grid>
      <Grid>
        <Avatar text="Bill" isSquare width={1.5} height={1.5} />
      </Grid>
      <Grid>
        <Avatar
          src="https://i.pravatar.cc/150?img=30"
          isSquare
          width={1.5}
          height={1.5}
        />
      </Grid>
      <Grid>
        <Avatar text="Max" isSquare width={1.5} height={1.5} />
      </Grid>
      <Grid>
        <Avatar
          src="https://i.pravatar.cc/150?img=20"
          isSquare
          width={1.5}
          height={1.5}
        />
      </Grid>
      <Grid>
        <Avatar text="Jane" isSquare width={1.5} height={1.5} />
      </Grid>
    </Grid.Container>
  )
}

export const Text: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Avatar text="BA" width={1.5} height={1.5} />
    </Grid>
    <Grid>
      <Avatar text="ES" width={1.5} height={1.5} />
    </Grid>
    <Grid>
      <Avatar text="MB" width={1.5} height={1.5} />
    </Grid>
    <Grid>
      <Avatar text="WL" width={1.5} height={1.5} />
    </Grid>
    <Grid>
      <Avatar text="ML" width={1.5} height={1.5} />
    </Grid>
    <Grid>
      <Avatar text="TR" width={1.5} height={1.5} />
    </Grid>
  </Grid.Container>
)

export const Group: Story = () => {
  return (
    <Grid.Container gap={2} direction="column">
      <Grid>
        <Avatar.Group>
          <Avatar
            src="https://i.pravatar.cc/150?img=60"
            width={1.5}
            height={1.5}
            stacked
          />
          <Avatar
            src="https://i.pravatar.cc/150?img=30"
            width={1.5}
            height={1.5}
            stacked
          />
          <Avatar
            src="https://i.pravatar.cc/150?img=20"
            width={1.5}
            height={1.5}
            stacked
          />
          <Avatar
            src="https://i.pravatar.cc/150?img=10"
            width={1.5}
            height={1.5}
            stacked
          />
        </Avatar.Group>
      </Grid>
      <Grid>
        <Avatar.Group count={6}>
          <Avatar
            src="https://i.pravatar.cc/150?img=60"
            width={1.5}
            height={1.5}
            stacked
          />
          <Avatar text="C" width={1.5} height={1.5} stacked />
          <Avatar text="Mag" width={1.5} height={1.5} stacked />
        </Avatar.Group>
      </Grid>
    </Grid.Container>
  )
}
