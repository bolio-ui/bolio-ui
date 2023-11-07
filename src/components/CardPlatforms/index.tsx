import React from 'react'
import { Text, Card, Link, Image } from 'core'

interface CardPlatformsProps {
  title: string
  link: string
  image: string
}

function CardPlatforms({ title, link, image }: CardPlatformsProps) {
  return (
    <Link href={link}>
      <Card
        style={{
          background: 'rgba(194, 95, 255, 0.2) none repeat scroll 0% 0%',
          textAlign: 'center'
        }}
      >
        <Image src={image} />
        <Card.Content style={{}}>
          <Text b>{title}</Text>
        </Card.Content>
      </Card>
    </Link>
  )
}

export default CardPlatforms
