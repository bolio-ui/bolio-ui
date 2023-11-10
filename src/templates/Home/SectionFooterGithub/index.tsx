import React from 'react'
import {
  Section,
  Container,
  Grid,
  Col,
  Text,
  Row,
  Link,
  Card,
  useTheme
} from 'core'

function SectionFooterGithub() {
  const theme = useTheme()

  return (
    <Section pb={5}>
      <Container>
        <Grid.Container gap={2} justify="center">
          <Grid xs={12} sm={12} md={12}>
            <div className="card-wrapper">
              <Card
                padding={2}
                style={{
                  backgroundColor: 'transparent',
                  backdropFilter: 'saturate(180%) blur(10px)',
                  width: '100%'
                }}
                className="card-box"
              >
                <Row justify="space-around" style={{ textAlign: 'center' }}>
                  <Col span={10}>
                    <Text h1 my={0} mb={1}>
                      <span
                        style={{
                          backgroundImage:
                            'linear-gradient(to right, #d60867, #f66eab)',
                          backgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          WebkitBackgroundClip: 'text'
                        }}
                      >
                        Start coding
                      </span>{' '}
                      in seconds with Codespaces
                    </Text>
                    <Text font={1.2} mt={0}>
                      Go to any repository and open your own Codespaces
                      environment in seconds.
                    </Text>
                  </Col>
                </Row>
              </Card>
            </div>
          </Grid>
        </Grid.Container>
      </Container>
      <style jsx>{`
        .card-wrapper {
          width: 100%;
        }
        .card-wrapper :global(.card-box) {
          box-shadow: ${theme.type === 'dark'
            ? `0 0 0 1px ${theme.palette.foreground}`
            : '0px 4px 8px rgba(0,0,0,0.12)'};
        }
      `}</style>
    </Section>
  )
}

export default SectionFooterGithub
