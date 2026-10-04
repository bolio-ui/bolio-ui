import Timeline from './Timeline'
import TimelineItem from './TimelineItem'

export type TimelineComponentType = typeof Timeline & {
  Item: typeof TimelineItem
}
;(Timeline as TimelineComponentType).Item = TimelineItem

export type { TimelineProps } from './Timeline'
export type { TimelineItemProps } from './TimelineItem'

export default Timeline as TimelineComponentType
