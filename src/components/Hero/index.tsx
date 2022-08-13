import React from 'react'
import { Text, Container, Grid, Row, Col, Section } from 'core'

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
              <Text p font={1.5}>
                {content.description}
              </Text>
            </Col>
          </Row>
        </Grid.Container>
      </Container>
    </Section>
  )
}

export default Hero
