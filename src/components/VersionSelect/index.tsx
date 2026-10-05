import React from 'react'
import { Button, Popover, Link, useTheme } from 'core'
import { ChevronDown, Check, ExternalLink } from '@bolio-ui/icons'
import { currentVersion, versions } from 'src/data/versions'
import styles from './VersionSelect.module.css'

const VersionSelect: React.FC = () => {
  const theme = useTheme()

  const content = () => (
    <>
      {versions.map(({ label, version, url, current }) => (
        <Popover.Item key={label}>
          <Link
            href={url}
            target={current ? undefined : '_blank'}
            aria-label={`Bolio UI ${label} documentation`}
          >
            <span
              className={styles.version}
              style={
                {
                  '--version-color': theme.palette.accents_5
                } as React.CSSProperties
              }
            >
              <b>{label}</b>
              <span className={styles.versionNumber}>v{version}</span>
              {current ? (
                <Check fontSize={14} />
              ) : (
                <ExternalLink fontSize={14} />
              )}
            </span>
          </Link>
        </Popover.Item>
      ))}
    </>
  )

  return (
    <Popover content={content} placement="bottomStart">
      <Button
        auto
        scale={0.6}
        type="abort"
        iconRight={<ChevronDown />}
        aria-label="Select documentation version"
      >
        v{currentVersion}
      </Button>
    </Popover>
  )
}

export default VersionSelect
