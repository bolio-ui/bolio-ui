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

  const Component = target ? Link : NextLink

  return (
    <Component href={href} target={target}>
      <Text
        font="14px"
        my={0}
        mb={1}
        b={isActive}
        ml="26px"
        style={{
          color: isActive ? theme.palette.accents_8 : theme.palette.accents_6,
          cursor: 'pointer'
        }}
      >
        {text}
      </Text>
    </Component>
  )
})

ActiveLink.displayName = 'BolioUIActiveLink'
export default ActiveLink
