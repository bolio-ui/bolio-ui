import type { StoryFn, Meta } from '@storybook/react-vite'
import Row from '.'
import Col from '../Col'
import Card from '../Card'
import Text from '../Text'

export default {
  title: 'Layout/Row',
  component: Row
} as Meta

const Cell = ({ children }: { children: React.ReactNode }) => (
  <Card>
    <Text small>{children}</Text>
  </Card>
)

export const Default: StoryFn = () => (
  <Row>
    <Col span={4}>
      <Cell>span 4</Cell>
    </Col>
    <Col span={4}>
      <Cell>span 4</Cell>
    </Col>
    <Col span={4}>
      <Cell>span 4</Cell>
    </Col>
  </Row>
)

export const Justify: StoryFn = () => (
  <>
    {(['start', 'center', 'end', 'space-between', 'space-around'] as const).map(
      (justify) => (
        <div key={justify} style={{ marginBottom: 16 }}>
          <Text small>justify="{justify}"</Text>
          <Row justify={justify}>
            <Col span={3}>
              <Cell>span 3</Cell>
            </Col>
            <Col span={3}>
              <Cell>span 3</Cell>
            </Col>
          </Row>
        </div>
      )
    )}
  </>
)

export const Align: StoryFn = () => (
  <>
    {(['top', 'middle', 'bottom'] as const).map((align) => (
      <div key={align} style={{ marginBottom: 16 }}>
        <Text small>align="{align}"</Text>
        <Row align={align} style={{ height: 120 }}>
          <Col span={6}>
            <Cell>short</Cell>
          </Col>
          <Col span={6}>
            <Cell>
              A taller cell
              <br />
              with two lines
            </Cell>
          </Col>
        </Row>
      </div>
    ))}
  </>
)

export const Gap: StoryFn = () => (
  <Row gap={2}>
    <Col span={6}>
      <Cell>gap 2</Cell>
    </Col>
    <Col span={6}>
      <Cell>gap 2</Cell>
    </Col>
  </Row>
)

export const AsList: StoryFn = () => (
  <Row component="ul" style={{ listStyle: 'none', padding: 0 }}>
    <Col component="li" span={6}>
      <Cell>first item</Cell>
    </Col>
    <Col component="li" span={6}>
      <Cell>second item</Cell>
    </Col>
  </Row>
)
