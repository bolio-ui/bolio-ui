import React from 'react'
import {
  useTheme,
  Row,
  Col,
  Text,
  Card,
  Input,
  Button,
  Avatar,
  Tag,
  Spacer,
  Badge,
  Capacity
} from 'core'
import * as Icons from '@bolio-ui/icons'

type Icon = keyof typeof Icons

export const ProfileCard = () => {
  const theme = useTheme()
  return (
    <>
      <Card
        style={{
          background: 'rgba(194, 95, 255, 0.2) none repeat scroll 0% 0%'
        }}
        className="profile_card_hero"
        width="100%"
      >
        <Row align="middle">
          <Col span={4}>
            <Avatar
              alt="Your Avatar"
              mr={1.5}
              height={3}
              width={3}
              src="https://bolio-nextjs.vercel.app/_next/static/images/2-a0f5306c52277e607fa93f04d7174cdb.jpg"
            />
          </Col>
          <Col>
            <Text h3 my={0}>
              Veronika Ponte
            </Text>
            <Tag
              style={{
                background: 'rgba(194, 95, 255, 0.2) none repeat scroll 0% 0%',
                border: 'none'
              }}
              scale={0.5}
            >
              <Icons.Star fontSize={8} /> 12,346
            </Tag>
          </Col>
        </Row>
        <Spacer h={1} />
        <Row align="middle">
          <Text b font={1} my={0}>
            Contact info
          </Text>
        </Row>
        <Spacer h={1} />
        <Row align="middle">
          <Tag
            style={{
              background: 'rgba(194, 95, 255, 0.2) none repeat scroll 0% 0%',
              border: 'none'
            }}
          >
            <Icons.Mail fontSize={16} />
          </Tag>
          <Text my={0} ml={0.5}>
            veronika.ponte@gmail.com
          </Text>
        </Row>
        <Spacer h={0.5} />
        <Row align="middle">
          <Tag
            style={{
              background: 'rgba(194, 95, 255, 0.2) none repeat scroll 0% 0%',
              border: 'none'
            }}
          >
            <Icons.Phone fontSize={16} />
          </Tag>
          <Text my={0} ml={0.5}>
            +1-541-754-3010
          </Text>
        </Row>
        <Spacer h={0.5} />
        <Row align="middle">
          <Tag
            style={{
              background: 'rgba(194, 95, 255, 0.2) none repeat scroll 0% 0%',
              border: 'none'
            }}
          >
            <Icons.MapPin fontSize={16} />
          </Tag>
          <Text my={0} ml={0.5}>
            1382 Allison Ave, Echo Park
          </Text>
        </Row>
        <Spacer h={3.5} />
        <Row align="middle" justify="end">
          <Button
            icon={<Icons.MessageCircle stroke={theme.palette.foreground} />}
            auto
            style={{
              background: 'rgba(194, 95, 255, 0.2) none repeat scroll 0% 0%',
              border: 'none',
              color: theme.palette.foreground
            }}
          >
            Message
          </Button>
        </Row>
      </Card>
      <style global jsx>{`
        .profile_card_hero {
          width: 100%;
          animation: levitating 12s ease-in-out infinite;
        }
        @keyframes levitating {
          0% {
            transform: translateX(0);
          }
          30% {
            transform: translateX(-10px);
          }
          50% {
            transform: translateX(4px);
          }
          70% {
            transform: translateX(-15px);
          }
          100% {
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  )
}

export const Search = () => {
  return (
    <>
      <Input
        icon={<Icons.Search />}
        placeholder="Search..."
        height={1.1}
        font={1}
        width="100%"
        className="search_hero"
        backgroundColor="rgba(194, 95, 255, 0.2) none repeat scroll 0% 0%"
        borderColor="none"
      />
      <style global jsx>{`
        .search_hero {
          animation: levitating 6s ease-in-out infinite;
        }
        @keyframes levitating {
          0% {
            transform: translateX(0);
          }
          30% {
            transform: translateX(-10px);
          }
          50% {
            transform: translateX(4px);
          }
          70% {
            transform: translateX(-15px);
          }
          100% {
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  )
}

export const ButtonIcon = () => {
  return (
    <>
      <Button
        icon={<Icons.Sliders />}
        auto
        className="button_icon_hero"
        style={{
          background: 'rgba(194, 95, 255, 0.2) none repeat scroll 0% 0%',
          border: 'none'
        }}
      />
      <style global jsx>{`
        .button_icon_hero {
          animation: levitating 9s ease-in-out infinite;
        }
        @keyframes levitating {
          0% {
            transform: translateX(0);
          }
          30% {
            transform: translateX(-10px);
          }
          50% {
            transform: translateX(4px);
          }
          70% {
            transform: translateX(-15px);
          }
          100% {
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  )
}

interface InfoCardProps {
  title: string
  quantity: string
  info: string
  icon: Icon
}

const renderIcon = (icon: Icon, color: string) => {
  const CurrentIcon = Icons[icon]
  return <CurrentIcon color={color} fontSize={26} /> || null
}

export const InfoCard = ({ title, quantity, info, icon }: InfoCardProps) => {
  const theme = useTheme()
  return (
    <>
      <Card
        style={{
          background: 'rgba(194, 95, 255, 0.2) none repeat scroll 0% 0%'
        }}
        className="info_card_hero"
        width="100%"
        height="185px"
      >
        <Badge
          style={{
            background: 'rgba(194, 95, 255, 0.2) none repeat scroll 0% 0%',
            borderRadius: '50%',
            padding: 14
          }}
        >
          {renderIcon(icon, theme.palette.foreground)}
        </Badge>
        <Text my={0} mt={2}>
          {title}
        </Text>
        <Row>
          <Text h2 my={0} mb={2}>
            {quantity}
          </Text>
          <Text my={0} ml={0.2} pt={0.8}>
            {info}
          </Text>
        </Row>
      </Card>
      <style global jsx>{`
        .info_card_hero {
          width: 100%;
          animation: levitating 12s ease-in-out infinite;
        }
        @keyframes levitating {
          0% {
            transform: translateX(0);
          }
          30% {
            transform: translateX(-10px);
          }
          50% {
            transform: translateX(4px);
          }
          70% {
            transform: translateX(-15px);
          }
          100% {
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  )
}

export const FollowersCard = () => {
  const theme = useTheme()
  return (
    <>
      <Card
        style={{
          background: 'rgba(194, 95, 255, 0.2) none repeat scroll 0% 0%'
        }}
        className="followers_card_hero"
        width="100%"
      >
        <Row align="middle" justify="space-between">
          <Badge
            style={{
              background: 'rgba(194, 95, 255, 0.2) none repeat scroll 0% 0%',
              borderRadius: '50%',
              padding: 28
            }}
            mr={1.5}
          >
            {renderIcon('Users', theme.palette.foreground)}
          </Badge>
          <Col>
            <Text p my={0}>
              Followers
            </Text>
            <Text h3 my={0}>
              12.566
            </Text>
          </Col>
          <Row>
            <Icons.BarChart2 fontSize={32} />
          </Row>
        </Row>
      </Card>
      <style global jsx>{`
        .followers_card_hero {
          width: 100%;
          animation: levitating 3s ease-in-out infinite;
        }
        @keyframes levitating {
          0% {
            transform: translateX(0);
          }
          30% {
            transform: translateX(-10px);
          }
          50% {
            transform: translateX(4px);
          }
          70% {
            transform: translateX(-15px);
          }
          100% {
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  )
}

export const Player = () => {
  const theme = useTheme()
  return (
    <>
      <Card
        style={{
          background: 'rgba(194, 95, 255, 0.2) none repeat scroll 0% 0%'
        }}
        className="player_card_hero"
        width="100%"
      >
        <Row justify="space-between">
          <Button
            icon={<Icons.ArrowLeft stroke={theme.palette.foreground} />}
            auto
            style={{
              background: 'rgba(194, 95, 255, 0.2) none repeat scroll 0% 0%',
              border: 'none'
            }}
          />
          <Text my={0}>Play now</Text>
          <Button
            icon={<Icons.MoreVertical stroke={theme.palette.foreground} />}
            auto
            style={{
              background: 'rgba(194, 95, 255, 0.2) none repeat scroll 0% 0%',
              border: 'none'
            }}
          />
        </Row>
        <Spacer h={2} />
        <Row align="middle" justify="center">
          <Col>
            <Avatar
              alt="Your Avatar"
              mr={1.5}
              height={5}
              width={5}
              src="https://bolio-nextjs.vercel.app/_next/static/images/1-b91719623c4254c6f46115d025adab47.jpg"
            />
          </Col>
          <Col>
            <Text b my={0}>
              Never Go Back
            </Text>
            <Text my={0}>Dennis Lloyd</Text>
          </Col>
        </Row>
        <Spacer h={1} />
        <Row justify="center"></Row>
        <Spacer h={1} />
        <Row justify="space-between">
          <Text my={0}>1:25</Text>
          <Text my={0}>3:18</Text>
        </Row>
        <Capacity color="#c25fff" width="100%" value={45} />
        <Spacer h={1} />
        <Row align="middle" justify="space-between">
          <Button
            icon={<Icons.Shuffle stroke={theme.palette.foreground} />}
            auto
            style={{
              background: 'rgba(194, 95, 255, 0.2) none repeat scroll 0% 0%',
              border: 'none'
            }}
          />
          <Button
            icon={<Icons.SkipBack stroke={theme.palette.foreground} />}
            auto
            style={{
              background: 'rgba(194, 95, 255, 0.2) none repeat scroll 0% 0%',
              border: 'none'
            }}
          />
          <Button
            icon={<Icons.Play stroke={theme.palette.foreground} />}
            auto
            style={{
              background: 'rgba(194, 95, 255, 0.2) none repeat scroll 0% 0%',
              border: 'none'
            }}
          />
          <Button
            icon={<Icons.SkipForward stroke={theme.palette.foreground} />}
            auto
            style={{
              background: 'rgba(194, 95, 255, 0.2) none repeat scroll 0% 0%',
              border: 'none'
            }}
          />
          <Button
            icon={<Icons.Repeat stroke={theme.palette.foreground} />}
            auto
            style={{
              background: 'rgba(194, 95, 255, 0.2) none repeat scroll 0% 0%',
              border: 'none'
            }}
          />
        </Row>
      </Card>
      <style global jsx>{`
        .player_card_hero {
          width: 100%;
          animation: levitating 9s ease-in-out infinite;
        }
        @keyframes levitating {
          0% {
            transform: translateX(0);
          }
          30% {
            transform: translateX(-10px);
          }
          50% {
            transform: translateX(4px);
          }
          70% {
            transform: translateX(-15px);
          }
          100% {
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  )
}
