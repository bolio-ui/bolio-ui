import Card from '../Card'
import Grid from '.'

export default function Example() {
  return (
    <Grid.Container gap={2}>
      <Grid xs={12} md={6}>
        <Card width="100%">One</Card>
      </Grid>
      <Grid xs={12} md={6}>
        <Card width="100%">Two</Card>
      </Grid>
    </Grid.Container>
  )
}
