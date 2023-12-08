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
  Capacity,
  Toggle,
  Grid,
  Spinner
} from 'core'
import { useSettings } from 'src/utils/use-settings'
import * as Icons from '@bolio-ui/icons'

type Icon = keyof typeof Icons

export const ProfileCard = () => {
  const theme = useTheme()
  return (
    <>
      <Card
        className="profile_card_hero"
        width="100%"
        bordered={theme.type === 'light'}
      >
        <Row align="middle">
          <Col span={4}>
            <Avatar
              alt="Your Avatar"
              mr={1.5}
              height={3}
              width={3}
              src="/img/jpg/home/img1.jpg"
            />
          </Col>
          <Col>
            <Text h3 my={0}>
              Veronika Ponte
            </Text>
            <Tag
              style={{
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
          <Tag>
            <Icons.Mail fontSize={16} />
          </Tag>
          <Text my={0} ml={0.5}>
            veronika.ponte@gmail.com
          </Text>
        </Row>
        <Spacer h={0.5} />
        <Row align="middle">
          <Tag>
            <Icons.Phone fontSize={16} />
          </Tag>
          <Text my={0} ml={0.5}>
            +1-541-754-3010
          </Text>
        </Row>
        <Spacer h={0.5} />
        <Row align="middle">
          <Tag>
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
  const theme = useTheme()
  return (
    <>
      <Input
        icon={<Icons.Search />}
        placeholder="Search..."
        height={1.1}
        font={1}
        width="100%"
        className="search_hero"
        borderColor={theme.type === 'light' ? theme.palette.accents_2 : 'none'}
        hoverBorder={theme.type === 'light' ? theme.palette.accents_3 : 'none'}
      />
      <style global jsx>{`
        .search_hero {
          margin-top: 6px;
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

export const Toogle = () => {
  const theme = useTheme()
  const settings = useSettings()
  return (
    <>
      <Toggle
        type="secondary"
        scale={2}
        w={1.8}
        mt="8px"
        initialChecked
        onChange={() =>
          settings.switchTheme(theme.type === 'dark' ? 'light' : 'dark')
        }
        className="toogle_hero"
      />
      <style global jsx>{`
        .toogle_hero {
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

export const ButtonLoading = () => {
  const theme = useTheme()
  return (
    <>
      <Card className="button_hero" bordered={theme.type === 'light'}>
        <Spinner />
      </Card>
      <style global jsx>{`
        .button_hero {
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

export const ButtonIcon = () => {
  return (
    <>
      <Button
        icon={<Icons.Sliders />}
        auto
        className="button_icon_hero"
        style={{
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
  title?: string
  quantity?: string
  info?: string
  icon?: Icon
  src?: string
  subtitle?: string
}

const renderIcon = (icon: Icon, color: string) => {
  const CurrentIcon = Icons[icon]
  return <CurrentIcon color={color} fontSize={26} /> || null
}

export const InfoCard = ({
  title,
  quantity,
  info,
  icon,
  src
}: InfoCardProps) => {
  const theme = useTheme()
  return (
    <>
      <div className="info_card_hero">
        <div className="info_card_container">
          <img
            src={src}
            alt="img"
            style={{
              objectFit: 'cover',
              width: '100%',
              height: '185px'
            }}
            className="info_card_image"
          />
          <div className="info_card_content">
            <Badge
              style={{
                background: 'rgba(0, 0, 0, 0.1) none repeat scroll 0% 0%',
                borderRadius: '50%',
                padding: 12
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
          </div>
        </div>
      </div>
      <style global jsx>{`
        .info_card_hero {
          width: 100%;
          animation: levitating 12s ease-in-out infinite;
        }

        .info_card_container {
          position: relative;
        }

        .info_card_image {
          border-radius: 8px;
          opacity: 0.2;
          display: block;
          width: 100%;
          height: auto;
          transition: 0.5s ease;
          backface-visibility: hidden;
        }

        .info_card_content {
          padding: 20px;
          transition: 0.5s ease;
          position: absolute;
          top: 0%;
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

export const InfoUsersCard = ({ title, subtitle, src }: InfoCardProps) => {
  return (
    <>
      <div className="info_users_card_hero">
        <div className="info_users_card_container">
          <img
            src={src}
            alt="img"
            style={{
              objectFit: 'cover',
              width: '100%',
              height: '185px'
            }}
            className="info_card_image"
          />
          <div className="info_users_card_content">
            <Text font="14px" my={0}>
              {title}
            </Text>
            <Text h5 my={0} mb={3.5}>
              {subtitle}
            </Text>
            <Avatar.Group count={6} ml={0.5}>
              <Avatar
                src="https://i.pravatar.cc/150?img=60"
                width={1.2}
                height={1.2}
                stacked
              />
              <Avatar
                src="https://i.pravatar.cc/150?img=30"
                width={1.2}
                height={1.2}
                stacked
              />
              <Avatar text="Mag" width={1.2} height={1.2} stacked />
            </Avatar.Group>
          </div>
        </div>
      </div>
      <style global jsx>{`
        .info_users_card_hero {
          width: 100%;
          animation: levitating 12s ease-in-out infinite;
        }

        .info_users_card_container {
          position: relative;
        }

        .info_users_card_image {
          border-radius: 8px;
          opacity: 0.2;
          display: block;
          width: 100%;
          height: auto;
          transition: 0.5s ease;
          backface-visibility: hidden;
        }

        .info_users_card_content {
          padding: 20px;
          transition: 0.5s ease;
          position: absolute;
          top: 0%;
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
        className="followers_card_hero"
        width="100%"
        bordered={theme.type === 'light'}
      >
        <Grid.Container>
          <Grid xs={12} md={12} alignItems="center">
            <div style={{ marginRight: 15 }}>
              <div className="border-gradient">
                <Badge.Anchor>
                  <Badge scale={1 / 2} type="default">
                    12
                  </Badge>
                  <Avatar
                    alt="Your Avatar"
                    mr={0}
                    height={2}
                    width={2}
                    src="/img/jpg/home/img1.jpg"
                  />
                </Badge.Anchor>
              </div>
            </div>
            <div>
              <Text b span my={0}>
                Kristian Watson
              </Text>
              <Text
                font={0.9}
                my={0}
                style={{ color: theme.palette.accents_6 }}
              >
                Challenges to a match
              </Text>
            </div>
          </Grid>
          <Grid xs={6} md={6}>
            <Button type="default" rounded scale={1 / 2} width="95%" mt={1}>
              Reject
            </Button>
          </Grid>
          <Grid xs={6} md={6}>
            <Button
              rounded
              scale={1 / 2}
              type="success"
              width="95%"
              iconRight={<Icons.Check stroke={'white'} />}
              mt={1}
            >
              Accept
            </Button>
          </Grid>
        </Grid.Container>
      </Card>
      <style global jsx>{`
        .followers_card_hero {
          width: 100%;
          animation: levitating 3s ease-in-out infinite;
        }
        .border-gradient {
          background: linear-gradient(#c25fff, #7828c9) padding-box,
            linear-gradient(to right, #c25fff, #7828c9) border-box;
          border-radius: 50em;
          border: 2px solid transparent;
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
        className="player_card_hero"
        width="100%"
        bordered={theme.type === 'light'}
      >
        <Row justify="space-between">
          <Button
            icon={<Icons.ArrowLeft stroke={theme.palette.foreground} />}
            type="abort"
            auto
          />
          <Text b my={0} mt={0.4}>
            Play now
          </Text>
          <Button
            icon={<Icons.MoreVertical stroke={theme.palette.foreground} />}
            type="abort"
            auto
          />
        </Row>
        <Spacer h={2.5} />
        <Row align="middle" justify="center">
          <Col>
            <Avatar
              alt="Your Avatar"
              mr={1.5}
              height={5}
              width={5}
              src="/img/jpg/home/img2.jpg"
            />
          </Col>
          <Col>
            <Text b my={0}>
              Radio mix
            </Text>
            <Text my={0}>Top 100 this week</Text>
          </Col>
        </Row>
        <Spacer h={2.5} />
        <Row justify="space-between">
          <Text my={0}>1:25</Text>
          <Text my={0}>3:18</Text>
        </Row>
        <Capacity color="#c25fff" width="100%" value={45} />
        <Spacer h={1.5} />
        <Row align="middle" justify="space-between">
          <Button
            icon={<Icons.Shuffle stroke={theme.palette.foreground} />}
            type="abort"
            scale={0.8}
            auto
          />
          <Button
            icon={<Icons.SkipBack stroke={theme.palette.foreground} />}
            type="abort"
            scale={0.8}
            auto
          />
          <Button
            icon={<Icons.Play stroke="white" />}
            type="secondary"
            rounded
            auto
            scale={1}
          />
          <Button
            icon={<Icons.SkipForward stroke={theme.palette.foreground} />}
            type="abort"
            auto
            scale={0.8}
          />
          <Button
            icon={<Icons.Repeat stroke={theme.palette.foreground} />}
            type="abort"
            auto
            scale={0.8}
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
