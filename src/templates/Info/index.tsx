'use client'

import React from 'react'
import { Section, Container, Spacer, Text, useTheme } from 'core'
import Eyebrow from 'src/components/Eyebrow'
import Base from 'src/templates/Base'

interface Props {
  eyebrow: string
  title: string
  intro: string
  sections: Array<{ title: string; body: React.ReactNode }>
}

export default function InfoTemplate({
  eyebrow,
  title,
  intro,
  sections
}: Props) {
  const theme = useTheme()

  return (
    <Base>
      <Section
        py={5}
        style={{
          textAlign: 'center',
          borderBottom: `1px solid ${theme.palette.border}`,
          background: `radial-gradient(ellipse 70% 100% at 50% 0%, color-mix(in srgb, ${theme.palette.primary} 14%, transparent), transparent), ${theme.palette.accents_1}`
        }}
      >
        <Container style={{ maxWidth: 680 }}>
          <Eyebrow>{eyebrow}</Eyebrow>
          <Text b font={3} style={{ lineHeight: 1.2 }}>
            {title}
          </Text>
          <Text p font={1.1} style={{ color: theme.palette.accents_6 }} mt={1}>
            {intro}
          </Text>
        </Container>
      </Section>
      <Section py={3}>
        <Container style={{ maxWidth: 800 }}>
          {sections.map(({ title, body }, index) => (
            <React.Fragment key={title}>
              {index > 0 && <Spacer h={2} />}
              <Text h3>{title}</Text>
              <Text p>{body}</Text>
            </React.Fragment>
          ))}
        </Container>
      </Section>
    </Base>
  )
}
