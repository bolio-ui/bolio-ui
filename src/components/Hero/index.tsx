import React, { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Text, Container, Grid, Section, Button, Snippet, useTheme } from 'core'
import Eyebrow from 'src/components/Eyebrow'
import WindowFrame from 'src/components/WindowFrame'
import { ThemeContext } from 'core/use-theme/theme-context'
import { accents, mix, useSettings } from 'src/utils/use-settings'
import SectionHeroComponents from 'src/templates/Home/SectionHeroComponents'

// The showcase uses the secondary color, so it follows the chosen accent
function HeroShowcase() {
  const theme = useTheme()
  const { accent } = useSettings()
  const value = useMemo(() => {
    if (accent === accents[0].name) return theme
    const { color } = accents.find((item) => item.name === accent) ?? accents[0]
    return {
      ...theme,
      palette: {
        ...theme.palette,
        secondary: color,
        secondaryLight: mix(color, 255, 0.8),
        secondaryLighter: mix(color, 255, 0.5),
        secondaryDark: mix(color, 0, 0.7),
        code: color
      }
    }
  }, [theme, accent])

  return (
    <ThemeContext.Provider value={value}>
      <SectionHeroComponents />
    </ThemeContext.Provider>
  )
}

function Hero() {
  const router = useRouter()
  const theme = useTheme()

  return (
    <Section py={4}>
      <Container style={{ maxWidth: 1300 }}>
        <Grid.Container gap={2}>
          <Grid xs={12} sm={6} md={5} direction="column" justify="center">
            <Eyebrow>React UI Kit</Eyebrow>
            <Text b font={3} style={{ lineHeight: 1.2 }}>
              Your development more creative and dynamic with amazing tools for
              React
            </Text>
            <Text p style={{ color: theme.palette.accents_6 }} mt={1}>
              Develop pratic and more fast with React components.
            </Text>
            <Grid.Container gap={2}>
              <Grid xs={12} sm={6} md={4} ml={-0.5}>
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
            <WindowFrame>
              <HeroShowcase />
            </WindowFrame>
          </Grid>
        </Grid.Container>
      </Container>
    </Section>
  )
}

export default Hero
