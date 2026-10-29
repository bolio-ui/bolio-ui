import Card from '../Card'
import Row from '../Row'
import Col from '.'

export default function Example() {
  return (
    <Row>
      <Col span={4}>
        <Card>Sidebar</Card>
      </Col>
      <Col span={8}>
        <Card>Content</Card>
      </Col>
    </Row>
  )
}
