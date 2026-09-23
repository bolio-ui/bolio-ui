import React from 'react'
import { useRouter } from 'next/router'
import {
  Section,
  Container,
  Grid,
  Row,
  Col,
  Text,
  Button,
  Card,
  useTheme
} from 'core'
import { useIsMobile } from 'src/utils/use-media-query'
import Eyebrow from 'src/components/Eyebrow'

function SectionFooterGithub() {
  const router = useRouter()
  const theme = useTheme()
  const isMobile = useIsMobile()

  return (
    <Section pb={5}>
      <Container style={{ maxWidth: 1300 }}>
        <Grid.Container gap={2} justify="center">
          <Grid xs={12} sm={12} md={12}>
            <div className="card-wrapper">
              <Card
                padding={isMobile ? 2 : 4}
                style={{
                  backgroundColor: theme.palette.accents_1,
                  border: `1px solid ${theme.palette.border}`
                }}
              >
                <Row>
                  <Col span={12}>
                    <Eyebrow>Get started</Eyebrow>
                    <Text h1 my={0} mb={0}>
                      Start coding in seconds with Bolio UI
                    </Text>
                    <Text font={1.2} mb={2}>
                      Get started with Bolio UI and learn by exploring
                      interactive examples.
                    </Text>
                    <Button
                      onClick={() => router.push('/docs/guide/getting-started')}
                      type="secondary-light"
                      rounded
                      style={{ textTransform: 'none' }}
                    >
                      Get started
                    </Button>
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
