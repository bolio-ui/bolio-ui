import {
  BarsList,
  Button,
  Card,
  Container,
  Grid,
  JsonViewer,
  Page,
  Schedule,
  Sparkline,
  Stat,
  Text,
  useModals,
  useToasts
} from '@bolio-ui/core'
// Charts live in their own entry because they need the recharts package
import { AreaChart, DonutChart } from '@bolio-ui/core/charts'
import { events, kpis, pages, sources, traffic } from './data.ts'

const total = sources.reduce((sum, source) => sum + source.value, 0)

function App() {
  const modals = useModals()
  const { setToast } = useToasts()

  return (
    <Page>
      <Page.Header>
        <Container>
          <Grid.Container justify="space-between" alignItems="center">
            <Text h2 my={2}>
              Dashboard
            </Text>
            <Grid.Container gap={1} width="auto">
              <Button
                auto
                onClick={() =>
                  modals.open({
                    title: 'Raw data',
                    subtitle: 'The numbers behind the charts',
                    children: (
                      <JsonViewer value={{ traffic, sources, pages }} withCopyButton />
                    )
                  })
                }
              >
                View raw data
              </Button>
              <Button
                auto
                type="error"
                onClick={() =>
                  modals.openConfirm({
                    title: 'Delete this report?',
                    children: 'The numbers stay, but the report is removed.',
                    onConfirm: () =>
                      setToast({ text: 'Report deleted', type: 'success' })
                  })
                }
              >
                Delete report
              </Button>
            </Grid.Container>
          </Grid.Container>
        </Container>
      </Page.Header>

      <Page.Content>
        <Container>
          <Grid.Container gap={2}>
            {kpis.map((kpi) => (
              <Grid key={kpi.label} xs={24} md={8}>
                <Card bordered width="100%">
                  <Stat
                    label={kpi.label}
                    value={kpi.value}
                    change={kpi.change}
                    extra={
                      <Sparkline
                        trend
                        aria-label={`${kpi.label}, last six months`}
                        data={kpi.trend}
                      />
                    }
                  />
                </Card>
              </Grid>
            ))}

            <Grid xs={24} md={16}>
              <Card bordered width="100%">
                <Text h4 mt={0}>
                  Traffic
                </Text>
                <AreaChart
                  aria-label="Visits and sign ups per month"
                  data={traffic}
                  dataKey="month"
                  series={[
                    { name: 'visits', label: 'Visits' },
                    { name: 'signups', label: 'Sign ups' }
                  ]}
                  withLegend
                  height={280}
                />
              </Card>
            </Grid>
            <Grid xs={24} md={8}>
              <Card bordered width="100%">
                <Text h4 mt={0}>
                  Sources
                </Text>
                <DonutChart
                  aria-label="Visits by source"
                  data={sources}
                  chartLabel={total.toLocaleString('en-US')}
                  size={200}
                  withLegend
                />
              </Card>
            </Grid>

            <Grid xs={24} md={10}>
              <Card bordered width="100%">
                <Text h4 mt={0}>
                  Top pages
                </Text>
                <BarsList barsLabel="Page" valueLabel="Views" data={pages} />
              </Card>
            </Grid>
            <Grid xs={24} md={14}>
              <Card bordered width="100%">
                <Text h4 mt={0}>
                  This week
                </Text>
                <Schedule
                  events={events}
                  height={300}
                  views={['day', 'week']}
                  onEventClick={(event) =>
                    modals.open({
                      title: event.title,
                      children: event.allDay
                        ? 'All day'
                        : `${event.start.toLocaleTimeString([], { timeStyle: 'short' })} to ${event.end.toLocaleTimeString([], { timeStyle: 'short' })}`
                    })
                  }
                />
              </Card>
            </Grid>
          </Grid.Container>
        </Container>
      </Page.Content>
    </Page>
  )
}

export default App
