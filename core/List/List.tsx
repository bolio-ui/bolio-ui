import React, { createContext, useContext } from 'react'
import useClasses from '../use-classes'
import styles from './List.module.css'

interface ListContextValue {
  icon?: React.ReactNode
}
const ListContext = createContext<ListContextValue>({})

interface Props {
  // 'ordered' numbers the items, 'unordered' uses bullets
  type?: 'unordered' | 'ordered'
  // marker for every item, replaces the bullet or the number
  icon?: React.ReactNode
  // space between the items, in rem
  spacing?: number
  className?: string
}

type NativeAttrs = Omit<React.HTMLAttributes<HTMLElement>, keyof Props>
export type ListProps = Props & NativeAttrs

const List = React.forwardRef<HTMLElement, React.PropsWithChildren<ListProps>>(
  (
    {
      type = 'unordered',
      icon,
      spacing = 0.25,
      className = '',
      style,
      children,
      ...props
    },
    ref
  ) => {
    const Component = type === 'ordered' ? 'ol' : 'ul'
    return (
      <ListContext.Provider value={{ icon }}>
        <Component
          ref={ref as React.Ref<never>}
          className={useClasses(styles.list, className)}
          style={
            {
              '--list-spacing': `${spacing}rem`,
              listStyleType: icon
                ? 'none'
                : type === 'ordered'
                  ? 'decimal'
                  : 'disc',
              ...style
            } as React.CSSProperties
          }
          {...props}
        >
          {children}
        </Component>
      </ListContext.Provider>
    )
  }
)

List.displayName = 'BolioUIList'

interface ItemProps {
  // marker of this item only
  icon?: React.ReactNode
  className?: string
}

type ItemNativeAttrs = Omit<
  React.LiHTMLAttributes<HTMLLIElement>,
  keyof ItemProps
>
export type ListItemProps = ItemProps & ItemNativeAttrs

export const ListItem = React.forwardRef<
  HTMLLIElement,
  React.PropsWithChildren<ListItemProps>
>(({ icon, className = '', style, children, ...props }, ref) => {
  const parent = useContext(ListContext)
  const marker = icon ?? parent.icon
  return (
    <li
      ref={ref}
      className={useClasses(styles.item, marker && styles.withIcon, className)}
      style={{ listStyleType: marker ? 'none' : undefined, ...style }}
      {...props}
    >
      {marker && (
        <span className={styles.icon} aria-hidden="true">
          {marker}
        </span>
      )}
      {marker ? <span>{children}</span> : children}
    </li>
  )
})

ListItem.displayName = 'BolioUIListItem'
export default List
