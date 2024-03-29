import React from 'react'
import { Section, Container, Grid, Col, Text, Row } from 'core'
import { CardPlatforms } from 'src/components'

function SectionFooterGithub() {
  return (
    <Section py={5}>
      <Container style={{ maxWidth: 1300 }}>
        <Grid.Container justify="center">
          <Row justify="space-around" style={{ textAlign: 'center' }}>
            <Col span={10}>
              <Text h2 my={0} mb={1}>
                Prepared to{' '}
                <span
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, #e17900, #fdb766)',
                    backgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    WebkitBackgroundClip: 'text'
                  }}
                >
                  get started?
                </span>
              </Text>
              <Text font={1.2} mt={0}>
                Bolio UI is compatible with a wide range platforms. You can
                begin using it right away with Next.js, Gatsby.js, RedwoodJS,
                Vite, or Remix by following the introductory guide.
              </Text>
            </Col>
          </Row>
        </Grid.Container>
      </Container>
      <Container>
        <Grid.Container gap={2} justify="center">
          <Grid xs={4} sm={4} md={2} justify="center">
            <CardPlatforms
              title="Next.js"
              link="/docs/guide/bolio-ui-plus-nextjs"
              image="/img/png/home/nextjs.png"
            />
          </Grid>
          <Grid xs={4} sm={4} md={2} justify="center">
            <CardPlatforms
              title="Vite"
              link="/docs/guide/bolio-ui-plus-vite"
              image="/img/png/home/vite.png"
            />
          </Grid>
          <Grid xs={4} sm={4} md={2} justify="center">
            <CardPlatforms
              title="Remix"
              link="/docs/guide/bolio-ui-plus-remix"
              image="/img/png/home/remix.png"
            />
          </Grid>
          <Grid xs={4} sm={4} md={2} justify="center">
            <CardPlatforms
              title="Gatsby"
              link="/docs/guide/bolio-ui-plus-gatsby"
              image="/img/png/home/gatsby.png"
            />
          </Grid>
          <Grid xs={4} sm={4} md={2} justify="center">
            <CardPlatforms
              title="Redwood"
              link="/docs/guide/bolio-ui-plus-redwoodjs"
              image="/img/png/home/redwoodjs.png"
            />
          </Grid>
        </Grid.Container>
      </Container>
    </Section>
  )
}

export default SectionFooterGithub
