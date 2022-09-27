import Head from 'next/head'
import { Page, Text, Image, Display, Button, Grid } from '@bolio-ui/core'

const gh = 'https://github.com/bolio-ui/bolio-ui'
const docs = 'https://bolio-ui.com'

export default function Home() {
  const redirect = (url: string) => window.open(url)

  return (
    <div>
      <Head>
        <title>Bolio UI with NextJS</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Page dotBackdrop width="800px" padding={0}>
        <Display
          title="Bolio UI"
          caption={
            <>
              Welcome to{' '}
              <Text span b>
                Bolio UI
              </Text>{' '}
              and start learning more !
            </>
          }
        >
          <Image
            src="/bolio-ui-banner.png"
            alt="bolio ui banner"
            draggable={false}
          />
        </Display>
        <Grid.Container justify="center" gap={3} mt="100px">
          <Grid xs={20} sm={7} justify="center">
            <Button
              shadow
              type="secondary-light"
              width="100%"
              onClick={() => redirect(gh)}
            >
              GitHub Repo
            </Button>
          </Grid>
          <Grid xs={0} sm={3} />
          <Grid xs={20} sm={7} justify="center">
            <Button width="100%" onClick={() => redirect(docs)}>
              Documentation Site
            </Button>
          </Grid>
        </Grid.Container>
      </Page>
    </div>
  )
}
