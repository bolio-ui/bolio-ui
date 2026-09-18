import React from 'react'
import { Button, Popover, Link, useTheme } from 'core'
import { ChevronDown, Check, ExternalLink } from '@bolio-ui/icons'
import { currentVersion, versions } from 'src/data/versions'

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
            <span className="version">
              <b>{label}</b>
              <span className="version-number">v{version}</span>
              {current ? (
                <Check fontSize={14} />
              ) : (
                <ExternalLink fontSize={14} />
              )}
            </span>
          </Link>
        </Popover.Item>
      ))}
      <style jsx>{`
        .version {
          display: flex;
          align-items: center;
          gap: 8px;
          min-width: 180px;
        }
        .version-number {
          flex: 1;
          color: ${theme.palette.accents_5};
          font-size: 0.875rem;
        }
      `}</style>
    </>
  )

  return (
    <Popover content={content} placement="bottomStart">
      <Button
        auto
        scale={0.6}
        type="abort"
        iconRight={<ChevronDown fontSize={14} />}
        aria-label="Select documentation version"
      >
        v{currentVersion}
      </Button>
    </Popover>
  )
}

export default VersionSelect
