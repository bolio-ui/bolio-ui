import Fieldset from './Fieldset'
import FieldsetTitle from './FieldsetTitle'
import FieldsetSubtitle from './FieldsetSubtitle'
import FieldsetFooter from './FieldsetFooter'
import FieldsetGroup from './FieldsetGroup'
import FieldsetContent from './FieldsetContent'

export type FieldsetComponentType = typeof Fieldset & {
  Title: typeof FieldsetTitle
  Subtitle: typeof FieldsetSubtitle
  Footer: typeof FieldsetFooter
  Group: typeof FieldsetGroup
  Content: typeof FieldsetContent
  Body: typeof FieldsetContent
}
;(Fieldset as FieldsetComponentType).Title = FieldsetTitle
;(Fieldset as FieldsetComponentType).Subtitle = FieldsetSubtitle
;(Fieldset as FieldsetComponentType).Footer = FieldsetFooter
;(Fieldset as FieldsetComponentType).Group = FieldsetGroup
;(Fieldset as FieldsetComponentType).Content = FieldsetContent
;(Fieldset as FieldsetComponentType).Body = FieldsetContent

export type { FieldsetProps } from './Fieldset'
export type { FieldsetTitleProps } from './FieldsetTitle'
export type { FieldsetSubtitleProps } from './FieldsetSubtitle'
export type { FieldsetGroupProps } from './FieldsetGroup'
export type { FieldsetFooterProps } from './FieldsetFooter'
export type { FieldsetContentProps } from './FieldsetContent'
export default Fieldset as FieldsetComponentType
