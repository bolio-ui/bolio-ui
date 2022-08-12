import React from 'react'
import { Text, Grid, Row, Col, useTheme } from 'core'

interface Props {
  content: { title: string; description: string }
}

export type HeroProps = Props

function Hero({ content }: Props) {
  const theme = useTheme()

  return (
    <>
      <div className="container">
        <Grid.Container justify="center">
          <Row justify="space-around">
            <Col span={8}>
              <Text h1>{content.title}</Text>
              <Text p font={1.5}>
                {content.description}
              </Text>
            </Col>
            <Col span={4}>
              <Text h1>{content.title}</Text>
              <Text p font={1.5}>
                {content.description}
              </Text>
            </Col>
          </Row>
        </Grid.Container>
      </div>
      <style jsx>{`
        .container {
          width: 100%;
          max-width: ${theme.layout.pageWidthWithMargin};
          margin-left: auto;
          margin-right: auto;
          padding: ${theme.layout.pageMargin};
        }
      `}</style>
    </>
  )
}

export default Hero
