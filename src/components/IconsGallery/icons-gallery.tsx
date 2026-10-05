import React, { useState } from 'react'
import { useTheme, Input, useInput, Modal, useModal, Snippet } from 'core'
import * as Icons from '@bolio-ui/icons'
import IconsCell, { getImportString } from './icons-cell'
import styles from './icons-gallery.module.css'

const ImportSnippet: React.FC<React.PropsWithChildren<unknown>> = ({
  children
}) => {
  return <Snippet className={styles.snippet}>{children}</Snippet>
}

const IconsGallery: React.FC<unknown> = () => {
  const theme = useTheme()
  const { setVisible, bindings: modalBindings } = useModal()
  const { state: query, bindings } = useInput('')
  const [importStr, setImportStr] = useState({
    title: '',
    single: '',
    normal: ''
  })

  const icons = Object.entries(Icons).filter(
    ([name]) => !query || name.toLowerCase().includes(query.toLowerCase())
  )

  const onCellClick = (name: string) => {
    const { single, normal } = getImportString(name)
    setImportStr({ title: name, single, normal })
    setVisible(true)
  }

  return (
    <div
      className={styles.gallery}
      style={
        {
          '--gallery-bg': theme.palette.pre,
          '--gallery-radius': theme.layout.radius
        } as React.CSSProperties
      }
    >
      <h3 className={styles.title}>{'Icons Gallery'}</h3>
      <Input
        width="100%"
        icon={<Icons.Search />}
        placeholder={'Search icon...'}
        {...bindings}
      />
      <div className={styles.grid}>
        {icons.map(([name, component], index) => (
          <IconsCell
            name={name}
            component={component}
            key={`${name}-${index}`}
            onClick={onCellClick}
          />
        ))}
      </div>
      <Modal {...modalBindings}>
        <Modal.Title>{importStr.title}</Modal.Title>
        <Modal.Content>
          <p>{'Import:'}</p>
          <ImportSnippet>{importStr.normal}</ImportSnippet>
          <p>{'Import single component:'}</p>
          <ImportSnippet>{importStr.single}</ImportSnippet>
        </Modal.Content>
      </Modal>
    </div>
  )
}

export default IconsGallery
