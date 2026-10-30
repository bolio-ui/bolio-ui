import Spoiler from '.'

export default function Example() {
  return (
    <Spoiler maxHeight={80}>
      {Array.from({ length: 10 }, (_, i) => (
        <p key={i}>Line {i + 1}</p>
      ))}
    </Spoiler>
  )
}
