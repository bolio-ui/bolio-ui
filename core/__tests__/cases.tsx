// Default render of every component, shared by the smoke and accessibility tests.
import React from 'react'
import * as Bolio from '..'

const {
  BolioUIProvider,
  Avatar,
  Badge,
  Breadcrumbs,
  Button,
  ButtonDropdown,
  ButtonGroup,
  Calendar,
  Capacity,
  Card,
  Checkbox,
  Code,
  Collapse,
  Combobox,
  Container,
  CssBaseline,
  DatePicker,
  Description,
  Display,
  Divider,
  Dot,
  Drawer,
  Fieldset,
  Grid,
  Image,
  Input,
  Keyboard,
  Link,
  Loading,
  Menu,
  Modal,
  Note,
  Page,
  Pagination,
  Popover,
  Progress,
  Radio,
  Rating,
  Row,
  Section,
  Select,
  Slider,
  Snippet,
  Spacer,
  Spinner,
  Table,
  Tabs,
  Tag,
  Text,
  Textarea,
  Toggle,
  Tooltip
} = Bolio

export const cases: Array<[string, () => React.ReactElement]> = [
  ['Avatar', () => <Avatar text="BA" />],
  ['Badge', () => <Badge>new</Badge>],
  [
    'Breadcrumbs',
    () => (
      <Breadcrumbs>
        <Breadcrumbs.Item>Home</Breadcrumbs.Item>
        <Breadcrumbs.Item>Docs</Breadcrumbs.Item>
      </Breadcrumbs>
    )
  ],
  ['Button', () => <Button>Click</Button>],
  [
    'ButtonDropdown',
    () => (
      <ButtonDropdown>
        <ButtonDropdown.Item main>Main</ButtonDropdown.Item>
        <ButtonDropdown.Item>Other</ButtonDropdown.Item>
      </ButtonDropdown>
    )
  ],
  [
    'ButtonGroup',
    () => (
      <ButtonGroup>
        <Button>One</Button>
        <Button>Two</Button>
      </ButtonGroup>
    )
  ],
  ['Calendar', () => <Calendar value={new Date(2026, 0, 15)} />],
  ['Capacity', () => <Capacity value={50} />],
  ['Card', () => <Card>Content</Card>],
  ['Checkbox', () => <Checkbox>Check</Checkbox>],
  ['Code', () => <Code>yarn add</Code>],
  [
    'Code with tabs',
    () => (
      <Code block tabs={['app.js', 'main.js']}>
        yarn add
      </Code>
    )
  ],
  [
    'Collapse',
    () => (
      <Collapse title="Title" subtitle="Sub">
        Body
      </Collapse>
    )
  ],
  [
    'Combobox',
    () => (
      <Combobox
        aria-label="Country"
        options={[{ value: 'br', label: 'Brazil' }]}
      />
    )
  ],
  ['Container', () => <Container>Content</Container>],
  ['CssBaseline', () => <CssBaseline />],
  ['DatePicker', () => <DatePicker aria-label="Birthday" />],
  ['Description', () => <Description title="T" content="C" />],
  ['Display', () => <Display caption="Caption">Content</Display>],
  ['Divider', () => <Divider />],
  ['Dot', () => <Dot>Dot</Dot>],
  [
    'Drawer',
    () => (
      <Drawer visible={false} placement="right" onClose={() => undefined}>
        Content
      </Drawer>
    )
  ],
  [
    'Fieldset',
    () => (
      <Fieldset>
        <Fieldset.Title>Title</Fieldset.Title>
        <Fieldset.Subtitle>Sub</Fieldset.Subtitle>
      </Fieldset>
    )
  ],
  [
    'Grid',
    () => (
      <Grid.Container gap={1}>
        <Grid xs={12}>Cell</Grid>
      </Grid.Container>
    )
  ],
  ['Image', () => <Image src="/logo.svg" alt="logo" width={20} height={20} />],
  ['Input', () => <Input placeholder="type" />],
  ['Input.Password', () => <Input.Password placeholder="secret" />],
  ['Keyboard', () => <Keyboard>K</Keyboard>],
  ['Link', () => <Link href="/">Home</Link>],
  ['Loading', () => <Loading />],
  [
    'Menu',
    () => (
      <Menu trigger={<Button>Options</Button>}>
        <Menu.Item>Edit</Menu.Item>
      </Menu>
    )
  ],
  [
    'Modal',
    () => (
      <Modal visible={false} onClose={() => undefined}>
        <Modal.Title>Title</Modal.Title>
      </Modal>
    )
  ],
  ['Note', () => <Note>Note</Note>],
  [
    'Page',
    () => (
      <Page>
        <Page.Content>Content</Page.Content>
      </Page>
    )
  ],
  ['Pagination', () => <Pagination count={5} initialPage={1} />],
  [
    'Popover',
    () => (
      <Popover content={<span>Body</span>}>
        <span>Trigger</span>
      </Popover>
    )
  ],
  ['Progress', () => <Progress value={30} />],
  [
    'Radio',
    () => (
      <Radio.Group value="1" onChange={() => undefined}>
        <Radio value="1">One</Radio>
        <Radio value="2">Two</Radio>
      </Radio.Group>
    )
  ],
  ['Rating', () => <Rating value={3} />],
  [
    'Row',
    () => (
      <Row>
        <span>Row</span>
      </Row>
    )
  ],
  ['Section', () => <Section>Section</Section>],
  [
    'Select',
    () => (
      <Select placeholder="Pick">
        <Select.Option value="1">One</Select.Option>
        <Select.Option value="2">Two</Select.Option>
      </Select>
    )
  ],
  ['Slider', () => <Slider initialValue={20} />],
  ['Snippet', () => <Snippet text="yarn add @bolio-ui/core" />],
  ['Spacer', () => <Spacer h={1} />],
  ['Spinner', () => <Spinner />],
  [
    'Table',
    () => (
      <Table data={[{ name: 'Ada' }]}>
        <Table.Column prop="name" label="Name" />
      </Table>
    )
  ],
  [
    'Tabs',
    () => (
      <Tabs initialValue="1">
        <Tabs.Item label="One" value="1">
          One
        </Tabs.Item>
        <Tabs.Item label="Two" value="2">
          Two
        </Tabs.Item>
      </Tabs>
    )
  ],
  ['Tag', () => <Tag>Tag</Tag>],
  ['Text', () => <Text h1>Title</Text>],
  ['Textarea', () => <Textarea placeholder="write" />],
  ['Toggle', () => <Toggle />],
  [
    'Tooltip',
    () => (
      <Tooltip text="Tip">
        <span>Hover</span>
      </Tooltip>
    )
  ]
]
