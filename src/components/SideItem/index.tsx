import React from 'react'
import ActiveLink from '../ActiveLink'
import ActiveCategory from '../ActiveCategory'

export type Items = {
  name: string
  url?: string
}

export interface SideItemProps {
  items: Array<Items>
}

const SideItem: React.FC<SideItemProps> = React.memo(({ items }) => {
  return (
    <>
      {items.map((item, index) => {
        return (
          <div key={`${item.name}-${index}`} className="item">
            {!item.url && <ActiveCategory name={item.name} />}
            {item.url && <ActiveLink href={item.url} text={item.name} />}
          </div>
        )
      })}
      <style jsx>{`
        .item {
          width: 100%;
        }
      `}</style>
    </>
  )
})

SideItem.displayName = 'SideItem'
export default SideItem
