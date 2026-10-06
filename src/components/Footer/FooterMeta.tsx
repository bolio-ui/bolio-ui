import React from 'react'
import { Text, Grid, Link, useTheme } from 'core'
import { Heart } from '@bolio-ui/icons'
import { currentVersion } from 'src/data/versions'
import styles from './FooterMeta.module.css'

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
    <Grid.Container alignItems="center">
      <Grid xs={12} md={4}>
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
      <Grid xs={12} md={4} className={styles.center}>
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
      <Grid xs={12} md={4} className={styles.right}>
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
  )
}

export default FooterMeta
