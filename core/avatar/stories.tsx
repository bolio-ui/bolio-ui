import { Story, Meta } from '@storybook/react'
import Avatar from '.'
import Spacer from '../spacer'

export default {
  title: 'Data Display/Avatar',
  component: Avatar
} as Meta

export const Default: Story = () => {
  const url =
    'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?cs=srgb&dl=pexels-pixabay-415829.jpg&fm=jpg'
  return (
    <>
      <Avatar src={url} />
      <Avatar src={url} />
      <Avatar src={url} />
      <Avatar src={url} />
      <Spacer h={0.5} />
      <Avatar src={url} isSquare />
      <Avatar src={url} isSquare />
      <Avatar src={url} isSquare />
      <Avatar src={url} isSquare />
    </>
  )
}

export const Text: Story = () => (
  <>
    <Avatar text="W" />
    <Avatar text="A" />
    <Avatar text="W" />
    <Avatar text="Joe" />
  </>
)

export const Group: Story = () => {
  const url =
    'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?cs=srgb&dl=pexels-pixabay-415829.jpg&fm=jpg'
  return (
    <>
      <Avatar.Group>
        <Avatar src={url} stacked />
        <Avatar src={url} stacked />
        <Avatar src={url} stacked />
        <Avatar src={url} stacked />
      </Avatar.Group>
      <Spacer />
      <Avatar.Group count={12}>
        <Avatar src={url} stacked />
        <Avatar text="W" stacked />
        <Avatar text="Ana" stacked />
      </Avatar.Group>
    </>
  )
}
