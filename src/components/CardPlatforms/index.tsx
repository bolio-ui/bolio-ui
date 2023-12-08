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
    <Link href={link}>
      <Card
        style={{
          background: 'rgba(194, 95, 255, 0.2) none repeat scroll 0% 0%',
          textAlign: 'center'
        }}
      >
        <Image
          src={image}
          alt={`${title} doc framework`}
          width="180px"
          height="120px"
          priority
          style={{
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
