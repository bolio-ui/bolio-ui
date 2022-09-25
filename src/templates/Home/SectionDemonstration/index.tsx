import React from 'react'
import NextLink from 'next/link'
import {
  useTheme,
  Section,
  Container,
  Grid,
  Row,
  Col,
  Text,
  Snippet,
  Button,
  Spacer,
  Card,
  Image,
  Link
} from 'core'

function SectionCTA() {
  const theme = useTheme()
  return (
    <>
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
          <Grid.Container gap={2} justify="center" alignItems="center">
            <Grid xs={12} md={6}>
              <Col>
                <Text h2 my={0} mb={1}>
                  Build even faster with Bolio UI
                </Text>
                <Text font={1.2} mt={0}>
                  Build your next website even faster with premade responsive
                  components designed and built by Bolio UI.
                </Text>
                <Col>
                  <Row>
                    <NextLink href={'/docs/guide/getting-started'} passHref>
                      <Button
                        style={{
                          background: '#c25fff',
                          color: theme.palette.foreground
                        }}
                      >
                        Get Started
                      </Button>
                    </NextLink>
                    <Spacer w={2} />
                    <Snippet
                      toastText="Code copied!"
                      toastType="secondary"
                      text="yarn add @bolio-ui/core"
                      width="100%"
                      style={{
                        background:
                          'rgba(194, 95, 255, 0.2) none repeat scroll 0% 0%'
                      }}
                    />
                  </Row>
                </Col>
              </Col>
            </Grid>
            <Grid xs={12} md={6}>
              <Row>
                <Link href="/docs/components/text">
                  <Card
                    style={{
                      background:
                        'rgba(194, 95, 255, 0.2) none repeat scroll 0% 0%'
                    }}
                  >
                    <Image src="/img/png/home/typography.png" />
                    <Card.Content>
                      <Text b>Text</Text>
                    </Card.Content>
                  </Card>
                </Link>
                <Spacer width={2} />
                <Link href="/docs/components/icons">
                  <Card
                    style={{
                      background:
                        'rgba(194, 95, 255, 0.2) none repeat scroll 0% 0%'
                    }}
                  >
                    <Image src="/img/png/home/icons.png" />
                    <Card.Content>
                      <Text b>Icons</Text>
                    </Card.Content>
                  </Card>
                </Link>
                <Spacer width={2} />
                <Link href="/docs/components/button">
                  <Card
                    style={{
                      background:
                        'rgba(194, 95, 255, 0.2) none repeat scroll 0% 0%'
                    }}
                  >
                    <Image src="/img/png/home/button.png" draggable={false} />
                    <Card.Content>
                      <Text b>Button</Text>
                    </Card.Content>
                  </Card>
                </Link>
              </Row>
            </Grid>
            <Grid mt={2}>
              <Col>
                <NextLink href={'/docs/components/'} passHref>
                  <Button
                    style={{
                      background: '#c25fff',
                      color: theme.palette.foreground
                    }}
                  >
                    More components
                  </Button>
                </NextLink>
              </Col>
            </Grid>
          </Grid.Container>
        </Container>
      </Section>
    </>
  )
}

export default SectionCTA
