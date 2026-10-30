import Marquee from '.'
import Tag from '../Tag'

export default function Example() {
  return (
    <Marquee duration={20}>
      <Tag>React</Tag>
      <Tag>Next.js</Tag>
      <Tag>Vite</Tag>
    </Marquee>
  )
}
