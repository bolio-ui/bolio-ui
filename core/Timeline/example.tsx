import Timeline from '.'

export default function Example() {
  return (
    <Timeline>
      <Timeline.Item title="Order placed" time="Mon, 9:41">
        We received your order and are preparing it.
      </Timeline.Item>
      <Timeline.Item title="Shipped" time="Tue, 14:05" />
    </Timeline>
  )
}
