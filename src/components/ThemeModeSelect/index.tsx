import React from 'react'
import { Button, Popover } from 'core'
import { Sun, Moon, Monitor, Check } from '@bolio-ui/icons'
import { ThemePreference, useSettings } from 'src/utils/use-settings'

const options: {
  value: ThemePreference
  label: string
  icon: React.ReactNode
}[] = [
  { value: 'light', label: 'Light', icon: <Sun fontSize={14} /> },
  { value: 'dark', label: 'Dark', icon: <Moon fontSize={14} /> },
  { value: 'system', label: 'System', icon: <Monitor fontSize={14} /> }
]

const ThemeModeSelect: React.FC = () => {
  const { themeType, themePreference, switchTheme } = useSettings()

  const content = () => (
    <>
      {options.map(({ value, label, icon }) => (
        <Popover.Item key={value}>
          <button
            type="button"
            className="mode"
            aria-pressed={themePreference === value}
            onClick={() => switchTheme(value)}
          >
            {icon}
            <span className="label">{label}</span>
            {themePreference === value && <Check fontSize={14} />}
          </button>
        </Popover.Item>
      ))}
      <style jsx>{`
        .mode {
          display: flex;
          align-items: center;
          gap: 8px;
          min-width: 140px;
          padding: 0;
          border: 0;
          background: transparent;
          color: inherit;
          font: inherit;
          cursor: pointer;
        }
        .label {
          flex: 1;
          text-align: left;
        }
      `}</style>
    </>
  )

  return (
    <Popover content={content} placement="bottomEnd">
      <Button
        w="36px"
        h="36px"
        px={0}
        py={0}
        rounded
        subtle
        className="theme-button"
        aria-label="Change color mode"
      >
        {themeType === 'dark' ? <Moon fontSize={14} /> : <Sun fontSize={14} />}
      </Button>
    </Popover>
  )
}

export default ThemeModeSelect
