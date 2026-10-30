import Card from '../Card'
import Col from '../Col'
import Row from '.'

export default function Example() {
  return (
    <Row>
      <Col span={4}>
        <Card>One</Card>
      </Col>
      <Col span={4}>
        <Card>Two</Card>
      </Col>
      <Col span={4}>
        <Card>Three</Card>
      </Col>
    </Row>
  )
}
