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
  <Tooltip text={'Push to Git and your website is live.'}>Tooltip</Tooltip>
)

export const Trigger: Story = () => (
  <Tooltip
    text={'Push to Git and your website is live.'}
    trigger="click"
    type="dark"
  >
    <span>Click me</span>
  </Tooltip>
)

export const WithComponents: Story = () => (
  <div>
    <Tooltip text={'Push to Git and your website is live.'} type="dark">
      <Button auto scale={1 / 2}>
        Button
      </Button>
    </Tooltip>
    <Spacer inline w={1} />
    <Tooltip text={'Push to Git and your website is live.'} type="dark">
      <Badge>1000+</Badge>
    </Tooltip>
    <Spacer inline w={1} />
    <Tooltip text={'Push to Git and your website is live.'} type="dark">
      <Link href="#" color>
        Hyperlink
      </Link>
    </Tooltip>
  </div>
)

export const CustomContent: Story = () => (
  <div>
    <Tooltip
      text={
        <>
          Perfect for working with a <Code>CMS</Code>.
        </>
      }
    >
      <span>Top</span>
    </Tooltip>
    <Spacer inline w={2.5} />
    <Tooltip
      text={
        <>
          <Text b>Perfect</Text> for working with a CMS.
        </>
      }
      placement="bottom"
    >
      <span>Bottom</span>
    </Tooltip>
  </div>
)

export const Types: Story = () => (
  <div>
    <Tooltip text="Perfect for working with a CMS." type="dark">
      <span>Dark</span>
    </Tooltip>
    <Spacer inline w={1.5} />
    <Tooltip text="Perfect for working with a CMS." type="success">
      <span>Success</span>
    </Tooltip>
    <Spacer inline w={1.5} />
    <Tooltip text="Perfect for working with a CMS." type="warning">
      <span>Warning</span>
    </Tooltip>
    <Spacer inline w={1.5} />
    <Tooltip text="Perfect for working with a CMS." type="error">
      <span>Error</span>
    </Tooltip>
    <Spacer inline w={1.5} />
    <Tooltip text="Perfect for working with a CMS." type="secondary">
      <span>Secondary</span>
    </Tooltip>
  </div>
)

export const Variants: Story = () => {
  return (
    <div>
      <Tooltip text="Push to Git and your website is live." type="lite">
        <span>Lite</span>
      </Tooltip>
      <Spacer inline w={2.5} />
      <Tooltip text="Push to Git and your website is live." hideArrow>
        <span>No Arrow</span>
      </Tooltip>
    </div>
  )
}

export const Placements: Story = () => {
  const text = 'HTTP is stateless, but not sessionless'
  return (
    <Grid.Container gap={1.5} justify="center" alignItems="center">
      <Grid xs={8} justify="flex-end">
        <Tooltip text={text} placement="topStart" type="dark">
          topStart
        </Tooltip>
      </Grid>
      <Grid xs={8} justify="center">
        <Tooltip text={text} placement="top" type="dark">
          top
        </Tooltip>
      </Grid>
      <Grid xs={8}>
        <Tooltip text={text} placement="topEnd" type="dark">
          topEnd
        </Tooltip>
      </Grid>
      <Grid xs={6} justify="flex-end">
        <Tooltip text={text} placement="leftStart" type="dark">
          leftStart
        </Tooltip>
      </Grid>
      <Grid xs={12} />
      <Grid xs={6}>
        <Tooltip text={text} placement="rightStart" type="dark">
          rightStart
        </Tooltip>
      </Grid>
      <Grid xs={6} justify="flex-end">
        <Tooltip text={text} placement="left" type="dark">
          left
        </Tooltip>
      </Grid>
      <Grid xs={12} />
      <Grid xs={6}>
        <Tooltip text={text} placement="right" type="dark">
          right
        </Tooltip>
      </Grid>
      <Grid xs={6} justify="flex-end">
        <Tooltip text={text} placement="leftEnd" type="dark">
          leftEnd
        </Tooltip>
      </Grid>
      <Grid xs={12} />
      <Grid xs={6}>
        <Tooltip text={text} placement="rightEnd" type="dark">
          rightEnd
        </Tooltip>
      </Grid>
      <Grid xs={8} justify="flex-end">
        <Tooltip text={text} placement="bottomStart" type="dark">
          bottomStart
        </Tooltip>
      </Grid>
      <Grid xs={8} justify="center">
        <Tooltip text={text} placement="bottom" type="dark">
          bottom
        </Tooltip>
      </Grid>
      <Grid xs={8}>
        <Tooltip text={text} placement="bottomEnd" type="dark">
          bottomEnd
        </Tooltip>
      </Grid>
    </Grid.Container>
  )
}
