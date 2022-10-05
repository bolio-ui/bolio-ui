import React from 'react'
import { Card, Grid, useTheme } from 'core'
import { CardTypes } from 'core/utils/prop-types'

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
  const theme = useTheme()

  return (
    <div className="colors">
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
      <style jsx>{`
        .colors {
          display: flex;
          flex-wrap: wrap;
        }

        .color-card {
          display: flex;
          width: 9rem;
          margin-right: ${theme.layout.gapHalf};
          margin-bottom: ${theme.layout.gapHalf};
        }
      `}</style>
    </div>
  )
}

export default Colors
