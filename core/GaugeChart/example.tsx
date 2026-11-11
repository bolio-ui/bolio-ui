import GaugeChart from '.'

export default function Example() {
  return (
    <GaugeChart
      aria-label="CPU load"
      value={64}
      valueFormatter={(value) => `${value}%`}
    />
  )
}
