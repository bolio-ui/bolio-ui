import { Story, Meta } from '@storybook/react'
import Image from '.'
import Display from '../display'
import Code from '../code'

export default {
  title: 'Data Display/Image',
  component: Image
} as Meta

export const Default: Story = () => (
  <Image
    width="280px"
    height="160px"
    src="https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg"
  />
)

export const Skeleton: Story = () => (
  <Image
    width="280px"
    height="160px"
    src="http://www.deelay.me/2000/https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg"
  />
)

export const Browser: Story = () => (
  <Image.Browser
    url="https://bolio-ui.com.br/"
    anchorProps={{ rel: 'nofollow' }}
  >
    <Image
      width="450px"
      height="300px"
      src="https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg"
    />
  </Image.Browser>
)

export const BrowserInvert: Story = () => (
  <Image.Browser url="https://bolio-ui.com.br/" invert>
    <Image
      width="450px"
      height="300px"
      src="https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg"
    />
  </Image.Browser>
)

export const Compose: Story = () => (
  <Display
    shadow
    caption={
      <p>
        Reduce the possibility of page rendering by setting <Code>height</Code>
      </p>
    }
  >
    <Image
      height="250px"
      src="https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg"
    />
  </Display>
)

export const SVG: Story = () => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" viewBox="0 0 30 30" fill="none">
    <path d="M13.5 3.5H14V3.29289L13.8536 3.14645L13.5 3.5ZM10.5 0.5L10.8536 0.146447L10.7071 0H10.5V0.5ZM2.5 6.5V6H2V6.5H2.5ZM2.5 8.5H2V9H2.5V8.5ZM4.5 8.5H5V8H4.5V8.5ZM4.5 10.5V11H5V10.5H4.5ZM6.5 9.5H6V9.70711L6.14645 9.85355L6.5 9.5ZM7.5 10.5L7.14645 10.8536L7.5 11.2071L7.85355 10.8536L7.5 10.5ZM8.5 9.5L8.85355 9.85355L9 9.70711V9.5H8.5ZM10.5 6.5V6H10V6.5H10.5ZM10.5 10.5H10V11H10.5V10.5ZM12.5 10.5V11H13V10.5H12.5ZM2 5V1.5H1V5H2ZM13 3.5V5H14V3.5H13ZM2.5 1H10.5V0H2.5V1ZM10.1464 0.853553L13.1464 3.85355L13.8536 3.14645L10.8536 0.146447L10.1464 0.853553ZM2 1.5C2 1.22386 2.22386 1 2.5 1V0C1.67157 0 1 0.671573 1 1.5H2ZM1 12V13.5H2V12H1ZM2.5 15H12.5V14H2.5V15ZM14 13.5V12H13V13.5H14ZM12.5 15C13.3284 15 14 14.3284 14 13.5H13C13 13.7761 12.7761 14 12.5 14V15ZM1 13.5C1 14.3284 1.67157 15 2.5 15V14C2.22386 14 2 13.7761 2 13.5H1ZM5 6H2.5V7H5V6ZM2 6.5V8.5H3V6.5H2ZM2.5 9H4.5V8H2.5V9ZM4 8.5V10.5H5V8.5H4ZM4.5 10H2V11H4.5V10ZM6 6V9.5H7V6H6ZM6.14645 9.85355L7.14645 10.8536L7.85355 10.1464L6.85355 9.14645L6.14645 9.85355ZM7.85355 10.8536L8.85355 9.85355L8.14645 9.14645L7.14645 10.1464L7.85355 10.8536ZM9 9.5V6H8V9.5H9ZM13 6H10.5V7H13V6ZM10 6.5V10.5H11V6.5H10ZM10.5 11H12.5V10H10.5V11ZM13 10.5V8.5H12V10.5H13Z" fill="black"/>
  </svg>`
  return <Image width="100px" height="50px" src={svg} />
}