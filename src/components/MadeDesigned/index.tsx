import React from 'react'
import { Text, Grid } from 'core'
import { Heart } from '@bolio-ui/icons'

function MadeDesigned() {
  return (
    <Grid.Container justify="flex-end">
      <Grid my={2}>
        <Text font={0.75} b my={0}>
          MADE & DESIGNED WITH
          <Heart
            fill="red"
            stroke="red"
            height={12}
            width={12}
            style={{ marginLeft: 3, marginRight: 3 }}
          />
          BY BRUNO ANDRADE
        </Text>
      </Grid>
    </Grid.Container>
  )
}

export default MadeDesigned
