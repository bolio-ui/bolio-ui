import Avatar from './Avatar'
import AvatarGroup from './AvatarGroup'

export type AvatarComponentType = typeof Avatar & {
  Group: typeof AvatarGroup
}
;(Avatar as AvatarComponentType).Group = AvatarGroup

export type { AvatarProps } from './Avatar'
export type { AvatarGroupProps } from './AvatarGroup'

export default Avatar as AvatarComponentType
