import React from 'react'
import Base from 'src/templates/Base'
import Hero from 'src/components/Hero'
import CardBox from 'src/components/CardBox'
import { Section, Container, Grid, useTheme } from 'core'

function Home() {
  const theme = useTheme()

  return (
    <Base>
      <Hero
        content={{
          title: 'Bolio UI',
          description:
            'Make your development more creative and dynamic with amazing tools for React. 🥷🏼'
        }}
      />
      <Section bg={theme.palette.accents_1} py={5}>
        <Container>
          <Grid.Container gap={2} justify="flex-start">
            <Grid xs={12} sm={6} md={4}>
              <CardBox
                title="Built in Components"
                description="We have provided a lot of useful build in components to make it easy."
                icon="Briefcase"
              />
            </Grid>
            <Grid xs={12} sm={6} md={4}>
              <CardBox
                title="Modern Design"
                description="Responsive, theme-based style props for building design systems with React."
                icon="Layout"
              />
            </Grid>
            <Grid xs={12} sm={6} md={4}>
              <CardBox
                title="Well Documented"
                description="Documented organized way and its customization instruction easy for all."
                icon="FileText"
              />
            </Grid>
          </Grid.Container>
        </Container>
      </Section>
    </Base>
  )
}

export default Home
