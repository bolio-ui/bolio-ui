import React from 'react'
import Link from 'next/link'
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
          <Link href={'/guide/introduction'} passHref key={1}>
            Teste
          </Link>
          <Link href={'/components/introduction'} passHref key={1}>
            Teste
          </Link>
          <Link href={'/hooks/introduction'} passHref key={1}>
            Hooks
          </Link>
          <Grid.Container gap={2} justify="flex-start">
            <Grid xs={24} sm={12} md={8}>
              <CardBox
                title="Built in Components"
                description="We have provided a lot of useful build in components to make it easy."
                icon="Briefcase"
              />
            </Grid>
            <Grid xs={24} sm={12} md={8}>
              <CardBox
                title="Modern Design"
                description="Responsive, theme-based style props for building design systems with React."
                icon="Layout"
              />
            </Grid>
            <Grid xs={24} sm={12} md={8}>
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
