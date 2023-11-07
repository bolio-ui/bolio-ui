import React from 'react'
import { useTheme, Section, Container, Grid, Col, Text, Row } from 'core'
import { CardPlatforms } from 'src/components'

function SectionReadStarted() {
  const theme = useTheme()

  return (
    <Section
      py={5}
      style={{
        background: 'rgba(194, 95, 255, 0.2) none repeat scroll 0% 0%',
        borderTop: '1px solid',
        borderBottom: '1px solid',
        borderColor: theme.palette.accents_2
      }}
    >
      <Container>
        <Grid.Container justify="center">
          <Row justify="space-around" style={{ textAlign: 'center' }}>
            <Col span={10}>
              <Text h2 my={0} mb={1}>
                Prepared to{' '}
                <span
                  style={{
                    background:
                      'linear-gradient(rgb(194,95,255) 25%, rgb(120, 40, 201  ) 100%)',
                    backgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    WebkitBackgroundClip: 'text'
                  }}
                >
                  get started?
                </span>{' '}
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
          <Grid xs={6} sm={4} md={2} justify="center">
            <CardPlatforms
              title="Next.js"
              link="/docs/guide/bolio-ui-plus-nextjs"
              image="/img/png/home/nextjs.png"
            />
          </Grid>
          <Grid xs={6} sm={4} md={2} justify="center">
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
              title="RedwoodJS"
              link="/docs/guide/bolio-ui-plus-redwoodjs"
              image="/img/png/home/redwoodjs.png"
            />
          </Grid>
        </Grid.Container>
      </Container>
    </Section>
  )
}

export default SectionReadStarted
