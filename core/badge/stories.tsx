import { Story, Meta } from '@storybook/react'
import { useTheme } from '../use-theme/theme-context'
import Badge from '.'
import Spacer from '../spacer'
import Avatar from '../avatar'
import Button from '../button'
import Link from '../link'

export default {
  title: 'Data Display/Badge',
  component: Badge
} as Meta

export const Default: Story = () => (
  <>
    <Badge>1</Badge> <Spacer h={0.5} />
    <Badge>50</Badge> <Spacer h={0.5} />
    <Badge>100</Badge> <Spacer h={0.5} />
    <Badge>2020</Badge>
  </>
)

export const Type: Story = () => (
  <>
    <Badge type="success">Success</Badge> <Spacer h={0.5} />
    <Badge type="warning">Warning</Badge> <Spacer h={0.5} />
    <Badge type="error">Error</Badge> <Spacer h={0.5} />
    <Badge type="secondary">Secondary</Badge>
  </>
)

export const CustomColor: Story = () => {
  const theme = useTheme()
  return (
    <>
      <Badge style={{ backgroundColor: theme.palette.successLight }}>
        Success Light
      </Badge>{' '}
      <Spacer h={0.5} />
      <Badge style={{ backgroundColor: theme.palette.successDark }}>
        Success Dark
      </Badge>{' '}
      <Spacer h={0.5} />
      <Badge style={{ backgroundColor: theme.palette.alert }}>Alert</Badge>{' '}
      <Spacer h={0.5} />
      <Badge style={{ backgroundColor: theme.palette.purple }}>
        Purple
      </Badge>{' '}
      <Spacer h={0.5} />
      <Badge style={{ backgroundColor: theme.palette.violet }}>
        Violet
      </Badge>{' '}
      <Spacer h={0.5} />
      <Badge
        style={{
          backgroundColor: theme.palette.cyanLighter,
          color: theme.palette.foreground
        }}
      >
        Cyan Ligher
      </Badge>{' '}
      <Spacer h={0.5} />
    </>
  )
}

export const Anchor: Story = () => (
  <>
    <Badge.Anchor>
      <Badge scale={0.5}>10</Badge>
      <Avatar src="/images/avatar.png" />
    </Badge.Anchor>
    <Spacer inline w={2.5} />
    <Badge.Anchor placement="bottomRight">
      <Badge scale={0.5} type="success">
        10
      </Badge>
      <Avatar scale={1.5} isSquare src="/images/avatar.png" />
    </Badge.Anchor>
    <Spacer inline w={2.5} />
    <Badge.Anchor>
      <Badge scale={0.5} type="warning">
        99+
      </Badge>
      <Button scale={0.5} auto>
        Action
      </Button>
    </Badge.Anchor>
    <Spacer inline w={2.5} />
    <Badge.Anchor>
      <Badge scale={0.5} type="error" dot />
      <Link target="_blank" href="https://github.com/bolio-ui/bolio-ui/">
        Bolio UI
      </Link>
    </Badge.Anchor>
    <Spacer inline w={2.5} />
    <Badge.Anchor>
      <Badge type="error" dot padding="5px" />
      <Link target="_blank" href="https://github.com/bolio-ui/bolio-ui/">
        Share Link
      </Link>
    </Badge.Anchor>
  </>
)
