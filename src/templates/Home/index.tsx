import React from 'react'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { Section, Container, Grid } from 'core'
import { Action, useRegisterActions } from 'kbar'
import { getId } from 'core/utils/collections'
import Base from 'src/templates/Base'
import Hero from 'src/components/Hero'
import CardBox from 'src/components/CardBox'
import SectionPlayground from './SectionPlayground'
import SectionDemonstration from './SectionDemonstration'
import SectionReadStarted from './SectionReadyStarted'
import SectionCommunity from './SectionCommunity'
import SectionFooterGithub from './SectionFooterGithub'

function Home() {
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
      <NextSeo
        title="Bolio UI - Amazing, modern and creative tools for React UI"
        description="Make your development more amazing with tools Bolio UI. Easy customization and clear documentation. Compatible with Next.js, Gatsby.js, RedwoodJS, Vite, and Remix. Transform your development experience now!"
        openGraph={{
          images: [
            {
              url: '/cover.jpg',
              width: 1200,
              height: 630,
              alt: 'Bolio UI - Amazing, modern and creative tools for React UI'
            }
          ]
        }}
      />
      <Base>
        <Hero />
        <Section py={1}>
          <Container style={{ maxWidth: 1300 }}>
            <Grid.Container gap={2} justify="center">
              <Grid xs={12} sm={6} md={3}>
                <CardBox
                  title="Customizable"
                  description="Customize simple, you can change themes, colors, fonts and everything you need."
                  icon="Target"
                />
              </Grid>
              <Grid xs={12} sm={6} md={3}>
                <CardBox
                  title="Modern Design"
                  description="Responsive, theme-based style props for building design systems with React."
                  icon="Layout"
                />
              </Grid>
              <Grid xs={12} sm={6} md={3}>
                <CardBox
                  title="Well Documented"
                  description="Documented organized way and its customization instruction easy for all."
                  icon="FileText"
                />
              </Grid>
              <Grid xs={12} sm={6} md={3}>
                <CardBox
                  title="Fast Loading Speed"
                  description="Faster loading speed. It's create your template so much faster."
                  icon="Zap"
                />
              </Grid>
            </Grid.Container>
          </Container>
        </Section>
        <SectionPlayground />
        <SectionDemonstration />
        <SectionReadStarted />
        <SectionCommunity />
        <SectionFooterGithub />
      </Base>
    </>
  )
}

export default Home
