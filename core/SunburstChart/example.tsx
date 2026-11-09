import SunburstChart from '.'

export default function Example() {
  return (
    <SunburstChart
      aria-label="Stock by category"
      data={[
        {
          name: 'Fruit',
          children: [
            { name: 'Apple', value: 30 },
            { name: 'Pear', value: 20 }
          ]
        },
        { name: 'Bread', value: 40 }
      ]}
    />
  )
}
