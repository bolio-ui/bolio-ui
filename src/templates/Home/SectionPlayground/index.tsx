import React from 'react'
import { useTheme, Section, Container, Row, Col, Text, Card, Grid } from 'core'
import { CreditCard as CreditCardIcon } from '@bolio-ui/icons'
import PlaygroundHorizontal from 'src/components/PlaygroundHozitonal'

function SectionPlayground() {
  const theme = useTheme()

  return (
    <Section py={5}>
      <Container style={{ maxWidth: 1300 }}>
        <Grid.Container justify="center">
          <Row justify="space-around" style={{ textAlign: 'center' }}>
            <Col span={10}>
              <Text h2 my={0} mb={1}>
                Develop{' '}
                <span
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, #0088e4, #64c1ff)',
                    backgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    WebkitBackgroundClip: 'text'
                  }}
                >
                  pratic
                </span>{' '}
                and{' '}
                <span
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, #0088e4, #64c1ff)',
                    backgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    WebkitBackgroundClip: 'text'
                  }}
                >
                  more fast
                </span>
              </Text>
              <Text font={1.2} mt={0}>
                Develop much faster and create your pages in a practical and
                simple way.
              </Text>
            </Col>
          </Row>
        </Grid.Container>
      </Container>
      <Container style={{ maxWidth: 1300 }}>
        <PlaygroundHorizontal
          title="Card Playground"
          scope={{ Card, Text, Row, Col, CreditCardIcon, theme }}
          code={`
<Card
  style={{
    backgroundImage:
      'linear-gradient(to right bottom, #a91cc6, #e17900, #59be23, #0088e4)'
  }}
>
  <CreditCardIcon fontSize={30} />
  <Text my={0} mt={2}>
    Card Number
  </Text>
  <Text h2 my={0} mb={2}>
    1234 1234 1234 1234
  </Text>
  <Row justify="space-around">
    <Col span={6}>
      <Text font={0.8} my={0}>
        Card Holder
      </Text>
      <Text b font={1.2} my={0}>
        Bolio UI
      </Text>
    </Col>
    <Col span={4}>
      <Text font={0.8} my={0}>
        Exp. Date
      </Text>
      <Text b font={1.2} my={0}>
        03/28
      </Text>
    </Col>
    <Col span={2}>
      <Text font={0.8} my={0}>
        CVV
      </Text>
      <Text b font={1.2} my={0}>
        999
      </Text>
    </Col>
  </Row>
</Card>
`}
        />
      </Container>
    </Section>
  )
}

export default SectionPlayground
