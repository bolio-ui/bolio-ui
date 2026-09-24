'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Section, Container, Grid, Text, Row, Col, Button } from 'core'
import { Action, useRegisterActions } from 'kbar'
import { getId } from 'core/utils/collections'
import Base from 'src/templates/Base'

function NotFound() {
  const router = useRouter()

  const homeAction: Action = React.useMemo(() => {
    return {
      id: getId(),
      name: 'Getting Started',
      section: 'Scope',
      shortcut: [],
      keywords: 'help, docs, go, started, getting started, bolio ui',
      perform: () => router.push('/docs/guide/getting-started')
    }
  }, [router])

  useRegisterActions([homeAction])

  return (
    <>
      <Base>
        <Section py={4}>
          <Container>
            <Grid.Container justify="center">
              <Row justify="space-around" style={{ textAlign: 'center' }}>
                <Col span={10}>
                  <Text h1 font={6}>
                    Oops!
                  </Text>
                  <Text h2>404 - PAGE NOT FOUND</Text>
                  <Text p font={1.2}>
                    The page you are looking for might have been removed had its
                    name changed or is temporarily unavailable.
                  </Text>
                </Col>
              </Row>
            </Grid.Container>
            <Grid.Container gap={2} justify="center" alignItems="center">
              <Grid xs={6} sm={6} md={2}>
                <Button
                  onClick={() => router.push('/docs/guide/getting-started')}
                  type="secondary-light"
                  rounded
                  width="100%"
                  style={{ textTransform: 'none' }}
                >
                  Get started
                </Button>
              </Grid>
              <Grid xs={6} sm={6} md={3}>
                <Button
                  onClick={() => router.push('/')}
                  aria-label="Link to home page"
                  type="default"
                  rounded
                  width="100%"
                  style={{ textTransform: 'none' }}
                >
                  Go to home page
                </Button>
              </Grid>
            </Grid.Container>
          </Container>
        </Section>
      </Base>
    </>
  )
}

export default NotFound
