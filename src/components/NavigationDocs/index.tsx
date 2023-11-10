import React from 'react'
import NextLink from 'next/link'
import { Grid, Card, Row, Text } from 'core'
import {
  ChevronRight as ChevronRightIcon,
  ChevronLeft as ChevronLeftIcon
} from '@bolio-ui/icons'
import { useIsMobile } from 'src/utils/use-media-query'

export interface NavigationDocsProps {
  next: Docs
  previous: Docs
}

export interface Docs {
  name: string
  url: string
}

function NavigationDocs({ next, previous }: NavigationDocsProps) {
  const isMobile = useIsMobile()

  return (
    <Grid.Container justify="center">
      <Grid xs={6} sm={6} md={6} justify="flex-start">
        {previous && (
          <NextLink href={previous.url} passHref>
            <Card
              padding={isMobile ? 0 : 1}
              mt={2}
              style={{
                backgroundColor: 'transparent',
                backdropFilter: 'saturate(180%) blur(10px)',
                cursor: 'pointer'
              }}
              hoverable
            >
              <Row align="middle">
                <ChevronLeftIcon />
                <Text ml={1}>{previous.name}</Text>
              </Row>
            </Card>
          </NextLink>
        )}
      </Grid>
      <Grid xs={6} sm={6} md={6} justify="flex-end">
        {next && (
          <NextLink href={next.url} passHref>
            <Card
              mt={2}
              padding={isMobile ? 0 : 1}
              style={{
                backgroundColor: 'transparent',
                backdropFilter: 'saturate(180%) blur(10px)',
                cursor: 'pointer'
              }}
              hoverable
            >
              <Row align="middle">
                <Text mr={1}>{next.name}</Text>
                <ChevronRightIcon />
              </Row>
            </Card>
          </NextLink>
        )}
      </Grid>
    </Grid.Container>
  )
}

export default NavigationDocs
