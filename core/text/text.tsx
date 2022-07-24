import React, { ReactNode, useMemo } from 'react'
import { NormalTypes } from '../utils/prop-types'
import TextChild from './child'
import { withScale } from '../use-scale'

export type TextTypes = NormalTypes
interface Props {
  h1?: boolean
  h2?: boolean
  h3?: boolean
  h4?: boolean
  h5?: boolean
  h6?: boolean
  p?: boolean
  b?: boolean
  small?: boolean
  i?: boolean
  span?: boolean
  del?: boolean
  em?: boolean
  blockquote?: boolean
  className?: string
  type?: TextTypes
}

type ElementMap = { [key in keyof JSX.IntrinsicElements]?: boolean }

type NativeAttrs = Omit<React.HTMLAttributes<any>, keyof Props>
export type TextProps = Props & NativeAttrs

type TextRenderableElements = Array<keyof JSX.IntrinsicElements>

const getModifierChild = (
  tags: TextRenderableElements,
  children: ReactNode
) => {
  if (!tags.length) return children
  const nextTag = tags.slice(1, tags.length)
  return (
    <TextChild tag={tags[0]}>{getModifierChild(nextTag, children)}</TextChild>
  )
}

function TextComponent({
  h1 = false,
  h2 = false,
  h3 = false,
  h4 = false,
  h5 = false,
  h6 = false,
  p = false,
  b = false,
  small = false,
  i = false,
  span = false,
  del = false,
  em = false,
  blockquote = false,
  children,
  className = '',
  ...props
}: React.PropsWithChildren<TextProps>) {
  const elements: ElementMap = { h1, h2, h3, h4, h5, h6, p, blockquote }
  const inlineElements: ElementMap = { span, small, b, em, i, del }

  const names = Object.keys(elements).filter(
    (name: keyof JSX.IntrinsicElements) => elements[name]
  ) as TextRenderableElements

  const inlineNames = Object.keys(inlineElements).filter(
    (name: keyof JSX.IntrinsicElements) => inlineElements[name]
  ) as TextRenderableElements

  const tag = useMemo(() => {
    if (names[0]) return names[0]
    if (inlineNames[0]) return inlineNames[0]
    return 'p' as keyof JSX.IntrinsicElements
  }, [names, inlineNames])

  const renderableChildElements = inlineNames.filter(
    (name: keyof JSX.IntrinsicElements) => name !== tag
  ) as TextRenderableElements

  const modifers = useMemo(() => {
    if (!renderableChildElements.length) return children
    return getModifierChild(renderableChildElements, children)
  }, [renderableChildElements, children])

  return (
    <TextChild className={className} tag={tag} {...props}>
      {modifers}
    </TextChild>
  )
}

TextComponent.displayName = 'BolioUIText'
const Text = withScale(TextComponent)
export default Text
