import SegmentedControl from '.'

export default function Example() {
  return (
    <SegmentedControl initialValue="week" aria-label="Period">
      <SegmentedControl.Item value="day">Day</SegmentedControl.Item>
      <SegmentedControl.Item value="week">Week</SegmentedControl.Item>
      <SegmentedControl.Item value="month">Month</SegmentedControl.Item>
    </SegmentedControl>
  )
}
