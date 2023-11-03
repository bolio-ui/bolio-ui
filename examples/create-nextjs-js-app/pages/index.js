import Head from 'next/head'
import { Page, Image, Grid, Card, Text, Container, Link } from '@bolio-ui/core'

export default function Home() {
  return (
    <div>
      <Head>
        <title>Bolio UI with NextJS</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Page>
        <Page.Header>
          <Grid.Container gap={2} justify="center">
            <Grid
              xs={12}
              sm={6}
              direction="column"
              style={{ textAlign: 'center' }}
              mt={4}
            >
              <Image
                src="/logo.jpg"
                alt="bolio ui logo"
                style={{ width: 200 }}
              />
              <Text p font={1.5} mb={1} mt={0}>
                Make your development more creative and dynamic with amazing
                tools. 🥷🏼
              </Text>
            </Grid>
          </Grid.Container>
        </Page.Header>
        <Page.Content>
          <Container>
            <Grid.Container gap={2} justify="center">
              <Grid xs={12} sm={6} md={4}>
                <Card width="100%">
                  <Text h4 my={0}>
                    Getting started
                  </Text>
                  <Text>
                    Visit the guide to better understand how to get started.
                  </Text>
                  <Link
                    icon
                    color
                    target="_blank"
                    href="https://bolio-ui.com/docs/guide/getting-started"
                  >
                    Visit documents to getting started.
                  </Link>
                </Card>
              </Grid>
              <Grid xs={12} sm={6} md={4}>
                <Card width="100%">
                  <Text h4 my={0}>
                    Github
                  </Text>
                  <Text>
                    Visit Github for issues, feature requests, contribute and
                    discussions.
                  </Text>
                  <Link
                    icon
                    color
                    target="_blank"
                    href="https://github.com/bolio-ui/bolio-ui"
                  >
                    Visit source code on GitHub.
                  </Link>
                </Card>
              </Grid>
              <Grid xs={12} sm={6} md={4}>
                <Card width="100%">
                  <Text h4 my={0}>
                    Examples
                  </Text>
                  <Text>
                    Visit the repository page for some examples to start your
                    project.
                  </Text>
                  <Link
                    icon
                    color
                    target="_blank"
                    href="https://github.com/bolio-ui/bolio-ui/tree/master/examples"
                  >
                    Visit page on github.
                  </Link>
                </Card>
              </Grid>
            </Grid.Container>
          </Container>
        </Page.Content>
        <Page.Footer>
          <Grid.Container gap={2} justify="center">
            <Text h6 my={2}>
              MADE & DESIGNED WITH BY BOLIO UI
            </Text>
          </Grid.Container>
        </Page.Footer>
      </Page>
    </div>
  )
}
