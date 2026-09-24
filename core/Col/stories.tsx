import type { StoryFn, Meta } from '@storybook/react-vite'
import Col from '.'
import Row from '../Row'
import Card from '../Card'
import Text from '../Text'

export default {
  title: 'Layout/Col',
  component: Col
} as Meta

const Cell = ({ children }: { children: React.ReactNode }) => (
  <Card>
    <Text small>{children}</Text>
  </Card>
)

export const Spans: StoryFn = () => (
  <>
    <Row>
      <Col span={12}>
        <Cell>span 12</Cell>
      </Col>
    </Row>
    <Row>
      <Col span={6}>
        <Cell>span 6</Cell>
      </Col>
      <Col span={6}>
        <Cell>span 6</Cell>
      </Col>
    </Row>
    <Row>
      <Col span={4}>
        <Cell>span 4</Cell>
      </Col>
      <Col span={8}>
        <Cell>span 8</Cell>
      </Col>
    </Row>
    <Row>
      <Col span={3}>
        <Cell>span 3</Cell>
      </Col>
      <Col span={3}>
        <Cell>span 3</Cell>
      </Col>
      <Col span={3}>
        <Cell>span 3</Cell>
      </Col>
      <Col span={3}>
        <Cell>span 3</Cell>
      </Col>
    </Row>
  </>
)

export const Offset: StoryFn = () => (
  <Row>
    <Col span={4} offset={4}>
      <Cell>span 4, offset 4</Cell>
    </Col>
  </Row>
)
