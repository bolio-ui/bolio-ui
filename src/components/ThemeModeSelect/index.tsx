import React from 'react'
import { Button, Popover } from 'core'
import { Sun, Moon, Monitor, Check } from '@bolio-ui/icons'
import { ThemePreference, useSettings } from 'src/utils/use-settings'
import styles from './ThemeModeSelect.module.css'

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
            className={styles.mode}
            aria-pressed={themePreference === value}
            onClick={() => switchTheme(value)}
          >
            {icon}
            <span className={styles.label}>{label}</span>
            {themePreference === value && <Check fontSize={14} />}
          </button>
        </Popover.Item>
      ))}
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
