import React from 'react'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { Action, useRegisterActions } from 'kbar'
import { getId } from 'core/utils/collections'
import Base from 'src/templates/Base'
import Hero from 'src/components/Hero'
import SectionFeatures from './SectionFeatures'
import SectionPlayground from './SectionPlayground'
import SectionCapabilities from './SectionCapabilities'
import SectionComponents from './SectionComponents'
import SectionTokens from './SectionTokens'
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
        <SectionFeatures />
        <SectionPlayground />
        <SectionCapabilities />
        <SectionComponents />
        <SectionTokens />
        <SectionFooterGithub />
      </Base>
    </>
  )
}

export default Home
