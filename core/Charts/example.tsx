import { LineChart } from '.'

const data = [
  { month: 'Jan', visits: 120 },
  { month: 'Feb', visits: 180 },
  { month: 'Mar', visits: 150 },
  { month: 'Apr', visits: 220 }
]

export default function Example() {
  return (
    <LineChart
      aria-label="Visits per month"
      data={data}
      dataKey="month"
      series={[{ name: 'visits', label: 'Visits' }]}
    />
  )
}
