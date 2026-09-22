import React from 'react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useTheme, Text, Link } from 'core'

export interface Props {
  onAcitve?: () => void
  href: string
  text: string
  target?: string
}

const ActiveLink: React.FC<Props> = React.memo(({ href, text, target }) => {
  const theme = useTheme()
  const router = useRouter()
  const isActive = router.asPath === href

  const label = (
    <Text
      p
      font="14px"
      my={0}
      mb={1}
      ml="26px"
      style={{
        color: isActive ? theme.palette.accents_8 : theme.palette.accents_6,
        // bold by style: the b prop adds a second element that repeats the margins
        fontWeight: isActive ? 'bold' : undefined,
        cursor: 'pointer',
        // Text is a <p>, a block element: without this the link area (and its
        // hover state) stretches to the full row instead of hugging the text.
        display: 'inline-block',
        width: 'fit-content'
      }}
    >
      {text}
    </Text>
  )

  if (target) {
    return (
      <Link href={href} target={target}>
        {label}
      </Link>
    )
  }

  return (
    <NextLink href={href} style={{ textDecoration: 'none' }}>
      {label}
    </NextLink>
  )
})

ActiveLink.displayName = 'BolioUIActiveLink'
export default ActiveLink
