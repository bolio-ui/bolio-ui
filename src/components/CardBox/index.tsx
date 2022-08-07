import React from 'react'
import { Text, Card, useTheme, Grid } from 'core'
import * as Icons from '@bolio-ui/icons'

interface Props {
  title: string
  description: string
  icon: string
}

export type ProjectCardProps = Props

const renderIcon = (icon: string) => {
  const CurrentIcon = Icons[icon]
  return <CurrentIcon height={18} width={18} /> || null
}

function CardBox({ title, description, icon }: Props) {
  const theme = useTheme()

  return (
    <>
      <Card shadow>
        <Grid>
          {renderIcon(icon)}
          <Text margin={0} h4>
            {title}
          </Text>
        </Grid>
        <Grid>
          <Text margin={0} style={{ color: theme.palette.accents_6 }}>
            {description}
          </Text>
        </Grid>
      </Card>
    </>
  )
}

export default CardBox