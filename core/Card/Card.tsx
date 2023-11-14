import React, { useMemo } from 'react'
import useTheme from '../use-theme'
import { CardTypes } from '../utils/prop-types'
import { getStyles } from './styles'
import CardFooter from './CardFooter'
import CardContent from './CardContent'
import Image from '../Image'
import { hasChild, pickChild } from '../utils/collections'
import useScale, { withScale } from '../use-scale'
import useClasses from '../use-classes'

interface Props {
  hoverable?: boolean
  rounded?: boolean
  bordered?: boolean
  shadow?: boolean
  className?: string
  type?: CardTypes
}

const defaultProps = {
  type: 'default' as CardTypes,
  hoverable: false,
  bordered: false,
  shadow: false,
  className: ''
}

type NativeAttrs = Omit<React.HTMLAttributes<any>, keyof Props>
export type CardProps = Props & NativeAttrs

function CardComponent({
  children,
  hoverable,
  rounded,
  bordered,
  className,
  shadow,
  type = 'default' as CardTypes,
  ...props
}: CardProps) {
  const theme = useTheme()
  const { SCALES } = useScale()

  const hoverShadow = useMemo(() => {
    if (shadow) return theme.expressiveness.shadowMedium
    return hoverable ? theme.expressiveness.shadowSmall : 'none'
  }, [hoverable, shadow, theme.expressiveness])

  const { color, bgColor, borderColor } = useMemo(
    () => getStyles(type, theme.palette, shadow),
    [type, theme.palette, shadow]
  )

  const [withoutFooterChildren, footerChildren] = pickChild(
    children,
    CardFooter
  )
  const [withoutImageChildren, imageChildren] = pickChild(
    withoutFooterChildren,
    Image
  )
  const hasContent = hasChild(withoutImageChildren, CardContent)

  return (
    <div className={useClasses('card', className)} {...props}>
      {imageChildren}
      {hasContent ? (
        withoutImageChildren
      ) : (
        <CardContent>{withoutImageChildren}</CardContent>
      )}
      {footerChildren}
      <style jsx>{`
        .card {
          background: ${theme.palette.background};
          transition: all 0.2s ease;
          border-radius: ${rounded ? '25px' : theme.layout.radius};
          box-shadow: ${shadow ? theme.expressiveness.shadowSmall : 'none'};
          box-sizing: border-box;
          color: ${color};
          background-color: ${bgColor};
          border: ${bordered ? '1px solid' + borderColor : 'transparent'};
          width: ${SCALES.width(1, 'auto')};
          height: ${SCALES.height(1, 'auto')};
          padding: ${SCALES.pt(0)} ${SCALES.pr(0)} ${SCALES.pb(0)}
            ${SCALES.pl(0)};
          margin: ${SCALES.mt(0)} ${SCALES.mr(0)} ${SCALES.mb(0)}
            ${SCALES.ml(0)};
        }

        .card:hover {
          box-shadow: ${hoverShadow};
        }

        .card :global(img) {
          width: 100%;
        }

        .card :global(.image) {
          border-bottom-left-radius: 0;
          border-bottom-right-radius: 0;
        }
      `}</style>
    </div>
  )
}

CardComponent.defaultProps = defaultProps
CardComponent.displayName = 'BolioUICard'
const Card = withScale(CardComponent)
export default Card
