import React from 'react'
import { Button, Popover, useTheme } from 'core'
import { Droplet } from '@bolio-ui/icons'
import { accents, useSettings } from 'src/utils/use-settings'

const AccentSelect: React.FC = () => {
  const theme = useTheme()
  const { accent, switchAccent } = useSettings()

  const content = () => (
    <div className="accents">
      {accents.map(({ name, color }) => (
        <button
          key={name}
          type="button"
          className="accent"
          aria-label={`${name} accent`}
          aria-pressed={accent === name}
          onClick={() => switchAccent(name)}
        >
          <span className="swatch" style={{ background: color }} />
          <span className="name">{name}</span>
        </button>
      ))}
      <style jsx>{`
        .accents {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 4px;
          padding: 8px;
        }
        .accent {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          padding: 6px 4px;
          border: 0;
          border-radius: 8px;
          background: transparent;
          color: ${theme.palette.accents_5};
          font: inherit;
          font-size: 0.75rem;
          cursor: pointer;
        }
        .accent:hover,
        .accent[aria-pressed='true'] {
          color: ${theme.palette.foreground};
        }
        .accent:focus-visible {
          outline: 2px solid ${theme.palette.primary};
        }
        .swatch {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          box-shadow:
            0 0 0 2px ${theme.palette.background},
            0 0 0 4px transparent;
        }
        .accent[aria-pressed='true'] .swatch {
          box-shadow:
            0 0 0 2px ${theme.palette.background},
            0 0 0 4px ${theme.palette.foreground};
        }
      `}</style>
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
