import React from 'react'
import Image from 'next/image'
import { Text, Card, Link, useTheme } from 'core'

interface CardPlatformsProps {
  title: string
  link: string
  image: string
}

function CardPlatforms({ title, link, image }: CardPlatformsProps) {
  const theme = useTheme()

  return (
    <Link href={link} width="100%">
      <Card
        width="100%"
        style={{
          backgroundColor: theme.palette.accents_1,
          border: `1px solid ${theme.palette.border}`,
          textAlign: 'center'
        }}
      >
        <Image
          src={image}
          alt={`${title} doc framework`}
          width={180}
          height={121}
          priority
          style={{
            height: 'auto',
            borderTopLeftRadius: theme.layout.radius,
            borderTopRightRadius: theme.layout.radius
          }}
        />
        <Card.Content>
          <Text b>{title}</Text>
        </Card.Content>
      </Card>
    </Link>
  )
}

export default CardPlatforms
