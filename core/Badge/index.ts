import Badge from './Badge'
import BadgeAnchor from './BadgeAnchor'

export type BadgeComponentType = typeof Badge & {
  Anchor: typeof BadgeAnchor
}
;(Badge as BadgeComponentType).Anchor = BadgeAnchor

export type { BadgeProps, BadgeTypes } from './Badge'
export type { BadgeAnchorProps, BadgeAnchorPlacement } from './BadgeAnchor'
export default Badge as BadgeComponentType
