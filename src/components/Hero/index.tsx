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
        </Grid.Container>
        <Grid.Container gap={2} justify="center" alignItems="center">
          <Grid xs={12} sm={6} md={2}>
            <NextLink href={'/guide/getting-started'} passHref>
              <Button type="info" width="100%">
                Get Started
              </Button>
            </NextLink>
          </Grid>
          <Grid xs={12} sm={6} md={4}>
            <Snippet
              toastText="Code copied!"
              toastType="secondary"
              text="yarn add @bolio-ui/core"
              width={'100%'}
            />
          </Grid>
        </Grid.Container>
      </Container>
    </Section>
  )
}

export default Hero
