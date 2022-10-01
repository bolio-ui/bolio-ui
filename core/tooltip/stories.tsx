import { Story, Meta } from '@storybook/react'
import Tooltip from '.'
import Spacer from '../spacer'
import Grid from '../grid'
import Button from '../button'
import Link from '../link'
import Code from '../code'
import Text from '../text'
import Badge from '../badge'

export default {
  title: 'Data Display/Tooltip',
  component: Tooltip
} as Meta

export const Default: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Tooltip text={'Push to Git and your website is live.'}>Tooltip</Tooltip>
    </Grid>
  </Grid.Container>
)

export const Trigger: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Tooltip
        text={'Push to Git and your website is live.'}
        trigger="click"
        type="dark"
      >
        Click me
      </Tooltip>
    </Grid>
  </Grid.Container>
)

export const WithComponents: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Tooltip text={'Push to Git and your website is live.'} type="dark">
        <Button auto scale={1 / 2}>
          Button
        </Button>
      </Tooltip>
    </Grid>
    <Grid>
      <Tooltip text={'Push to Git and your website is live.'} type="dark">
        <Badge>1000+</Badge>
      </Tooltip>
    </Grid>
    <Grid>
      <Tooltip text={'Push to Git and your website is live.'} type="dark">
        <Link href="#" color>
          Hyperlink
        </Link>
      </Tooltip>
    </Grid>
  </Grid.Container>
)

export const CustomContent: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Tooltip
        text={
          <>
            Perfect for working with a <Code>CMS</Code>.
          </>
        }
      >
        Top
      </Tooltip>
    </Grid>
    <Grid>
      <Tooltip
        text={
          <>
            <Text b>Perfect</Text> for working with a CMS.
          </>
        }
        placement="bottom"
      >
        Bottom
      </Tooltip>
    </Grid>
  </Grid.Container>
)

export const Types: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Tooltip text="Perfect for working with a CMS." type="dark">
        Dark
      </Tooltip>
    </Grid>
    <Grid>
      <Tooltip text="Perfect for working with a CMS." type="success">
        Success
      </Tooltip>
    </Grid>
    <Grid>
      <Tooltip text="Perfect for working with a CMS." type="warning">
        Warning
      </Tooltip>
    </Grid>
    <Grid>
      <Tooltip text="Perfect for working with a CMS." type="error">
        Error
      </Tooltip>
    </Grid>
    <Grid>
      <Tooltip text="Perfect for working with a CMS." type="secondary">
        Secondary
      </Tooltip>
    </Grid>
  </Grid.Container>
)

export const Variants: Story = () => (
  <Grid.Container gap={2}>
    <Grid>
      <Tooltip text="Push to Git and your website is live." type="lite">
        Lite
      </Tooltip>
    </Grid>
    <Grid>
      <Tooltip text="Push to Git and your website is live." hideArrow>
        No Arrow
      </Tooltip>
    </Grid>
  </Grid.Container>
)

export const Placements: Story = () => {
  const text = 'HTTP is stateless, but not sessionless'
  return (
    <Grid.Container gap={2} justify="center" alignItems="center">
      <Grid xs={4} justify="flex-end">
        <Tooltip text={text} placement="topStart" type="dark">
          topStart
        </Tooltip>
      </Grid>
      <Grid xs={4} justify="center">
        <Tooltip text={text} placement="top" type="dark">
          top
        </Tooltip>
      </Grid>
      <Grid xs={4}>
        <Tooltip text={text} placement="topEnd" type="dark">
          topEnd
        </Tooltip>
      </Grid>
      <Grid xs={3} justify="flex-end">
        <Tooltip text={text} placement="leftStart" type="dark">
          leftStart
        </Tooltip>
      </Grid>
      <Grid xs={6} />
      <Grid xs={3}>
        <Tooltip text={text} placement="rightStart" type="dark">
          rightStart
        </Tooltip>
      </Grid>
      <Grid xs={3} justify="flex-end">
        <Tooltip text={text} placement="left" type="dark">
          left
        </Tooltip>
      </Grid>
      <Grid xs={6} />
      <Grid xs={3}>
        <Tooltip text={text} placement="right" type="dark">
          right
        </Tooltip>
      </Grid>
      <Grid xs={3} justify="flex-end">
        <Tooltip text={text} placement="leftEnd" type="dark">
          leftEnd
        </Tooltip>
      </Grid>
      <Grid xs={6} />
      <Grid xs={3}>
        <Tooltip text={text} placement="rightEnd" type="dark">
          rightEnd
        </Tooltip>
      </Grid>
      <Grid xs={4} justify="flex-end">
        <Tooltip text={text} placement="bottomStart" type="dark">
          bottomStart
        </Tooltip>
      </Grid>
      <Grid xs={4} justify="center">
        <Tooltip text={text} placement="bottom" type="dark">
          bottom
        </Tooltip>
      </Grid>
      <Grid xs={4}>
        <Tooltip text={text} placement="bottomEnd" type="dark">
          bottomEnd
        </Tooltip>
      </Grid>
    </Grid.Container>
  )
}
