import React from 'react'
import { useTheme, Section, Container, Row, Col, Text, Card } from 'core'
import { CreditCard as CreditCardIcon } from '@bolio-ui/icons'
import Eyebrow from 'src/components/Eyebrow'
import PlaygroundHorizontal from 'src/components/PlaygroundHozitonal'

function SectionPlayground() {
  const theme = useTheme()

  return (
    <Section py={5}>
      <Container style={{ maxWidth: 1300 }}>
        <Col span={10}>
          <Eyebrow>Playground</Eyebrow>
          <Text h2 my={0} mb={1}>
            Develop pratic and more fast
          </Text>
          <Text font={1.2} mt={0}>
            Develop much faster and create your pages in a practical and simple
            way.
          </Text>
        </Col>
      </Container>
      <Container style={{ maxWidth: 1300 }}>
        <PlaygroundHorizontal
          title="Card Playground"
          scope={{ Card, Text, Row, Col, CreditCardIcon, theme }}
          code={`
<Card bordered width="100%">
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
