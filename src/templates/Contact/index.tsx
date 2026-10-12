'use client'

import React from 'react'
import { Link } from 'core'
import InfoTemplate from 'src/templates/Info'

export default function ContactTemplate() {
  return (
    <InfoTemplate
      eyebrow="Contact"
      title="Talk to the Bolio UI team"
      intro="Found a bug, have an idea or a question? Pick the channel that fits."
      sections={[
        {
          title: 'Bugs and features',
          body: (
            <>
              Open an issue on{' '}
              <Link
                href="https://github.com/bolio-ui/bolio-ui/issues/new/choose"
                target="_blank"
              >
                GitHub
              </Link>
              . Include the version and the steps to reproduce, so we can fix it
              faster.
            </>
          )
        },
        {
          title: 'Questions',
          body: (
            <>
              Check the <Link href="/faq">FAQ</Link> first. If your answer is
              not there, ask on GitHub so others can find it too.
            </>
          )
        },
        {
          title: 'News',
          body: (
            <>
              Follow{' '}
              <Link href="https://www.twitter.com/bolio_ui/" target="_blank">
                Twitter
              </Link>{' '}
              or{' '}
              <Link href="https://www.instagram.com/bolio.ui/" target="_blank">
                Instagram
              </Link>{' '}
              for releases and updates.
            </>
          )
        }
      ]}
    />
  )
}
