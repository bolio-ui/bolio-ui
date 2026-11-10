import BulletChart from '.'

export default function Example() {
  return (
    <BulletChart
      aria-label="Revenue against quota"
      label="Revenue"
      value={270}
      target={250}
      ranges={[
        { value: 150, label: 'Poor' },
        { value: 225, label: 'Fair' },
        { value: 300, label: 'Good' }
      ]}
    />
  )
}
