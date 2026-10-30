import ScrollArea from '.'

export default function Example() {
  return (
    <ScrollArea height="160px" aria-label="Release notes">
      {Array.from({ length: 20 }, (_, i) => (
        <p key={i}>Line {i + 1}</p>
      ))}
    </ScrollArea>
  )
}
