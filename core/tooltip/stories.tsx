import { Story, Meta } from '@storybook/react'
import Tooltip from '.'
import Spacer from '../spacer'
import Grid from '../grid'
import Button from '../button'
import Link from '../link'
import Code from '../code'
import Text from '../text'

export default {
  title: 'Data Display/Tooltip',
  component: Tooltip
} as Meta

export const Default: Story = () => (
  <Tooltip
    text={'Push to Git and your website is live.'}
    type={'default'}
    placement={'top'}
    initialVisible={false}
    hideArrow={false}
    trigger={'hover'}
    enterDelay={0}
    leaveDelay={0}
    offset={0}
    className={''}
    portalClassName={''}
    onVisibleChange={function (visible: boolean): void {
      throw new Error('Function not implemented.')
    }}
  >
    Tooltip
  </Tooltip>
)

export const Trigger: Story = () => (
  <Tooltip
    text={'Push to Git and your website is live.'}
    trigger="click"
    type="dark"
    placement={'top'}
    initialVisible={false}
    hideArrow={false}
    enterDelay={0}
    leaveDelay={0}
    offset={0}
    className={''}
    portalClassName={''}
    onVisibleChange={function (visible: boolean): void {
      throw new Error('Function not implemented.')
    }}
  >
    <span>Click me</span>
  </Tooltip>
)

export const WithComponents: Story = () => (
  <div>
    <Tooltip
      text={'Push to Git and your website is live.'}
      type="dark"
      placement={'top'}
      initialVisible={false}
      hideArrow={false}
      trigger={'hover'}
      enterDelay={0}
      leaveDelay={0}
      offset={0}
      className={''}
      portalClassName={''}
      onVisibleChange={function (visible: boolean): void {
        throw new Error('Function not implemented.')
      }}
    >
      <Button auto scale={1 / 2}>
        Button
      </Button>
    </Tooltip>
    <Spacer inline w={1} />
    <Tooltip
      text={'Push to Git and your website is live.'}
      type="dark"
      placement={'top'}
      initialVisible={false}
      hideArrow={false}
      trigger={'hover'}
      enterDelay={0}
      leaveDelay={0}
      offset={0}
      className={''}
      portalClassName={''}
      onVisibleChange={function (visible: boolean): void {
        throw new Error('Function not implemented.')
      }}
    >
      {/* <Badge>1000+</Badge> */}
    </Tooltip>
    <Spacer inline w={1} />
    <Tooltip
      text={'Push to Git and your website is live.'}
      type="dark"
      placement={'top'}
      initialVisible={false}
      hideArrow={false}
      trigger={'hover'}
      enterDelay={0}
      leaveDelay={0}
      offset={0}
      className={''}
      portalClassName={''}
      onVisibleChange={function (visible: boolean): void {
        throw new Error('Function not implemented.')
      }}
    >
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
      type={'default'}
      placement={'top'}
      initialVisible={false}
      hideArrow={false}
      trigger={'hover'}
      enterDelay={0}
      leaveDelay={0}
      offset={0}
      className={''}
      portalClassName={''}
      onVisibleChange={function (visible: boolean): void {
        throw new Error('Function not implemented.')
      }}
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
      type={'default'}
      initialVisible={false}
      hideArrow={false}
      trigger={'hover'}
      enterDelay={0}
      leaveDelay={0}
      offset={0}
      className={''}
      portalClassName={''}
      onVisibleChange={function (visible: boolean): void {
        throw new Error('Function not implemented.')
      }}
    >
      <span>Bottom</span>
    </Tooltip>
  </div>
)

export const Types: Story = () => (
  <div>
    <Tooltip
      text="Perfect for working with a CMS."
      type="dark"
      placement={'top'}
      initialVisible={false}
      hideArrow={false}
      trigger={'hover'}
      enterDelay={0}
      leaveDelay={0}
      offset={0}
      className={''}
      portalClassName={''}
      onVisibleChange={function (visible: boolean): void {
        throw new Error('Function not implemented.')
      }}
    >
      <span>Dark</span>
    </Tooltip>
    <Spacer inline w={1.5} />
    <Tooltip
      text="Perfect for working with a CMS."
      type="success"
      placement={'top'}
      initialVisible={false}
      hideArrow={false}
      trigger={'hover'}
      enterDelay={0}
      leaveDelay={0}
      offset={0}
      className={''}
      portalClassName={''}
      onVisibleChange={function (visible: boolean): void {
        throw new Error('Function not implemented.')
      }}
    >
      <span>Success</span>
    </Tooltip>
    <Spacer inline w={1.5} />
    <Tooltip
      text="Perfect for working with a CMS."
      type="warning"
      placement={'top'}
      initialVisible={false}
      hideArrow={false}
      trigger={'hover'}
      enterDelay={0}
      leaveDelay={0}
      offset={0}
      className={''}
      portalClassName={''}
      onVisibleChange={function (visible: boolean): void {
        throw new Error('Function not implemented.')
      }}
    >
      <span>Warning</span>
    </Tooltip>
    <Spacer inline w={1.5} />
    <Tooltip
      text="Perfect for working with a CMS."
      type="error"
      placement={'top'}
      initialVisible={false}
      hideArrow={false}
      trigger={'hover'}
      enterDelay={0}
      leaveDelay={0}
      offset={0}
      className={''}
      portalClassName={''}
      onVisibleChange={function (visible: boolean): void {
        throw new Error('Function not implemented.')
      }}
    >
      <span>Error</span>
    </Tooltip>
    <Spacer inline w={1.5} />
    <Tooltip
      text="Perfect for working with a CMS."
      type="secondary"
      placement={'top'}
      initialVisible={false}
      hideArrow={false}
      trigger={'hover'}
      enterDelay={0}
      leaveDelay={0}
      offset={0}
      className={''}
      portalClassName={''}
      onVisibleChange={function (visible: boolean): void {
        throw new Error('Function not implemented.')
      }}
    >
      <span>Secondary</span>
    </Tooltip>
  </div>
)

export const Placements: Story = () => (
  <div>
    <Tooltip
      text="Push to Git and your website is live."
      type="lite"
      placement={'top'}
      initialVisible={false}
      hideArrow={false}
      trigger={'hover'}
      enterDelay={0}
      leaveDelay={0}
      offset={0}
      className={''}
      portalClassName={''}
      onVisibleChange={function (visible: boolean): void {
        throw new Error('Function not implemented.')
      }}
    >
      <span>Lite</span>
    </Tooltip>
    <Spacer inline w={2.5} />
    <Tooltip
      text="Push to Git and your website is live."
      hideArrow
      type={'default'}
      placement={'top'}
      initialVisible={false}
      trigger={'hover'}
      enterDelay={0}
      leaveDelay={0}
      offset={0}
      className={''}
      portalClassName={''}
      onVisibleChange={function (visible: boolean): void {
        throw new Error('Function not implemented.')
      }}
    >
      <span>No Arrow</span>
    </Tooltip>
  </div>
)

export const Variants: Story = () => {
  const text = 'HTTP is stateless, but not sessionless'
  return (
    <Grid.Container gap={1.5} justify="center" alignItems="center">
      <Grid xs={8} justify="flex-end">
        <Tooltip
          text={text}
          placement="topStart"
          type="dark"
          initialVisible={false}
          hideArrow={false}
          trigger={'hover'}
          enterDelay={0}
          leaveDelay={0}
          offset={0}
          className={''}
          portalClassName={''}
          onVisibleChange={function (visible: boolean): void {
            throw new Error('Function not implemented.')
          }}
        >
          topStart
        </Tooltip>
      </Grid>
      <Grid xs={8} justify="center">
        <Tooltip
          text={text}
          placement="top"
          type="dark"
          initialVisible={false}
          hideArrow={false}
          trigger={'hover'}
          enterDelay={0}
          leaveDelay={0}
          offset={0}
          className={''}
          portalClassName={''}
          onVisibleChange={function (visible: boolean): void {
            throw new Error('Function not implemented.')
          }}
        >
          top
        </Tooltip>
      </Grid>
      <Grid xs={8}>
        <Tooltip
          text={text}
          placement="topEnd"
          type="dark"
          initialVisible={false}
          hideArrow={false}
          trigger={'click'}
          enterDelay={0}
          leaveDelay={0}
          offset={0}
          className={''}
          portalClassName={''}
          onVisibleChange={function (visible: boolean): void {
            throw new Error('Function not implemented.')
          }}
        >
          topEnd
        </Tooltip>
      </Grid>
      <Grid xs={6} justify="flex-end">
        <Tooltip
          text={text}
          placement="leftStart"
          type="dark"
          initialVisible={false}
          hideArrow={false}
          trigger={'hover'}
          enterDelay={0}
          leaveDelay={0}
          offset={0}
          className={''}
          portalClassName={''}
          onVisibleChange={function (visible: boolean): void {
            throw new Error('Function not implemented.')
          }}
        >
          leftStart
        </Tooltip>
      </Grid>
      <Grid xs={12} />
      <Grid xs={6}>
        <Tooltip
          text={text}
          placement="rightStart"
          type="dark"
          initialVisible={false}
          hideArrow={false}
          trigger={'hover'}
          enterDelay={0}
          leaveDelay={0}
          offset={0}
          className={''}
          portalClassName={''}
          onVisibleChange={function (visible: boolean): void {
            throw new Error('Function not implemented.')
          }}
        >
          rightStart
        </Tooltip>
      </Grid>
      <Grid xs={6} justify="flex-end">
        <Tooltip
          text={text}
          placement="left"
          type="dark"
          initialVisible={false}
          hideArrow={false}
          trigger={'hover'}
          enterDelay={0}
          leaveDelay={0}
          offset={0}
          className={''}
          portalClassName={''}
          onVisibleChange={function (visible: boolean): void {
            throw new Error('Function not implemented.')
          }}
        >
          left
        </Tooltip>
      </Grid>
      <Grid xs={12} />
      <Grid xs={6}>
        <Tooltip
          text={text}
          placement="right"
          type="dark"
          initialVisible={false}
          hideArrow={false}
          trigger={'hover'}
          enterDelay={0}
          leaveDelay={0}
          offset={0}
          className={''}
          portalClassName={''}
          onVisibleChange={function (visible: boolean): void {
            throw new Error('Function not implemented.')
          }}
        >
          right
        </Tooltip>
      </Grid>
      <Grid xs={6} justify="flex-end">
        <Tooltip
          text={text}
          placement="leftEnd"
          type="dark"
          initialVisible={false}
          hideArrow={false}
          trigger={'hover'}
          enterDelay={0}
          leaveDelay={0}
          offset={0}
          className={''}
          portalClassName={''}
          onVisibleChange={function (visible: boolean): void {
            throw new Error('Function not implemented.')
          }}
        >
          leftEnd
        </Tooltip>
      </Grid>
      <Grid xs={12} />
      <Grid xs={6}>
        <Tooltip
          text={text}
          placement="rightEnd"
          type="dark"
          initialVisible={false}
          hideArrow={false}
          trigger={'hover'}
          enterDelay={0}
          leaveDelay={0}
          offset={0}
          className={''}
          portalClassName={''}
          onVisibleChange={function (visible: boolean): void {
            throw new Error('Function not implemented.')
          }}
        >
          rightEnd
        </Tooltip>
      </Grid>
      <Grid xs={8} justify="flex-end">
        <Tooltip
          text={text}
          placement="bottomStart"
          type="dark"
          initialVisible={false}
          hideArrow={false}
          trigger={'hover'}
          enterDelay={0}
          leaveDelay={0}
          offset={0}
          className={''}
          portalClassName={''}
          onVisibleChange={function (visible: boolean): void {
            throw new Error('Function not implemented.')
          }}
        >
          bottomStart
        </Tooltip>
      </Grid>
      <Grid xs={8} justify="center">
        <Tooltip
          text={text}
          placement="bottom"
          type="dark"
          initialVisible={false}
          hideArrow={false}
          trigger={'hover'}
          enterDelay={0}
          leaveDelay={0}
          offset={0}
          className={''}
          portalClassName={''}
          onVisibleChange={function (visible: boolean): void {
            throw new Error('Function not implemented.')
          }}
        >
          bottom
        </Tooltip>
      </Grid>
      <Grid xs={8}>
        <Tooltip
          text={text}
          placement="bottomEnd"
          type="dark"
          initialVisible={false}
          hideArrow={false}
          trigger={'hover'}
          enterDelay={0}
          leaveDelay={0}
          offset={0}
          className={''}
          portalClassName={''}
          onVisibleChange={function (visible: boolean): void {
            throw new Error('Function not implemented.')
          }}
        >
          bottomEnd
        </Tooltip>
      </Grid>
    </Grid.Container>
  )
}
