import React from 'react'
import { Text, Card, useTheme, Row, Badge } from 'core'
import * as Icons from '@bolio-ui/icons'

type Icon = keyof typeof Icons

interface Props {
  title: string
  description: string
  icon: Icon
  hover?: boolean
}

export type ProjectCardProps = Props

const renderIcon = (icon: Icon, color) => {
  const CurrentIcon = Icons[icon]
  return <CurrentIcon fontSize={26} color={color} /> || null
}

function CardBox({ title, description, icon, hover = false }: Props) {
  const theme = useTheme()

  return (
    <>
      <div className="card-wrapper">
        <Card
          className={`${hover && 'card-box'}`}
          padding={1}
          style={{
            backgroundColor: 'transparent',
            backdropFilter: 'saturate(180%) blur(10px)'
          }}
        >
          <Row align="middle">
            <Badge
              style={{
                background: 'rgba(194, 95, 255, 0.2) none repeat scroll 0% 0%',
                borderRadius: '50%',
                padding: 12
              }}
            >
              {renderIcon(icon, theme.palette.secondary)}
            </Badge>

            <Text my={0} ml={0.8} h4>
              {title}
            </Text>
          </Row>
          <Row>
            <Text mb={0} style={{ color: theme.palette.accents_6 }}>
              {description}
            </Text>
          </Row>
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
