import React from 'react'
import { Tag, Badge } from 'core'
import { components } from 'src/data/sidebar'

export interface Props {
  href: string
  raised?: boolean
}

// Shows the New or Updated tag set for this page in the components sidebar data.
const ComponentTag: React.FC<Props> = ({ href, raised }) => {
  const tag = components.find((item) => item.url === href)?.tag
  if (!tag) return null

  const type = tag === 'New' ? 'success' : 'primary'
  const label = (
    <Tag
      scale={0.55}
      type={type}
      light
      style={{
        marginLeft: 8,
        verticalAlign: 'middle'
      }}
    >
      {tag}
    </Tag>
  )

  // A round badge over the end of the word: an empty inline anchor, so it never wraps or changes the line height.
  return raised ? (
    <span style={{ position: 'relative' }}>
      <Badge
        title={tag}
        aria-label={tag}
        type={type}
        light
        style={{
          position: 'absolute',
          top: -4,
          left: -2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 16,
          height: 16,
          padding: 0,
          fontSize: 10
        }}
      >
        {tag[0]}
      </Badge>
    </span>
  ) : (
    label
  )
}

ComponentTag.displayName = 'BolioUIComponentTag'
export default ComponentTag
