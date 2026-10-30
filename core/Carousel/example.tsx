import Carousel from '.'
import Card from '../Card'

const slides = ['Themes', 'Accessible', 'Typed']

export default function Example() {
  return (
    <Carousel aria-label="Product highlights">
      {slides.map((title) => (
        <Card key={title} bordered width="100%">
          {title}
        </Card>
      ))}
    </Carousel>
  )
}
