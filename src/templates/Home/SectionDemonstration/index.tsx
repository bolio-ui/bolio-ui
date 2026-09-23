import React from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import {
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
  Link,
  useTheme
} from 'core'
import Eyebrow from 'src/components/Eyebrow'

function SectionDemonstration() {
  const router = useRouter()
  const theme = useTheme()

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
            <Eyebrow>Components</Eyebrow>
            <Text h2 my={0} mb={1}>
              Build even faster with Bolio UI
            </Text>
            <Text font={1.2} mt={0}>
              Build your next website even faster with premade responsive
              components designed and built by Bolio UI.
            </Text>
            <Grid.Container gap={2} xs={12} alignItems="center">
              <Grid xs={12} sm={4}>
                <Button
                  onClick={() => router.push('/docs/guide/getting-started')}
                  type="secondary-light"
                  rounded
                  w="100%"
                  style={{ textTransform: 'none' }}
                >
                  Get started
                </Button>
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
            <Grid xs={12} md={12}>
              <Row justify="center">
                <Link href="/docs/components/text">
                  <Card
                    style={{
                      backgroundColor: theme.palette.accents_1,
                      border: `1px solid ${theme.palette.border}`
                    }}
                  >
                    <Image
                      src="/img/png/home/typography.png"
                      alt="text doc component"
                      width={180}
                      height={121}
                      priority
                      style={{
                        height: 'auto',
                        borderTopLeftRadius: theme.layout.radius,
                        borderTopRightRadius: theme.layout.radius
                      }}
                    />
                    <Card.Content>
                      <Text b>Text</Text>
                    </Card.Content>
                  </Card>
                </Link>
                <Spacer width={2} />
                <Link href="/docs/components/icons">
                  <Card
                    style={{
                      backgroundColor: theme.palette.accents_1,
                      border: `1px solid ${theme.palette.border}`
                    }}
                  >
                    <Image
                      src="/img/png/home/icons.png"
                      alt="icons doc component"
                      width={180}
                      height={121}
                      priority
                      style={{
                        height: 'auto',
                        borderTopLeftRadius: theme.layout.radius,
                        borderTopRightRadius: theme.layout.radius
                      }}
                    />
                    <Card.Content>
                      <Text b>Icons</Text>
                    </Card.Content>
                  </Card>
                </Link>
                <Spacer width={2} />
                <Link href="/docs/components/button">
                  <Card
                    style={{
                      backgroundColor: theme.palette.accents_1,
                      border: `1px solid ${theme.palette.border}`
                    }}
                  >
                    <Image
                      src="/img/png/home/button.png"
                      alt="buttond doc component"
                      width={180}
                      height={121}
                      priority
                      style={{
                        height: 'auto',
                        borderTopLeftRadius: theme.layout.radius,
                        borderTopRightRadius: theme.layout.radius
                      }}
                    />
                    <Card.Content>
                      <Text b>Button</Text>
                    </Card.Content>
                  </Card>
                </Link>
              </Row>
            </Grid>
          </Grid>
        </Grid.Container>
        <Grid.Container gap={2} justify="center">
          <Grid mt={2}>
            <Col>
              <Button
                onClick={() => router.push('/docs/components/')}
                type="secondary-light"
                rounded
                style={{ textTransform: 'none' }}
              >
                Explore more components
              </Button>
            </Col>
          </Grid>
        </Grid.Container>
      </Container>
    </Section>
  )
}

export default SectionDemonstration
