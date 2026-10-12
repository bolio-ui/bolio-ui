'use client'

import React, { useEffect, useState } from 'react'
import { Button, Card, Link, Text, useTheme } from 'core'
import { ANALYTICS_ENABLED, getConsent, setConsent } from 'src/utils/gtag'
import styles from './ConsentBanner.module.css'

// Asks once, and only where analytics runs. Both answers have the same weight.
const ConsentBanner: React.FC = () => {
  const { palette, expressiveness } = useTheme()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (ANALYTICS_ENABLED && getConsent() === null) setOpen(true)
  }, [])

  if (!open) return null

  const answer = (choice: 'granted' | 'denied') => {
    setConsent(choice)
    setOpen(false)
  }

  return (
    <section className={styles.banner} aria-label="Analytics">
      {/* a surface close to the page needs its own edge and a deeper shadow */}
      <Card
        shadow
        style={{
          border: `1px solid ${palette.accents_3}`,
          boxShadow: expressiveness.shadowMedium
        }}
      >
        <div className={styles.content}>
          <Text p margin={0}>
            Bolio UI uses Google Analytics to count visits and find which docs
            need work. It stays off until you accept. See{' '}
            <Link href="/privacy" color underline>
              Privacy
            </Link>
            .
          </Text>
          <div className={styles.actions}>
            <Button auto scale={0.75} onClick={() => answer('denied')}>
              Decline
            </Button>
            <Button auto scale={0.75} onClick={() => answer('granted')}>
              Accept analytics
            </Button>
          </div>
        </div>
      </Card>
    </section>
  )
}

export default ConsentBanner
