'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
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
