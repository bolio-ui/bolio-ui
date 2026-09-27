'use client'

import React from 'react'
import { Section, Container, Spacer, Text } from 'core'
import Base from 'src/templates/Base'
import { ThemeGenerator } from 'src/components'

export default function ThemeGeneratorTemplate() {
  return (
    <>
      <Base>
        <Section py={4}>
          <Container style={{ maxWidth: 1300 }}>
            <Text h1>Theme Generator</Text>
            <Text p style={{ maxWidth: 640 }}>
              Pick a primary and a secondary color. Bolio UI derives the shades
              it actually uses, previews them on real components in light and
              dark, and gives you the code for{' '}
              <code>Themes.createFromLight</code>.
            </Text>
            <Spacer h={2} />
            <ThemeGenerator />
          </Container>
        </Section>
      </Base>
    </>
  )
}
