import WaffleChart from '.'

export default function Example() {
  return (
    <WaffleChart
      aria-label="Browser share"
      data={[
        { name: 'Chrome', value: 65 },
        { name: 'Safari', value: 25 },
        { name: 'Other', value: 10 }
      ]}
    />
  )
}
