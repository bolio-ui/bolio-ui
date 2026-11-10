import Heatmap from '.'

export default function Example() {
  return (
    <Heatmap
      aria-label="Commits from January to March 2026"
      startDate="2026-01-01"
      endDate="2026-03-31"
      data={{
        '2026-01-05': 1,
        '2026-01-12': 5,
        '2026-02-03': 4,
        '2026-02-17': 8,
        '2026-03-10': 6
      }}
    />
  )
}
