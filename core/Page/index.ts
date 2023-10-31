import Page from './Page'
import PageHeader from './PageHeader'
import PageContent from './PageContent'
import PageFooter from './PageFooter'

export type PageComponentType = typeof Page & {
  Header: typeof PageHeader
  Content: typeof PageContent
  Body: typeof PageContent
  Footer: typeof PageFooter
}
;(Page as PageComponentType).Header = PageHeader
;(Page as PageComponentType).Content = PageContent
;(Page as PageComponentType).Body = PageContent
;(Page as PageComponentType).Footer = PageFooter

export type { PageProps, PageRenderMode } from './Page'
export type { PageHeaderProps } from './PageHeader'
export type { PageContentProps } from './PageContent'
export type { PageFooterProps } from './PageFooter'
export default Page as PageComponentType
