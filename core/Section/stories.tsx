import type { StoryFn, Meta } from '@storybook/react-vite'
import Section from '.'
import Container from '../Container'
import Text from '../Text'

export default {
  title: 'Layout/Section',
  component: Section
} as Meta

export const Default: StoryFn = () => (
  <Section>
    <Text>
      A Section groups a part of the page. Without a background it is
      transparent.
    </Text>
  </Section>
)

export const Background: StoryFn = () => (
  <>
    <Section bg="#f5f5f5" style={{ padding: 24 }}>
      <Container>
        <Text>A light band</Text>
      </Container>
    </Section>
    <Section bg="#0072f6" style={{ padding: 24, color: '#fff' }}>
      <Container>
        <Text>A colored band</Text>
      </Container>
    </Section>
  </>
)
