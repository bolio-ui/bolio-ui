import React from 'react'
import ActiveLink from '../ActiveLink'
import ActiveCategory from '../ActiveCategory'
import { Grid } from 'core'

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
          <Grid.Container gap={2} key={`${item.name}-${index}`}>
            {!item.url && <ActiveCategory name={item.name} />}
            {item.url && <ActiveLink href={item.url} text={item.name} />}
          </Grid.Container>
        )
      })}
    </>
  )
})

SideItem.displayName = 'BolioUISideItem'
export default SideItem
