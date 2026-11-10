import Sparkline from '.'

export default function Example() {
  return (
    <Sparkline
      aria-label="Weekly visits, rising"
      data={[12, 18, 14, 22, 30, 28, 41]}
    />
  )
}
