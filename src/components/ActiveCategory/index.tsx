import React from 'react'
import { useRouter } from 'next/router'
import { useTheme, Text, Row } from 'core'
import * as Icons from '@bolio-ui/icons'

export interface Props {
  name: string
  icon: Icon
}

type Icon = keyof typeof Icons

const renderIcon = (icon: Icon, color: string) => {
  const CurrentIcon = Icons[icon]
  return <CurrentIcon color={color} /> || null
}

const ActiveCategory: React.FC<Props> = React.memo(
  ({ name, icon, ...props }) => {
    const theme = useTheme()
    const router = useRouter()
    const isActive = router.asPath.includes(`/${name}/`)

    return (
      <Row
        align="middle"
        style={{
          marginBottom: 10
        }}
      >
        {icon && renderIcon(icon, theme.palette.foreground)}
        <Text
          {...props}
          b
          font="18px"
          my={0}
          ml={0.5}
          style={{
            color: isActive ? theme.palette.accents_8 : theme.palette.accents_8
          }}
        >
          {name}
        </Text>
      </Row>
    )
  }
)

ActiveCategory.displayName = 'ActiveCategory'
export default ActiveCategory
