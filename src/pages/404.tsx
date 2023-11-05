import React from 'react'
import NextLink from 'next/link'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { Section, Container, Grid, Text, Row, Col, Button } from 'core'
import { Action, useRegisterActions } from 'kbar'
import { getId } from 'core/utils/collections'
import Base from 'src/templates/Base'

function Home() {
  const router = useRouter()

  const homeAction: Action = React.useMemo(() => {
    return {
      id: getId(),
      name: 'Getting Started',
      section: 'Scope',
      shortcut: [],
      keywords: 'help, docs, go, started, getting started, bolio ui',
      perform: () => router.push('/docs/guide/getting-started')
    }
  }, [router])

  useRegisterActions([homeAction])

  return (
    <>
      <NextSeo
        title={
          '404: Page not found | Bolio UI - Amazing, modern and creative tools for React UI'
        }
        description={
          'Make your development more amazing, modern and creative with tools for React.'
        }
        openGraph={{
          url: `${router.pathname}`,
          title:
            '404: Page not found | Bolio UI - Amazing, modern and creative tools for React UI',
          description:
            'Make your development more amazing, modern and creative with tools for React.',
          images: [
            {
              url: '/img/cover.png',
              width: 1200,
              height: 630,
              alt: '404: Not | Bolio UI - Amazing, modern and creative tools for React UI'
            }
          ]
        }}
      />
      <Base>
        <Section py={4}>
          <Container>
            <Grid.Container justify="center">
              <Row justify="space-around" style={{ textAlign: 'center' }}>
                <Col span={10}>
                  <Text h1 font={6}>
                    Oops!
                  </Text>
                  <Text h2>404 - PAGE NOT FOUND</Text>
                  <Text p font={1.2}>
                    The page you are looking for might have been removed had its
                    name changed or is temporarily unavailable.
                  </Text>
                </Col>
              </Row>
            </Grid.Container>
            <Grid.Container gap={2} justify="center" alignItems="center">
              <Grid xs={6} sm={6} md={2}>
                <NextLink href="/docs/guide/getting-started" passHref>
                  <Button
                    type="secondary-light"
                    rounded
                    width="100%"
                    style={{ textTransform: 'none' }}
                  >
                    Get started
                  </Button>
                </NextLink>
              </Grid>
              <Grid xs={6} sm={6} md={3}>
                <NextLink href="/" passHref>
                  <Button
                    type="default"
                    rounded
                    width="100%"
                    style={{ textTransform: 'none' }}
                  >
                    Go to homepage
                  </Button>
                </NextLink>
              </Grid>
            </Grid.Container>
          </Container>
        </Section>
      </Base>
    </>
  )
}

export default Home
