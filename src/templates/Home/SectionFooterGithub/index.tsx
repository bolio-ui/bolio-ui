import React from 'react'
import NextLink from 'next/link'
import {
  Section,
  Container,
  Grid,
  Col,
  Text,
  Row,
  Button,
  Card,
  useTheme
} from 'core'
import { useIsMobile } from 'src/utils/use-media-query'

function SectionFooterGithub() {
  const theme = useTheme()
  const isMobile = useIsMobile()

  return (
    <Section pb={5}>
      <Container>
        <Grid.Container gap={2} justify="center">
          <Grid xs={12} sm={12} md={12}>
            <div className="card-wrapper">
              <Card
                padding={isMobile ? 2 : 5}
                style={{
                  backgroundColor: 'transparent',
                  backdropFilter: 'saturate(180%) blur(10px)',
                  boxShadow: 'rgba(255, 255, 255, 0.1) 0 0 20px 0'
                }}
                className="card-box"
              >
                <Row justify="space-around" style={{ textAlign: 'center' }}>
                  <Col span={12}>
                    <Text h1 my={0} mb={0}>
                      <span
                        style={{
                          backgroundImage:
                            'linear-gradient(to right, #a91cc6, #d779eb)',
                          backgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          WebkitBackgroundClip: 'text'
                        }}
                      >
                        Start coding
                      </span>{' '}
                      in seconds with Bolio UI
                    </Text>
                    <Text font={1.2} mb={2}>
                      Get started with Bolio UI and learn by exploring
                      interactive examples.
                    </Text>
                    <NextLink href="/docs/guide/getting-started" passHref>
                      <Button
                        type="secondary-light"
                        rounded
                        style={{ textTransform: 'none' }}
                      >
                        Get started
                      </Button>
                    </NextLink>
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
