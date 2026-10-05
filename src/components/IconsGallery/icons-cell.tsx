import React from 'react'
import { Text, useTheme } from 'core'
import styles from './icons-cell.module.css'

export const getFileName = (name: string): string => {
  return name.replace(/^(.)/, (g) => g.toLowerCase())
}

export const getImportString = (name: string) => {
  const fileName = getFileName(name)
  const single = `import ${name} from '@bolio-ui/icons/${fileName}'`
  const normal = `import { ${name} } from '@bolio-ui/icons'`
  return {
    single,
    normal
  }
}

interface Props {
  component: React.ComponentType<unknown>
  name: string
  onClick: (name: string) => void
}

const IconsCell: React.FC<Props> = ({
  component: Component,
  name,
  onClick
}) => {
  const theme = useTheme()
  return (
    <div
      className={styles.item}
      key={name}
      style={
        {
          '--cell-radius': theme.layout.radius,
          '--cell-shadow': theme.expressiveness.dropdownBoxShadow
        } as React.CSSProperties
      }
      onClick={() => onClick(name)}
    >
      <Component />
      <Text style={{ color: '#FFFFFF' }} small>
        {name}
      </Text>
    </div>
  )
}

export default React.memo(IconsCell)
