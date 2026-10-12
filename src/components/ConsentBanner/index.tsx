'use client'

import React, { useEffect, useState } from 'react'
import { Button, Card, Text } from 'core'
import { ANALYTICS_ENABLED, getConsent, setConsent } from 'src/utils/gtag'
import styles from './ConsentBanner.module.css'

// Asks once, and only where analytics runs. Both answers have the same weight.
const ConsentBanner: React.FC = () => {
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
      <Card>
        <Text p>
          Bolio UI uses Google Analytics to count visits and find which docs
          need work. It stays off until you accept.
        </Text>
        <div className={styles.actions}>
          <Button auto scale={0.75} onClick={() => answer('denied')}>
            Decline
          </Button>
          <Button auto scale={0.75} onClick={() => answer('granted')}>
            Accept analytics
          </Button>
        </div>
      </Card>
    </section>
  )
}

export default ConsentBanner
