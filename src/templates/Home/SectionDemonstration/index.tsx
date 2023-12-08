import React from 'react'
import NextLink from 'next/link'
import {
  Section,
  Container,
  Grid,
  Col,
  Text,
  Snippet,
  Button,
  Spacer,
  Card,
  Image,
  Link
} from 'core'

function SectionDemonstration() {
  return (
    <Section py={5}>
      {/* <img
        src="/img/png/home/hero-bg.png"
        style={{
          position: 'absolute',
          width: '120%',
          bottom: '27%',
          zIndex: -1
        }}
      /> */}
      <Container style={{ maxWidth: 1300 }}>
        <Grid.Container gap={2}>
          <Grid xs={12} md={6} direction="column" justify="center">
            <Text h2 my={0} mb={1}>
              Build{' '}
              <span
                style={{
                  backgroundImage:
                    'linear-gradient(to right, #59be23, #a2e67e)',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  WebkitBackgroundClip: 'text'
                }}
              >
                even faster
              </span>{' '}
              with Bolio UI
            </Text>
            <Text font={1.2} mt={0}>
              Build your next website even faster with premade responsive
              components designed and built by Bolio UI.
            </Text>
            <Grid.Container gap={2} xs={12} alignItems="center">
              <Grid xs={12} sm={4}>
                <NextLink href="/docs/guide/getting-started" passHref>
                  <Button
                    type="secondary-light"
                    rounded
                    w="100%"
                    style={{ textTransform: 'none' }}
                  >
                    Get started
                  </Button>
                </NextLink>
              </Grid>
              <Grid xs={12} sm={8}>
                <Snippet
                  toastText="Code copied!"
                  toastType="secondary"
                  text="yarn add @bolio-ui/core"
                  width="100%"
                  rounded
                />
              </Grid>
            </Grid.Container>
          </Grid>
          <Grid xs={12} md={6}>
            <Grid xs={12} md={12} justify="center">
              <Link
                href="/docs/components/text"
                aria-label="Link to Documents Text"
              >
                <Card
                  style={{
                    background:
                      'rgba(194, 95, 255, 0.2) none repeat scroll 0% 0%'
                  }}
                >
                  <Image
                    src="/img/png/home/typography.png"
                    alt="text"
                    draggable={false}
                  />
                  <Card.Content>
                    <Text b>Text</Text>
                  </Card.Content>
                </Card>
              </Link>
              <Spacer width={2} />
              <Link
                href="/docs/components/icons"
                aria-label="Link to Documents Icons"
              >
                <Card
                  style={{
                    background:
                      'rgba(194, 95, 255, 0.2) none repeat scroll 0% 0%'
                  }}
                >
                  <Image
                    src="/img/png/home/icons.png"
                    alt="icons"
                    draggable={false}
                  />
                  <Card.Content>
                    <Text b>Icons</Text>
                  </Card.Content>
                </Card>
              </Link>
              <Spacer width={2} />
              <Link
                href="/docs/components/button"
                aria-label="Link to Documents Button"
              >
                <Card
                  style={{
                    background:
                      'rgba(194, 95, 255, 0.2) none repeat scroll 0% 0%'
                  }}
                >
                  <Image
                    src="/img/png/home/button.png"
                    alt="button"
                    draggable={false}
                  />
                  <Card.Content>
                    <Text b>Button</Text>
                  </Card.Content>
                </Card>
              </Link>
            </Grid>
          </Grid>
        </Grid.Container>
        <Grid.Container gap={2} justify="center">
          <Grid mt={2}>
            <Col>
              <NextLink href="/docs/components/" passHref>
                <Button
                  type="secondary-light"
                  rounded
                  style={{ textTransform: 'none' }}
                >
                  Explore more components
                </Button>
              </NextLink>
            </Col>
          </Grid>
        </Grid.Container>
      </Container>
    </Section>
  )
}

export default SectionDemonstration
