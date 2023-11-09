import React from 'react'
import NextLink from 'next/link'
import { Text, Container, Grid, Section, Button, Snippet, useTheme } from 'core'
import SectionComponents from 'src/templates/Home/SectionComponents'

function Hero() {
  const theme = useTheme()

  return (
    <Section py={4}>
      <Container style={{ maxWidth: 1400 }}>
        <Grid.Container gap={2}>
          <Grid xs={12} sm={6} md={5} direction="column" justify="center">
            <Text b font={3} style={{ lineHeight: 1.2 }}>
              Your development{' '}
              <span
                style={{
                  backgroundImage:
                    'linear-gradient(to right, #a91cc6, #d779eb)',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  WebkitBackgroundClip: 'text'
                }}
              >
                more creative
              </span>{' '}
              and{' '}
              <span
                style={{
                  backgroundImage:
                    'linear-gradient(to right, #a91cc6, #d779eb)',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  WebkitBackgroundClip: 'text'
                }}
              >
                dynamic
              </span>{' '}
              with amazing tools for React.
            </Text>
            <Text p style={{ color: theme.palette.accents_6 }} mt={1}>
              Develop pratic and more fast with React components.
            </Text>
            <Grid.Container gap={2}>
              <Grid xs={12} sm={6} md={4} ml={-0.5}>
                <NextLink href="/docs/guide/getting-started" passHref>
                  <Button
                    type="secondary-light"
                    rounded
                    width="100%"
                    style={{ textTransform: 'none' }}
                  >
                    Get started
                  </Button>
                </NextLink>
              </Grid>
              <Grid xs={12} sm={6} md={8} ml={-0.5}>
                <Snippet
                  toastText="Code copied!"
                  toastType="secondary"
                  text="yarn add @bolio-ui/core"
                  width="100%"
                  rounded
                />
              </Grid>
            </Grid.Container>
          </Grid>
          <Grid xs={12} sm={6} md={7} direction="column" justify="center">
            <SectionComponents />
          </Grid>
        </Grid.Container>
      </Container>
    </Section>
  )
}

export default Hero
