import type { MDXComponents } from 'mdx/types'
import { Image } from 'core'
import { HybridCode, HybridLink, HybridLinkHeading } from 'src/components'

// Every MDX page renders these in place of the plain HTML tags
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    h3: HybridLinkHeading,
    a: HybridLink,
    img: Image,
    pre: HybridCode
  } as unknown as MDXComponents
}
