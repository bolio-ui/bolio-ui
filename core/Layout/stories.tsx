import { Story, Meta } from '@storybook/react'
import Section from '../Section'
import Container from '../Container'
import Row from '../Row'
import Col from '../Col'
import Display from '../Display'
import Card from '../Card'
import Text from '../Text'

export default {
  title: 'Layout/Page structure',
  parameters: { layout: 'fullscreen' }
} as Meta

/**
 * The structure to build a page:
 * Section (a band of the page, can have a background)
 *   Container (limits the width and centers)
 *     Row (a flex row)
 *       Col (span of 12, can be pushed with offset)
 */
export const Overview: Story = () => (
  <>
    <Section bg="#f5f5f5" style={{ padding: '48px 0' }}>
      <Container>
        <Row align="middle">
          <Col span={6}>
            <Text h2>A page with Bolio UI</Text>
            <Text>
              Section, Container, Row and Col build the layout, and the other
              components fill it.
            </Text>
          </Col>
          <Col span={6}>
            <Display caption="Display puts a caption on any content">
              <img
                src="/logo.svg"
                alt="Bolio UI logo"
                width={120}
                height={120}
              />
            </Display>
          </Col>
        </Row>
      </Container>
    </Section>
    <Section style={{ padding: '48px 0' }}>
      <Container>
        <Row>
          <Col span={4}>
            <Card>
              <Text b>One third</Text>
            </Card>
          </Col>
          <Col span={4}>
            <Card>
              <Text b>One third</Text>
            </Card>
          </Col>
          <Col span={4}>
            <Card>
              <Text b>One third</Text>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col span={6} offset={3}>
            <Card>
              <Text b>Centered with an offset</Text>
            </Card>
          </Col>
        </Row>
      </Container>
    </Section>
  </>
)
