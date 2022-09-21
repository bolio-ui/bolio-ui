import React from 'react'
import { Text, Card, useTheme, Grid } from 'core'
import * as Icons from '@bolio-ui/icons'

type Icon = keyof typeof Icons

interface Props {
  title: string
  description: string
  icon: Icon
  hover?: boolean
}

export type ProjectCardProps = Props

const renderIcon = (icon: Icon) => {
  const CurrentIcon = Icons[icon]
  return <CurrentIcon height={18} width={18} /> || null
}

function CardBox({ title, description, icon, hover = false }: Props) {
  const theme = useTheme()

  return (
    <>
      <div className="card-wrapper">
        <Card className={`${hover && 'card-box'}`} shadow>
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
      </div>
      <style jsx>{`
        .card-wrapper {
          width: 100%;
        }
        .card-wrapper :global(.card-box):hover {
          box-shadow: ${theme.type === 'dark'
            ? `0 0 0 1px ${theme.palette.foreground}`
            : '0px 4px 8px rgba(0,0,0,0.12)'};
        }
      `}</style>
    </>
  )
}

export default CardBox
