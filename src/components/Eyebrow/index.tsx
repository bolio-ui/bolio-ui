import React from 'react'
import { Text, useTheme } from 'core'

interface Props {
  children: React.ReactNode
}

function Eyebrow({ children }: Props) {
  const theme = useTheme()

  return (
    <Text
      font={0.75}
      b
      my={0}
      mb={0.6}
      style={{
        display: 'block',
        fontFamily: theme.font.mono,
        color: theme.palette.primary,
        textTransform: 'uppercase',
        letterSpacing: '0.08em'
      }}
    >
      {children}
    </Text>
  )
}

export default Eyebrow
