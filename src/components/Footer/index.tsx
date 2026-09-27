import React from 'react'
import { Section, Text, Container, Grid, Row, Link, useTheme } from 'core'
import Logo from 'src/components/Logo'
import FooterMeta from './FooterMeta'

function Footer() {
  const theme = useTheme()

  return (
    <Section py={2} style={{ borderTop: `1px solid ${theme.palette.border}` }}>
      <Container style={{ maxWidth: 1300 }}>
        <Grid.Container gap={2} alignItems="center">
          <Grid xs={12} md={6}>
            <Logo name="Bolio UI" />
            <Text
              font={0.85}
              my={0}
              mt={0.5}
              style={{ color: theme.palette.accents_5 }}
            >
              Amazing, modern and creative tools for React UI.
            </Text>
          </Grid>
          <Grid xs={12} md={6}>
            <div className="footer-links">
              <Row justify="end" style={{ flexWrap: 'wrap', gap: 24 }}>
                <Link href="/docs/guide/getting-started">Guide</Link>
                <Link href="/docs/components/avatar">Components</Link>
                <Link href="/docs/hooks/use-body-scroll">Hooks</Link>
                <Link href="/theme-generator">Theme Generator</Link>
                <Link
                  href="https://github.com/bolio-ui/bolio-ui"
                  target="_blank"
                  aria-label="Link to Github Bolio UI"
                >
                  GitHub
                </Link>
              </Row>
            </div>
          </Grid>
        </Grid.Container>
        <div
          style={{
            marginTop: theme.layout.gap,
            borderTop: `1px solid ${theme.palette.border}`,
            paddingTop: theme.layout.gap
          }}
        >
          <FooterMeta />
        </div>
      </Container>
      <style jsx>{`
        .footer-links :global(a) {
          color: ${theme.palette.accents_5};
          transition: color 200ms ease;
        }
        .footer-links :global(a:hover) {
          color: ${theme.palette.foreground};
        }
      `}</style>
    </Section>
  )
}

export default Footer
