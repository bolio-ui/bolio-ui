import MatrixChart from '.'

export default function Example() {
  return (
    <MatrixChart
      aria-label="Deploys per service and weekday"
      data={[
        { x: 'Mon', y: 'api', value: 4 },
        { x: 'Tue', y: 'api', value: 7 },
        { x: 'Mon', y: 'web', value: 1 },
        { x: 'Tue', y: 'web', value: null }
      ]}
    />
  )
}
