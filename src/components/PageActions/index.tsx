'use client'

import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { ButtonDropdown, Snippet } from 'core'
import { Copy, Check, FileText, ExternalLink } from '@bolio-ui/icons'
import { track } from 'src/utils/gtag'
import styles from './PageActions.module.css'

const PageActions: React.FC = () => {
  const pathname = usePathname()
  const [copied, setCopied] = useState(false)

  // /docs/<section>/<slug> is served as text at /md/<section>/<slug>
  const markdownPath = pathname.replace(/^\/docs/, '/md')

  const copyMarkdown = async () => {
    const response = await fetch(markdownPath)
    await navigator.clipboard.writeText(await response.text())
    track('copy_markdown', { page_path: pathname })
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // The registry lists the components `add` can copy. A page that has none
  // (Overview, Icons) shows no command.
  const [, , section, slug] = pathname.split('/')
  const [names, setNames] = useState<string[]>([])
  useEffect(() => {
    fetch('/r/index.json')
      .then((response) => response.json())
      .then(setNames)
      .catch(() => {})
  }, [])
  const registered =
    section === 'components' &&
    names.find((name) => name.toLowerCase() === slug.replace(/-/g, ''))

  const open = (url: string) => window.open(url, '_blank', 'noopener')

  // The AI assistants read the page from its public Markdown address
  const askAbout = (base: string) =>
    open(
      `${base}?q=${encodeURIComponent(
        `Read ${window.location.origin}${markdownPath} so I can ask questions about it.`
      )}`
    )

  return (
    <div className={styles.pageActions}>
      {registered && (
        <Snippet
          scale={0.6}
          text={`npx @bolio-ui/cli@latest add ${registered.toLowerCase()}`}
        />
      )}
      <ButtonDropdown scale={0.6}>
        <ButtonDropdown.Item
          main
          icon={copied ? <Check /> : <Copy />}
          onClick={copyMarkdown}
          aria-live="polite"
        >
          {copied ? 'Copied' : 'Copy Markdown'}
        </ButtonDropdown.Item>
        <ButtonDropdown.Item
          icon={<FileText />}
          onClick={() => open(markdownPath)}
        >
          View as Markdown
        </ButtonDropdown.Item>
        <ButtonDropdown.Item
          icon={<ExternalLink />}
          onClick={() => askAbout('https://chatgpt.com/')}
        >
          Open in ChatGPT
        </ButtonDropdown.Item>
        <ButtonDropdown.Item
          icon={<ExternalLink />}
          onClick={() => askAbout('https://claude.ai/new')}
        >
          Open in Claude
        </ButtonDropdown.Item>
      </ButtonDropdown>
    </div>
  )
}

export default PageActions
