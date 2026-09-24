import React from 'react'
import { Text, Grid, Link, useTheme } from 'core'
import { Heart } from '@bolio-ui/icons'
import { currentVersion } from 'src/data/versions'

function NameMadeDesigned() {
  return (
    <Link
      href="https://github.com/brunnoandrade/"
      target="_blank"
      rel="noopener"
      underline
      aria-label="Link to Github Bruno Andrade"
    >
      BRUNO ANDRADE
    </Link>
  )
}

function FooterMeta() {
  const theme = useTheme()
  const year = new Date().getFullYear()

  return (
    <>
      <Grid.Container gap={2} alignItems="center">
        <Grid xs={12} md={4} className="footer-meta-cell">
          <Text
            font={0.75}
            my={0}
            style={{
              fontFamily: theme.font.mono,
              color: theme.palette.accents_5
            }}
          >
            © {year} Bolio UI
          </Text>
        </Grid>
        <Grid xs={12} md={4} className="footer-meta-cell center">
          <Text
            font={0.75}
            my={0}
            style={{
              fontFamily: theme.font.mono,
              color: theme.palette.accents_5
            }}
          >
            v{currentVersion}
          </Text>
        </Grid>
        <Grid xs={12} md={4} className="footer-meta-cell right">
          <Text
            font={0.75}
            b
            my={0}
            style={{
              fontFamily: theme.font.mono,
              color: theme.palette.accents_6
            }}
          >
            MADE & DESIGNED WITH
            <Heart
              fill="red"
              stroke="red"
              height={12}
              width={12}
              style={{ marginLeft: 3, marginRight: 3 }}
            />
            BY <NameMadeDesigned />
          </Text>
        </Grid>
      </Grid.Container>
      <style jsx>{`
        :global(.footer-meta-cell.center) {
          text-align: center;
        }
        :global(.footer-meta-cell.right) {
          text-align: right;
        }
        @media (max-width: calc(${theme.breakpoints.md.min} - 1px)) {
          :global(.footer-meta-cell.center),
          :global(.footer-meta-cell.right) {
            text-align: left;
          }
        }
      `}</style>
    </>
  )
}

export default FooterMeta
