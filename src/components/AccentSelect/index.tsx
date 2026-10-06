import React from 'react'
import { Button, Popover, useTheme } from 'core'
import { Droplet } from '@bolio-ui/icons'
import { accents, useSettings } from 'src/utils/use-settings'
import styles from './AccentSelect.module.css'

const AccentSelect: React.FC = () => {
  const theme = useTheme()
  const { accent, switchAccent } = useSettings()

  const content = () => (
    <div
      className={styles.accents}
      style={
        {
          '--accent-color': theme.palette.accents_5,
          '--accent-active-color': theme.palette.foreground,
          '--accent-focus': theme.palette.primary,
          '--accent-bg': theme.palette.background
        } as React.CSSProperties
      }
    >
      {accents.map(({ name, color }) => (
        <button
          key={name}
          type="button"
          className={styles.accent}
          aria-label={`${name} accent`}
          aria-pressed={accent === name}
          onClick={() => switchAccent(name)}
        >
          <span className={styles.swatch} style={{ background: color }} />
          <span>{name}</span>
        </button>
      ))}
    </div>
  )

  return (
    <Popover content={content} placement="bottomEnd">
      <Button
        auto
        scale={0.75}
        rounded
        subtle
        icon={<Droplet />}
        aria-label="Change theme color"
      >
        Theme
      </Button>
    </Popover>
  )
}

export default AccentSelect
