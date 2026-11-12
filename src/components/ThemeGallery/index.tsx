import React, { useState } from 'react'
import {
  Avatar,
  Button,
  Checkbox,
  Divider,
  Input,
  Keyboard,
  PinInput,
  Radio,
  SegmentedControl,
  Select,
  Slider,
  Spinner,
  Tag,
  Text,
  Toggle,
  useTheme
} from 'core'
import styles from './ThemeGallery.module.css'

export const Tile: React.FC<React.PropsWithChildren<{ title?: string }>> = ({
  title,
  children
}) => {
  const theme = useTheme()
  return (
    <div
      className={styles.tile}
      style={
        {
          background: theme.palette.accents_1,
          '--tile-bg': theme.palette.accents_1,
          borderColor: theme.palette.border,
          borderRadius: `calc(${theme.layout.radius} + 4px)`
        } as React.CSSProperties
      }
    >
      {title && (
        <Text small b my={0}>
          {title}
        </Text>
      )}
      {children}
    </div>
  )
}

export const Muted: React.FC<React.PropsWithChildren<unknown>> = ({
  children
}) => {
  const theme = useTheme()
  return (
    <Text
      small
      my={0}
      style={{ display: 'block', color: theme.palette.accents_5 }}
    >
      {children}
    </Text>
  )
}

const ThemeGallery: React.FC = () => {
  const [price, setPrice] = useState(250)
  return (
    <div className={styles.gallery}>
      <Tile>
        <Text small b my={0}>
          Your email
        </Text>
        <Input placeholder="john@email.com" width="100%" />
        <Muted>We won&apos;t share your email</Muted>
        <Select placeholder="Select one" width="100%">
          <Select.Option value="1">Active</Select.Option>
          <Select.Option value="2">Paused</Select.Option>
        </Select>
        <div className={styles.row}>
          <Checkbox checked />
          <Toggle initialChecked />
          <Radio checked value="1" />
          <Spinner />
        </div>
        <div className={styles.between}>
          <Text small b my={0}>
            Price
          </Text>
          <Text small b my={0}>
            US$ {price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </Text>
        </div>
        <Slider initialValue={250} max={500} hideValue onChange={setPrice} />
      </Tile>

      <Tile>
        <SegmentedControl initialValue="1d" fullWidth aria-label="Range">
          <SegmentedControl.Item value="1d">1D</SegmentedControl.Item>
          <SegmentedControl.Item value="7d">7D</SegmentedControl.Item>
          <SegmentedControl.Item value="1m">1M</SegmentedControl.Item>
          <SegmentedControl.Item value="1y">1Y</SegmentedControl.Item>
        </SegmentedControl>
        <SegmentedControl initialValue="chats" fullWidth aria-label="Inbox">
          <SegmentedControl.Item value="chats">Chats</SegmentedControl.Item>
          <SegmentedControl.Item value="emails">Emails</SegmentedControl.Item>
        </SegmentedControl>
        <div className={styles.menu}>
          <Muted>Actions</Muted>
          <div className={styles.between}>
            <Text small b my={0}>
              New file
            </Text>
            <Keyboard command>N</Keyboard>
          </div>
          <div className={styles.between}>
            <Text small b my={0}>
              Edit file
            </Text>
            <Keyboard command>E</Keyboard>
          </div>
          <Divider />
          <Muted>Danger zone</Muted>
          <div className={styles.between}>
            <Text small b my={0} type="error">
              Delete file
            </Text>
            <Keyboard command option>
              D
            </Keyboard>
          </div>
        </div>
      </Tile>

      <Tile>
        <div className={styles.center}>
          <Avatar.Group count={2}>
            <Avatar text="AB" />
            <Avatar text="CD" />
            <Avatar text="EF" />
          </Avatar.Group>
        </div>
        <Text b my={0}>
          Verify account
        </Text>
        <Muted>We&apos;ve sent a code to a****@gmail.com</Muted>
        <PinInput length={6} initialValue="432" numeric aria-label="Code" />
        <div className={styles.row}>
          <Button auto scale={0.8} type="primary">
            Click me
          </Button>
          <Button auto scale={0.8} type="secondary-light">
            Click me
          </Button>
          <Button auto scale={0.8} type="error">
            Click me
          </Button>
          <Button auto scale={0.8} type="error-light">
            Click me
          </Button>
        </div>
      </Tile>

      <Tile>
        <div className={styles.center}>
          <Text b my={0}>
            Create an account
          </Text>
          <Muted>Start your free 7-day trial. No credit card required.</Muted>
        </div>
        <Button type="primary" width="100%">
          Get Started
        </Button>
        <Divider>OR</Divider>
        <Button width="100%">Continue with Google</Button>
        <Button width="100%">Continue with Apple</Button>
      </Tile>

      <Tile>
        <div className={styles.row}>
          <Avatar text="BO" />
          <div>
            <Text b my={0}>
              Bolio UI
            </Text>
            <Muted>@bolio_ui</Muted>
          </div>
        </div>
        <Text small my={0}>
          Building the future of UI for web and mobile.
        </Text>
        <Muted>
          <b>4</b> Following · <b>97.1K</b> Followers
        </Muted>
      </Tile>

      <Tile>
        <div className={styles.between}>
          <div>
            <Text small b my={0}>
              You have 2 credits left
            </Text>
            <Muted>Get a paid plan for more credits</Muted>
          </div>
          <Button auto scale={0.7}>
            Upgrade
          </Button>
        </div>
      </Tile>

      <Tile>
        <div className={styles.between}>
          <div>
            <Text small b my={0}>
              Allow notifications
            </Text>
            <Muted>Receive push notifications</Muted>
          </div>
          <Toggle initialChecked />
        </div>
      </Tile>

      <Tile>
        <Text b my={0}>
          Unsaved changes
        </Text>
        <Muted>Do you want to save or discard changes?</Muted>
        <div className={styles.row}>
          <Button auto>Discard</Button>
          <Button auto type="primary">
            Save changes
          </Button>
          <Tag type="primary" light>
            Draft
          </Tag>
        </div>
      </Tile>
    </div>
  )
}

export default ThemeGallery
