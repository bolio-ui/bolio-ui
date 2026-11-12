// Default render of every component, shared by the smoke and accessibility tests.
import React from 'react'
import * as Bolio from '..'

const {
  Alert,
  Autocomplete,
  Avatar,
  Badge,
  BarsList,
  BulletChart,
  MatrixChart,
  SunburstChart,
  WaffleChart,
  GaugeChart,
  Heatmap,
  Sparkline,
  Breadcrumbs,
  Button,
  ButtonDropdown,
  ButtonGroup,
  Calendar,
  Capacity,
  Card,
  Diff,
  EmojiPicker,
  JsonViewer,
  Schedule,
  Carousel,
  Checkbox,
  Chip,
  Code,
  ColorInput,
  ColorPicker,
  Collapse,
  Combobox,
  Container,
  ContextMenu,
  CssBaseline,
  DatePicker,
  DateRangePicker,
  Description,
  Display,
  Divider,
  Dot,
  Drawer,
  Dropzone,
  Fieldset,
  FileInput,
  Grid,
  Image,
  ImageZoom,
  Input,
  Keyboard,
  Link,
  Loading,
  Mention,
  Mark,
  Menu,
  Modal,
  MonthPicker,
  TimePicker,
  Note,
  NumberInput,
  Page,
  Pagination,
  PinInput,
  Popover,
  Progress,
  Radio,
  Rating,
  RollingNumber,
  Row,
  ScrollArea,
  Section,
  SegmentedControl,
  Select,
  Skeleton,
  Slider,
  Snippet,
  Spacer,
  Spoiler,
  Spinner,
  Splitter,
  Stepper,
  Table,
  Tabs,
  Tag,
  TagsInput,
  Text,
  Textarea,
  Toggle,
  Toolbar,
  Tooltip,
  Tour,
  Tree
} = Bolio

export const cases: Array<[string, () => React.ReactElement]> = [
  ['Diff', () => <Diff previousValue="a" currentValue="b" />],
  [
    'EmojiPicker',
    () => (
      <EmojiPicker
        data={[
          {
            id: 'faces',
            label: 'Faces',
            emojis: [{ emoji: '😀', name: 'grinning face' }]
          }
        ]}
      />
    )
  ],
  ['JsonViewer', () => <JsonViewer value={{ a: 1, b: [1, 2] }} />],
  ['Schedule', () => <Schedule onSlotClick={() => undefined} />],
  [
    'Autocomplete',
    () => <Autocomplete aria-label="Fruit" data={['Apple', 'Pear']} />
  ],
  ['Avatar', () => <Avatar text="BA" />],
  ['Badge', () => <Badge>new</Badge>],
  ['GaugeChart', () => <GaugeChart aria-label="CPU" value={60} />],
  [
    'Heatmap',
    () => (
      <Heatmap
        aria-label="Activity"
        data={{ '2026-01-02': 3 }}
        startDate="2026-01-01"
        endDate="2026-03-01"
      />
    )
  ],
  [
    'BulletChart',
    () => (
      <BulletChart
        aria-label="Revenue"
        value={270}
        target={250}
        ranges={[{ value: 150 }, { value: 300 }]}
      />
    )
  ],
  [
    'MatrixChart',
    () => (
      <MatrixChart
        aria-label="Deploys"
        data={[
          { x: 'Mon', y: 'api', value: 4 },
          { x: 'Tue', y: 'api', value: null }
        ]}
      />
    )
  ],
  [
    'SunburstChart',
    () => (
      <SunburstChart
        aria-label="Stock"
        data={[{ name: 'Fruit', children: [{ name: 'Apple', value: 3 }] }]}
      />
    )
  ],
  [
    'WaffleChart',
    () => (
      <WaffleChart aria-label="Share" data={[{ name: 'Chrome', value: 65 }]} />
    )
  ],
  ['BarsList', () => <BarsList data={[{ name: 'React', value: 10 }]} />],
  ['Sparkline', () => <Sparkline aria-label="Visits" data={[1, 3, 2]} />],
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
  [
    'Carousel',
    () => (
      <Carousel aria-label="Highlights">
        <div>One</div>
        <div>Two</div>
      </Carousel>
    )
  ],
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
    'ColorInput',
    () => <ColorInput aria-label="Brand color" initialValue="#2563eb" />
  ],
  [
    'ColorPicker',
    () => <ColorPicker aria-label="Brand color" initialValue="#2563eb" />
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
  [
    'ContextMenu',
    () => <ContextMenu content={<Menu.Item>Copy</Menu.Item>}>Area</ContextMenu>
  ],
  ['CssBaseline', () => <CssBaseline />],
  ['DatePicker', () => <DatePicker aria-label="Birthday" />],
  ['DateRangePicker', () => <DateRangePicker aria-label="Stay" />],
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
  ['Dropzone', () => <Dropzone aria-label="Attachments" />],
  ['FileInput', () => <FileInput aria-label="Upload" />],
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
  ['ImageZoom', () => <ImageZoom src="/a.jpg" alt="A photo" />],
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
  ['NumberInput', () => <NumberInput aria-label="Quantity" min={0} />],
  [
    'Page',
    () => (
      <Page>
        <Page.Content>Content</Page.Content>
      </Page>
    )
  ],
  ['Pagination', () => <Pagination count={5} initialPage={1} />],
  ['PinInput', () => <PinInput aria-label="Code" numeric initialValue="12" />],
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
  ['Mark', () => <Mark highlight="a">Mark</Mark>],
  ['Rating', () => <Rating value={3} />],
  ['RollingNumber', () => <RollingNumber value={1280} />],
  [
    'Row',
    () => (
      <Row>
        <span>Row</span>
      </Row>
    )
  ],
  ['ScrollArea', () => <ScrollArea height="100px">Content</ScrollArea>],
  ['Section', () => <Section>Section</Section>],
  [
    'SegmentedControl',
    () => (
      <SegmentedControl initialValue="a" aria-label="Period">
        <SegmentedControl.Item value="a">Day</SegmentedControl.Item>
        <SegmentedControl.Item value="b">Week</SegmentedControl.Item>
      </SegmentedControl>
    )
  ],
  [
    'Select',
    () => (
      <Select placeholder="Pick">
        <Select.Option value="1">One</Select.Option>
        <Select.Option value="2">Two</Select.Option>
      </Select>
    )
  ],
  ['Skeleton', () => <Skeleton lines={2} />],
  ['Slider', () => <Slider initialValue={20} />],
  ['Snippet', () => <Snippet text="yarn add @bolio-ui/core" />],
  ['Spacer', () => <Spacer h={1} />],
  ['Spoiler', () => <Spoiler>Content</Spoiler>],
  ['Spinner', () => <Spinner />],
  [
    'Splitter',
    () => (
      <Splitter aria-label="Layout">
        <Splitter.Panel defaultSize={30}>A</Splitter.Panel>
        <Splitter.Panel>B</Splitter.Panel>
      </Splitter>
    )
  ],
  [
    'Stepper',
    () => (
      <Stepper active={1} aria-label="Checkout">
        <Stepper.Step label="Cart" />
        <Stepper.Step label="Payment" />
      </Stepper>
    )
  ],
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
  [
    'TagsInput',
    () => <TagsInput aria-label="Skills" initialValue={['React']} />
  ],
  ['Text', () => <Text h1>Title</Text>],
  ['Textarea', () => <Textarea placeholder="write" />],
  ['MonthPicker', () => <MonthPicker initialValue={new Date(2026, 10, 1)} />],
  ['TimePicker', () => <TimePicker aria-label="Time" initialValue="09:30" />],
  ['Toggle', () => <Toggle />],
  [
    'Tooltip',
    () => (
      <Tooltip text="Tip">
        <span>Hover</span>
      </Tooltip>
    )
  ],
  [
    'Tour',
    () => (
      <Tour
        open
        onClose={() => undefined}
        steps={[{ title: 'Welcome', content: 'A short tour' }]}
      />
    )
  ],
  [
    'Tree',
    () => (
      <Tree
        aria-label="Files"
        data={[
          { value: 'a', label: 'A', children: [{ value: 'b', label: 'B' }] }
        ]}
        initialExpanded={['a']}
      />
    )
  ],
  ['Alert', () => <Alert title="Heads up">Your trial ends soon.</Alert>],
  [
    'Chip',
    () => (
      <Chip.Group multiple aria-label="Stack">
        <Chip value="react">React</Chip>
        <Chip value="vue">Vue</Chip>
      </Chip.Group>
    )
  ],
  [
    'Toolbar',
    () => (
      <Toolbar aria-label="Formatting">
        <button type="button">Bold</button>
        <Toolbar.Separator />
        <button type="button">Italic</button>
      </Toolbar>
    )
  ],
  [
    'Mention',
    () => (
      <Mention
        aria-label="Comment"
        options={[{ value: 'ana', label: 'Ana Souza' }]}
      />
    )
  ]
]
