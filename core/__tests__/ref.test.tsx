import React from 'react'
import { render } from '@testing-library/react'
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
  Col,
  Collapse,
  Combobox,
  Container,
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
  Skeleton,
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

type Ref = React.RefObject<any>

// The ref points at the element that receives the native props: the root element,
// or the native input for form controls (Checkbox, Radio, Toggle). Select keeps its
// documented imperative handle (SelectRef).
const cases: Array<[string, (ref: Ref) => React.ReactElement, string?]> = [
  ['Avatar', (ref) => <Avatar ref={ref} text="BA" />],
  ['Badge', (ref) => <Badge ref={ref}>new</Badge>],
  [
    'Breadcrumbs',
    (ref) => (
      <Breadcrumbs ref={ref}>
        <Breadcrumbs.Item>Home</Breadcrumbs.Item>
      </Breadcrumbs>
    )
  ],
  ['Button', (ref) => <Button ref={ref}>Click</Button>, 'BUTTON'],
  [
    'ButtonDropdown',
    (ref) => (
      <ButtonDropdown ref={ref}>
        <ButtonDropdown.Item main>Main</ButtonDropdown.Item>
      </ButtonDropdown>
    )
  ],
  [
    'ButtonGroup',
    (ref) => (
      <ButtonGroup ref={ref}>
        <Button>One</Button>
      </ButtonGroup>
    )
  ],
  ['Calendar', (ref) => <Calendar ref={ref} />],
  ['Capacity', (ref) => <Capacity ref={ref} value={50} />],
  ['Card', (ref) => <Card ref={ref}>Content</Card>],
  ['Checkbox', (ref) => <Checkbox ref={ref}>Check</Checkbox>, 'INPUT'],
  ['Code', (ref) => <Code ref={ref}>yarn add</Code>],
  ['Col', (ref) => <Col ref={ref}>col</Col>],
  [
    'Collapse',
    (ref) => (
      <Collapse ref={ref} title="Title">
        Body
      </Collapse>
    )
  ],
  [
    'Combobox',
    (ref) => (
      <Combobox
        ref={ref}
        aria-label="Country"
        options={[{ value: 'br', label: 'Brazil' }]}
      />
    ),
    'INPUT'
  ],
  ['Container', (ref) => <Container ref={ref}>Content</Container>],
  [
    'DatePicker',
    (ref) => <DatePicker ref={ref} aria-label="Birthday" />,
    'INPUT'
  ],
  ['Description', (ref) => <Description ref={ref} title="T" content="C" />],
  ['Display', (ref) => <Display ref={ref}>Content</Display>],
  ['Divider', (ref) => <Divider ref={ref} />],
  ['Dot', (ref) => <Dot ref={ref}>Dot</Dot>],
  [
    'Drawer',
    (ref) => (
      <Drawer ref={ref} visible placement="right" onClose={() => undefined}>
        Content
      </Drawer>
    )
  ],
  [
    'Fieldset',
    (ref) => (
      <Fieldset ref={ref}>
        <Fieldset.Title>Title</Fieldset.Title>
      </Fieldset>
    )
  ],
  [
    'Grid',
    (ref) => (
      <Grid.Container ref={ref} gap={1}>
        <Grid xs={12}>Cell</Grid>
      </Grid.Container>
    )
  ],
  ['Image', (ref) => <Image ref={ref} src="/logo.svg" alt="logo" />],
  ['Input', (ref) => <Input ref={ref} placeholder="type" />, 'INPUT'],
  ['Keyboard', (ref) => <Keyboard ref={ref}>K</Keyboard>],
  [
    'Link',
    (ref) => (
      <Link ref={ref} href="/">
        Home
      </Link>
    ),
    'A'
  ],
  ['Loading', (ref) => <Loading ref={ref} />],
  [
    'Menu',
    (ref) => (
      <Menu ref={ref} trigger={<Button>Options</Button>}>
        <Menu.Item>Edit</Menu.Item>
      </Menu>
    )
  ],
  [
    'Modal',
    (ref) => (
      <Modal ref={ref} visible onClose={() => undefined}>
        <Modal.Title>Title</Modal.Title>
      </Modal>
    )
  ],
  ['Note', (ref) => <Note ref={ref}>Note</Note>],
  [
    'Page',
    (ref) => (
      <Page ref={ref}>
        <Page.Content>Content</Page.Content>
      </Page>
    )
  ],
  ['Pagination', (ref) => <Pagination ref={ref} count={5} initialPage={1} />],
  [
    'Popover',
    (ref) => (
      <Popover ref={ref} content={<span>Body</span>}>
        <span>Trigger</span>
      </Popover>
    )
  ],
  ['Progress', (ref) => <Progress ref={ref} value={30} />],
  [
    'Radio',
    (ref) => (
      <Radio.Group value="1">
        <Radio ref={ref} value="1">
          One
        </Radio>
      </Radio.Group>
    ),
    'INPUT'
  ],
  ['Rating', (ref) => <Rating ref={ref} value={3} />],
  ['Row', (ref) => <Row ref={ref}>row</Row>],
  ['Section', (ref) => <Section ref={ref}>Section</Section>],
  [
    'Select',
    (ref) => (
      <Select ref={ref} placeholder="Pick">
        <Select.Option value="1">One</Select.Option>
      </Select>
    )
  ],
  ['Skeleton', (ref) => <Skeleton ref={ref} />],
  ['Slider', (ref) => <Slider ref={ref} initialValue={20} />],
  ['Snippet', (ref) => <Snippet ref={ref} text="yarn add" />],
  ['Spacer', (ref) => <Spacer ref={ref} h={1} />],
  ['Spinner', (ref) => <Spinner ref={ref} />],
  [
    'Table',
    (ref) => (
      <Table ref={ref} data={[{ name: 'Ada' }]}>
        <Table.Column prop="name" label="Name" />
      </Table>
    )
  ],
  [
    'Tabs',
    (ref) => (
      <Tabs ref={ref} initialValue="1">
        <Tabs.Item label="One" value="1">
          One
        </Tabs.Item>
      </Tabs>
    )
  ],
  ['Tag', (ref) => <Tag ref={ref}>Tag</Tag>],
  ['Text', (ref) => <Text ref={ref}>Text</Text>],
  ['Textarea', (ref) => <Textarea ref={ref} placeholder="write" />, 'TEXTAREA'],
  ['Toggle', (ref) => <Toggle ref={ref} />, 'INPUT'],
  [
    'Tooltip',
    (ref) => (
      <Tooltip ref={ref} text="Tip">
        <span>Hover</span>
      </Tooltip>
    )
  ]
]

describe('ref: every component forwards it to a DOM element', () => {
  let errorSpy: jest.SpyInstance

  beforeEach(() => {
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined)
  })

  afterEach(() => {
    errorSpy.mockRestore()
  })

  // a rest parameter keeps jest from passing its `done` callback as `tag`
  it.each(cases)('%s', (...row) => {
    const [name, factory, tag] = row as (typeof cases)[number]
    const ref: Ref = React.createRef()
    render(<BolioUIProvider>{factory(ref)}</BolioUIProvider>)

    if (name === 'Select') {
      expect(ref.current).toEqual(
        expect.objectContaining({
          focus: expect.any(Function),
          blur: expect.any(Function)
        })
      )
    } else {
      expect(ref.current).toBeInstanceOf(HTMLElement)
    }
    if (tag) expect(ref.current.tagName).toBe(tag)
    // no "Function components cannot be given refs" warning
    expect(errorSpy.mock.calls.map((call) => String(call[0]))).toEqual([])
  })
})
