import React from 'react'
import { useRouter } from 'next/router'
import { useTheme, Text, Link, Dot } from 'core'

export interface Props {
  onAcitve?: () => void
  href: string
  text: string
}

const ActiveLink: React.FC<Props> = React.memo(({ href, text }) => {
  const theme = useTheme()
  const router = useRouter()
  const isActive = router.asPath === href

  return (
    <Link href={href}>
      <Text
        font="14px"
        my={0}
        mb={1}
        b={isActive}
        ml="15px"
        style={{
          color: isActive ? theme.palette.accents_8 : theme.palette.accents_6
        }}
      >
        {text}
      </Text>
    </Link>
  )
})

ActiveLink.displayName = 'BolioUIActiveLink'
export default ActiveLink
