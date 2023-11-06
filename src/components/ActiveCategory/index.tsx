import React from 'react'
import { useRouter } from 'next/router'
import { useTheme, Text } from 'core'

export interface Props {
  name: string
}

const ActiveCategory: React.FC<Props> = React.memo(({ name, ...props }) => {
  const theme = useTheme()
  const router = useRouter()
  const isActive = router.asPath.includes(`/${name}/`)

  return (
    <Text
      {...props}
      b
      font="18px"
      my={0}
      mb={1}
      style={{
        color: isActive ? theme.palette.accents_8 : theme.palette.accents_8
      }}
    >
      {name}
    </Text>
  )
})

ActiveCategory.displayName = 'ActiveCategory'
export default ActiveCategory
