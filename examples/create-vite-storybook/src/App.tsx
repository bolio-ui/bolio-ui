import { Container, Grid, Page, Text } from '@bolio-ui/core'
import StatusCard from './StatusCard.tsx'

function App() {
  return (
    <Page>
      <Page.Content>
        <Container>
          <Text h2>Services</Text>
          <Grid.Container gap={2}>
            <Grid xs={12} sm={4}>
              <StatusCard title="API">Responding in under 200 ms.</StatusCard>
            </Grid>
            <Grid xs={12} sm={4}>
              <StatusCard title="Database" status="warning">
                Some requests are slow.
              </StatusCard>
            </Grid>
            <Grid xs={12} sm={4}>
              <StatusCard title="Queue" status="error">
                The service is not responding.
              </StatusCard>
            </Grid>
          </Grid.Container>
        </Container>
      </Page.Content>
    </Page>
  )
}

export default App
