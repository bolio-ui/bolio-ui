import Diff from '.'

export default function Example() {
  return (
    <Diff
      previousValue={'const total = price * 2\nreturn total'}
      currentValue={'const total = price * quantity\nreturn total'}
    />
  )
}
