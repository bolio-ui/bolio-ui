import React, { useState } from 'react'
import type { StoryFn, Meta } from '@storybook/react-vite'
import Carousel from '.'
import Card from '../Card'

export default {
  title: 'Navigation/Carousel',
  component: Carousel
} as Meta

const slides = ['One', 'Two', 'Three', 'Four', 'Five'].map((name) => (
  <Card key={name} bordered width="100%" style={{ minHeight: 120 }}>
    {name}
  </Card>
))

export const Default: StoryFn = () => (
  <Carousel aria-label="Highlights">{slides}</Carousel>
)

export const SeveralSlides: StoryFn = () => (
  <Carousel aria-label="Highlights" slidesToShow={3}>
    {slides}
  </Carousel>
)

export const Controlled: StoryFn = () => {
  const [index, setIndex] = useState(2)
  return (
    <>
      <Carousel aria-label="Highlights" value={index} onChange={setIndex}>
        {slides}
      </Carousel>
      <p>Slide {index + 1}</p>
    </>
  )
}
