import React from 'react'
import Anchor from '../Anchor'
import { kebabCase, isString } from 'lodash'
import styles from './title.module.css'

export type TitleProps = {
  title: React.ReactNode | string
  desc?: React.ReactNode | string
}

const replaceCode = (desc: string): string => {
  if (!desc.includes('`')) return desc
  let count = 0
  return desc.replace(/`/g, () => {
    const val = count % 2 === 0 ? '<code>' : '</code>'
    count++
    return val
  })
}

function Title({ title, desc = '' }: TitleProps) {
  const isStringDesc = typeof desc === 'string'
  return (
    <>
      <h3
        id={`${isString(title) && kebabCase(title)}`}
        data-name={title}
        className={`linked-heading ${styles.title} ${desc ? styles.withDesc : ''}`}
      >
        <Anchor>{title}</Anchor>
      </h3>
      {desc && isStringDesc && (
        <p dangerouslySetInnerHTML={{ __html: replaceCode(desc) }} />
      )}
      {desc && !isStringDesc && <p>{desc}</p>}
    </>
  )
}

Title.displayName = 'BolioUIPlayGroundTitle'
export default React.memo(Title)
