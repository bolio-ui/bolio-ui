import React from 'react'
import NextLink from 'next/link'
import { Text, Container, Grid, Row, Col, Section, Button, Snippet } from 'core'

interface Props {
  content: { title: string; description: string }
}

export type HeroProps = Props

function Hero({ content }: Props) {
  return (
    <Section py={4}>
      <Container>
        <Grid.Container justify="center">
          <Row justify="space-around" style={{ textAlign: 'center' }}>
            <Col span={18}>
              <Text h1>{content.title}</Text>
              <Text p font={1.5} mt={0}>
                {content.description}
              </Text>
            </Col>
          </Row>
          <Row justify="space-around">
            <Col>
              <NextLink href="/guide/getting-started" passHref>
                <Button type="info" auto mr={1} mt={1.5}>
                  Get Started
                </Button>
              </NextLink>
            </Col>
            <Col>
              <Snippet text="yarn add @bolio-ui/core" mt={1.5} />
            </Col>
          </Row>
        </Grid.Container>
      </Container>
    </Section>
  )
}

export default Hero
