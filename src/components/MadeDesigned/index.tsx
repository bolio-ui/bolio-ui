import React from 'react'
import { Text, Link, Grid } from 'core'
import { Heart } from '@bolio-ui/icons'

function MadeDesigned() {
  return (
    <Grid.Container justify="flex-end">
      <Grid>
        <Text font={0.75} b my={0}>
          MADE & DESIGNED WITH
          <Heart
            fill="red"
            stroke="red"
            height={12}
            width={12}
            style={{ marginLeft: 3, marginRight: 3 }}
          />
          BY{' '}
          <Link
            href="https://brunnoandrade.com.br/"
            target="_blank"
            rel="noopener"
            underline
          >
            BRUNNO ANDRADE
          </Link>
        </Text>
      </Grid>
    </Grid.Container>
  )
}

export default MadeDesigned
