import { Story, Meta } from '@storybook/react'
import { useTheme } from '../use-theme/theme-context'
import Badge from '.'
import Grid from '../Grid'
import Avatar from '../Avatar'
import Button from '../Button'
import Link from '../Link'

export default {
  title: 'Data Display/Badge',
  component: Badge
} as Meta

export const Default: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Badge>Default</Badge>
    </Grid>
  </Grid.Container>
)

export const Type: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Badge>Default</Badge>
    </Grid>
    <Grid>
      <Badge type="primary">Primary</Badge>
    </Grid>
    <Grid>
      <Badge type="secondary">Secondary</Badge>
    </Grid>
    <Grid>
      <Badge type="success">Success</Badge>
    </Grid>
    <Grid>
      <Badge type="warning">Warning</Badge>
    </Grid>
    <Grid>
      <Badge type="error">Error</Badge>
    </Grid>
    <Grid>
      <Badge type="info">Info</Badge>
    </Grid>
  </Grid.Container>
)

export const CustomColor: Story = () => {
  const theme = useTheme()
  return (
    <Grid.Container gap={2}>
      <Grid>
        <Badge style={{ backgroundColor: theme.palette.successDark }}>
          Success Light
        </Badge>
      </Grid>
      <Grid>
        <Badge style={{ backgroundColor: theme.palette.alert }}>Alert</Badge>
      </Grid>
      <Grid>
        <Badge style={{ backgroundColor: theme.palette.purple }}>Purple</Badge>
      </Grid>
      <Grid>
        <Badge style={{ backgroundColor: theme.palette.secondary }}>
          Violet
        </Badge>
      </Grid>
    </Grid.Container>
  )
}

export const Anchor: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Badge.Anchor>
        <Badge scale={0.5}>10</Badge>
        <Avatar src="https://i.pravatar.cc/150?img=60" />
      </Badge.Anchor>
    </Grid>
    <Grid>
      <Badge.Anchor placement="bottomRight">
        <Badge scale={0.5} type="success">
          10
        </Badge>
        <Avatar scale={1.5} isSquare src="https://i.pravatar.cc/150?img=30" />
      </Badge.Anchor>
    </Grid>
    <Grid>
      <Badge.Anchor>
        <Badge scale={0.5} type="warning">
          99+
        </Badge>
        <Button scale={0.5} auto>
          Action
        </Button>
      </Badge.Anchor>
    </Grid>
    <Grid>
      <Badge.Anchor>
        <Badge scale={0.5} type="error" dot />
        <Link target="_blank" href="https://github.com/bolio-ui/bolio-ui/">
          Bolio UI
        </Link>
      </Badge.Anchor>
    </Grid>
    <Grid>
      <Badge.Anchor>
        <Badge type="error" dot padding="5px" />
        <Link target="_blank" href="https://github.com/bolio-ui/bolio-ui/">
          Share Link
        </Link>
      </Badge.Anchor>
    </Grid>
  </Grid.Container>
)
