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
import { mix, useSettings } from 'src/utils/use-settings'
import * as Icons from '@bolio-ui/icons'
import styles from './HeroComponents.module.css'

type Icon = keyof typeof Icons

export const ProfileCard = () => {
  const theme = useTheme()
  return (
    <>
      <Card className={styles.profileCard} width="100%" bordered>
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
        className={styles.search}
        borderColor={theme.palette.accents_2}
        hoverBorder={theme.palette.accents_3}
      />
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
        className={styles.toggle}
      />
    </>
  )
}

export const ButtonLoading = () => {
  return (
    <>
      <Card className={styles.button} bordered>
        <Spinner />
      </Card>
    </>
  )
}

export const ButtonIcon = () => {
  return (
    <>
      <Button
        icon={<Icons.Sliders />}
        auto
        className={styles.buttonIcon}
        style={{
          border: 'none'
        }}
        aria-label="Button Icon"
      />
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
  return <CurrentIcon color={color} fontSize={26} />
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
      <div className={styles.infoCard}>
        <div className={styles.infoContainer}>
          <img
            src={src}
            alt="img"
            style={{
              objectFit: 'cover',
              width: '100%',
              height: '185px'
            }}
            className={styles.infoImage}
          />
          <div className={styles.infoContent}>
            <Badge
              style={{
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
    </>
  )
}

export const InfoUsersCard = ({ title, subtitle, src }: InfoCardProps) => {
  return (
    <>
      <div className={styles.infoCard}>
        <div className={styles.infoContainer}>
          <img
            src={src}
            alt="img"
            style={{
              objectFit: 'cover',
              width: '100%',
              height: '185px'
            }}
            className={styles.infoImage}
          />
          <div className={styles.infoContent}>
            <Text font="14px" my={0}>
              {title}
            </Text>
            <Text font={1} b>
              {subtitle}
            </Text>
            <Avatar.Group count={6} ml={0.5} mt={2.5}>
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
    </>
  )
}

export const FollowersCard = () => {
  const theme = useTheme()
  return (
    <>
      <Card className={styles.followersCard} width="100%" bordered>
        <Grid.Container>
          <Grid xs={12} md={12}>
            <Row align="middle">
              <div style={{ marginRight: 15 }}>
                <div
                  className={styles.borderGradient}
                  style={
                    {
                      '--hero-code': theme.palette.code,
                      '--hero-code-dark': mix(theme.palette.code, 0, 0.35)
                    } as React.CSSProperties
                  }
                >
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
            </Row>
          </Grid>
          <Grid xs={6} md={6}>
            <Button
              type="default"
              rounded
              scale={1 / 2}
              width="95%"
              mt={1}
              aria-label="Button Reject"
            >
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
              aria-label="Button Accept"
            >
              Accept
            </Button>
          </Grid>
        </Grid.Container>
      </Card>
    </>
  )
}

export const Player = () => {
  const theme = useTheme()
  return (
    <>
      <Card className={styles.playerCard} width="100%" bordered>
        <Row justify="space-between">
          <Button
            icon={<Icons.ArrowLeft stroke={theme.palette.foreground} />}
            type="abort"
            auto
            aria-label="Button Arrow Left Player"
          />
          <Text b my={0} mt={0.4}>
            Play now
          </Text>
          <Button
            icon={<Icons.MoreVertical stroke={theme.palette.foreground} />}
            type="abort"
            auto
            aria-label="Button More Vertical Player"
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
        <Capacity color={theme.palette.code} width="100%" value={45} />
        <Spacer h={1.5} />
        <Row align="middle" justify="space-between">
          <Button
            icon={<Icons.Shuffle stroke={theme.palette.foreground} />}
            type="abort"
            scale={0.8}
            auto
            aria-label="Button Shuffle Player"
          />
          <Button
            icon={<Icons.SkipBack stroke={theme.palette.foreground} />}
            type="abort"
            scale={0.8}
            auto
            aria-label="Button Skip Back Player"
          />
          <Button
            icon={<Icons.Play stroke="white" />}
            type="secondary"
            rounded
            auto
            scale={1}
            aria-label="Button Play Player"
          />
          <Button
            icon={<Icons.SkipForward stroke={theme.palette.foreground} />}
            type="abort"
            auto
            scale={0.8}
            aria-label="Button Skip Forward Player"
          />
          <Button
            icon={<Icons.Repeat stroke={theme.palette.foreground} />}
            type="abort"
            auto
            scale={0.8}
            aria-label="Button Repeat Player"
          />
        </Row>
      </Card>
    </>
  )
}
