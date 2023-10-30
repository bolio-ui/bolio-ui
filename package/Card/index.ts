import Card from './Card'
import CardFooter from './CardFooter'
import CardContent from './CardContent'

export type CardComponentType = typeof Card & {
  Footer: typeof CardFooter
  Actions: typeof CardFooter
  Content: typeof CardContent
  Body: typeof CardContent
}
;(Card as CardComponentType).Footer = CardFooter
;(Card as CardComponentType).Actions = CardFooter
;(Card as CardComponentType).Content = CardContent
;(Card as CardComponentType).Body = CardContent

export type { CardProps } from './Card'
export type { CardContentProps } from './CardContent'
export type { CardFooterProps } from './CardFooter'
export type { CardTypes } from '../utils/prop-types'
export default Card as CardComponentType
