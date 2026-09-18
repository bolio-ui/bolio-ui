export interface DocsVersion {
  label: string
  version: string
  url: string
  current?: boolean
}

// Comes from package.json (see next.config.js), so the current docs always show
// the version of the package they document.
export const currentVersion = process.env.NEXT_PUBLIC_VERSION || ''

// Each major has its own deployed docs site. Add a line here when a new major
// is released and its site is live.
const previousVersions: DocsVersion[] = [
  { label: '1.x', version: '1.1.8', url: 'https://v1.bolio-ui.com' }
]

export const versions: DocsVersion[] = [
  {
    label: `${currentVersion.split('.')[0]}.x`,
    version: currentVersion,
    url: '/',
    current: true
  },
  ...previousVersions
]
