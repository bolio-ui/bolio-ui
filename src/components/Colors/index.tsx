import React from 'react'
import { Card, Grid } from 'core'
import { CardTypes } from 'core/utils/prop-types'
import styles from './Colors.module.css'

const types = [
  'default',
  'primary',
  'secondary',
  'success',
  'warning',
  'error',
  'dark',
  'lite',
  'info'
]

const Colors: React.FC<React.PropsWithChildren<unknown>> = () => {
  return (
    <div className={styles.colors}>
      <Grid.Container gap={1} pl={0} mr="10px">
        {types.map((type, index) => {
          return (
            <Grid xs={2} key={`${type}-${index}`}>
              <Card w="100%" type={type as CardTypes}>
                {type}
              </Card>
            </Grid>
          )
        })}
      </Grid.Container>
    </div>
  )
}

export default Colors
