'use client'

import React, { useState } from 'react'
import { usePathname } from 'next/navigation'
import { ButtonDropdown } from 'core'
import { Copy, Check, FileText, ExternalLink } from '@bolio-ui/icons'

const PageActions: React.FC = () => {
  const pathname = usePathname()
  const [copied, setCopied] = useState(false)

  // /docs/<section>/<slug> is served as text at /md/<section>/<slug>
  const markdownPath = pathname.replace(/^\/docs/, '/md')

  const copyMarkdown = async () => {
    const response = await fetch(markdownPath)
    await navigator.clipboard.writeText(await response.text())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const open = (url: string) => window.open(url, '_blank', 'noopener')

  // The AI assistants read the page from its public Markdown address
  const askAbout = (base: string) =>
    open(
      `${base}?q=${encodeURIComponent(
        `Read ${window.location.origin}${markdownPath} so I can ask questions about it.`
      )}`
    )

  return (
    <div className="page-actions">
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
      <style jsx>{`
        .page-actions {
          display: flex;
          justify-content: flex-end;
        }
      `}</style>
    </div>
  )
}

export default PageActions
