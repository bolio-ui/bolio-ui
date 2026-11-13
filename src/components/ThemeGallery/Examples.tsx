import React from 'react'
import {
  Activity,
  Archive,
  Bell,
  Bookmark,
  Briefcase,
  Calendar as CalendarIcon,
  Check,
  Disc,
  Flag,
  Folder,
  Mail as MailIcon,
  Github,
  Music,
  Pause,
  Play,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2,
  Zap,
  Clock,
  Globe,
  Heart,
  Key,
  MapPin,
  Shield,
  ShoppingCart,
  Columns,
  CreditCard,
  Edit2,
  Eye,
  File,
  Filter,
  HelpCircle,
  Inbox,
  Layout,
  List,
  LogOut,
  MessageCircle,
  Package,
  Phone,
  Plus,
  Search,
  Send,
  Settings,
  Sliders,
  Star,
  Target,
  Trash2,
  User,
  UserPlus,
  Users
} from '@bolio-ui/icons'
import {
  Avatar,
  Button,
  Calendar,
  Checkbox,
  Chip,
  Divider,
  Input,
  MiniCalendar,
  Radio,
  Rating,
  Progress,
  SegmentedControl,
  Select,
  Slider,
  Stat,
  Table,
  Tag,
  Text,
  Textarea,
  Timeline,
  Toggle,
  useTheme
} from 'core'
import { AreaChart, BarChart, LineChart } from 'core/Charts'
import ThemeGallery, { Muted, Tile } from './index'
import { IconButton, NavItem, Shell } from './Shell'
import styles from './ThemeGallery.module.css'

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
]

const frameStyle = (theme: ReturnType<typeof useTheme>) => ({
  borderColor: theme.palette.border,
  borderRadius: `calc(${theme.layout.radius} + 8px)`
})

const Head: React.FC<
  React.PropsWithChildren<{ title: string; sub?: string }>
> = ({ title, sub, children }) => (
  <div className={styles.between}>
    <div>
      <Text b my={0} style={{ fontSize: 18 }}>
        {title}
      </Text>
      {sub && <Muted>{sub}</Muted>}
    </div>
    <div className={styles.row}>{children}</div>
  </div>
)

const Metric: React.FC<{ label: string; value: string; change: string }> = (
  props
) => (
  <Tile>
    <Stat {...props} />
  </Tile>
)

const SIDEBAR_BOTTOM = (
  <div className={styles.nav}>
    <NavItem icon={<HelpCircle width={16} height={16} />} label="Help" />
    <NavItem icon={<LogOut width={16} height={16} />} label="Log out" />
  </div>
)

const icon = (Icon: React.ElementType) => <Icon width={16} height={16} />

const MEMBERS = [
  ['#4586936', 'Alex Turner', 'alex@acme.com', 'Product Manager'],
  ['#4586937', 'Emma Davis', 'emma@acme.com', 'Senior Designer'],
  ['#4586933', 'John Smith', 'john@acme.com', 'Chief Technology Officer'],
  ['#4586932', 'Kate Moore', 'kate@acme.com', 'Chief Executive Officer']
].map(([id, name, email, role]) => ({
  id,
  name,
  email,
  role,
  type: 'Employee',
  actions: ''
}))

type Member = (typeof MEMBERS)[number]

export const Dashboard: React.FC = () => (
  <Shell
    user={['Kate Moore', 'Admin']}
    nav={[
      { icon: icon(Layout), label: 'Dashboard', active: true },
      { icon: icon(Package), label: 'Orders' },
      { icon: icon(Activity), label: 'Tracker', tag: 'New' },
      { icon: icon(Sliders), label: 'Analytics' },
      { icon: icon(Settings), label: 'Settings' }
    ]}
    bottom={SIDEBAR_BOTTOM}
  >
    <Head title="Good morning, Kate">
      <IconButton icon={icon(Search)} label="Search" />
      <IconButton icon={icon(Bell)} label="Notifications" />
      <Button auto scale={0.8} type="primary" icon={icon(UserPlus)}>
        Invite
      </Button>
    </Head>
    <div className={styles.between}>
      <SegmentedControl initialValue="overview" aria-label="Section">
        <SegmentedControl.Item value="overview">Overview</SegmentedControl.Item>
        <SegmentedControl.Item value="sales">Sales</SegmentedControl.Item>
        <SegmentedControl.Item value="expenses">Expenses</SegmentedControl.Item>
      </SegmentedControl>
      <div className={styles.row}>
        <Select initialValue="monthly" width="130px">
          <Select.Option value="monthly">Monthly</Select.Option>
          <Select.Option value="weekly">Weekly</Select.Option>
        </Select>
        <Button auto scale={0.8} type="primary">
          Download
        </Button>
      </div>
    </div>
    <div className={styles.stats}>
      <Metric label="Revenue" value="US$ 228.441" change="+3.3%" />
      <Metric label="Expenses" value="US$ 25.108" change="-3.3%" />
      <Metric label="Sales" value="458" change="+3.3%" />
      <Metric label="Profit" value="US$ 203.133" change="+4.1%" />
    </div>
    <div className={styles.twoCols}>
      <Tile title="Sales performance">
        <BarChart
          aria-label="Sales performance"
          height={200}
          data={MONTHS.map((month, i) => ({
            month,
            sales: [30, 52, 34, 16, 43, 23, 26, 30, 9, 43, 37, 31][i]
          }))}
          dataKey="month"
          series={[{ name: 'sales', label: 'Sales' }]}
          withLegend={false}
        />
      </Tile>
      <Tile title="Traffic source">
        <LineChart
          aria-label="Traffic source"
          height={200}
          data={MONTHS.map((month, i) => ({
            month,
            organic: [2, 10, 12, 14, 8, 9, 17, 18, 20, 17, 21, 14][i],
            paid: [1, 9, 8, 13, 6, 7, 10, 9, 5, 11, 16, 9][i]
          }))}
          dataKey="month"
          series={[
            { name: 'organic', label: 'Organic' },
            { name: 'paid', label: 'Paid ads' }
          ]}
        />
      </Tile>
    </div>
    <div className={styles.between}>
      <div className={styles.row}>
        <Text b my={0}>
          All employees
        </Text>
        <Tag type="lite">32</Tag>
      </div>
      <Input icon={icon(Search)} placeholder="Search" width="220px" />
    </div>
    <div className={styles.row}>
      <Button auto scale={0.7} icon={icon(Filter)}>
        Filter
      </Button>
      <Button auto scale={0.7} icon={icon(List)}>
        Sort
      </Button>
      <Button auto scale={0.7} icon={icon(Columns)}>
        Columns
      </Button>
    </div>
    <Table data={MEMBERS}>
      <Table.Column prop="id" label="Worker ID" />
      <Table.Column<Member>
        prop="name"
        label="Member"
        render={(_, row) => (
          <div className={styles.row}>
            <Avatar text={row.name.slice(0, 2).toUpperCase()} />
            <div>
              <Text small b my={0}>
                {row.name}
              </Text>
              <Muted>{row.email}</Muted>
            </div>
          </div>
        )}
      />
      <Table.Column prop="role" label="Role" />
      <Table.Column prop="type" label="Worker type" />
      <Table.Column<Member>
        prop="actions"
        label="Actions"
        render={() => (
          <div className={styles.row}>
            <IconButton icon={icon(Eye)} label="View" />
            <IconButton icon={icon(Edit2)} label="Edit" />
            <IconButton icon={icon(Trash2)} label="Delete" type="error-light" />
          </div>
        )}
      />
    </Table>
  </Shell>
)

const FOLDERS = [
  [Inbox, 'Inbox', '4'],
  [Star, 'Starred', '2'],
  [Send, 'Sent', ''],
  [File, 'Drafts', ''],
  [Archive, 'Archive', ''],
  [Trash2, 'Trash', '']
] as const

const MAILS = [
  [
    'Carlos Iglesias',
    'Launch recap + next steps',
    'We agreed on the final launch date',
    '10:21 AM',
    true
  ],
  [
    'Stripe',
    'Invoice INV-0241 is due tomorrow',
    'Invoice INV-0241 for $2,450.00',
    'Yesterday',
    true
  ],
  [
    'Flights',
    'Flight itinerary: SFO to NRT',
    "You're booked on flight FL-482",
    'Apr 22',
    false
  ],
  [
    'Maya Okafor',
    'Design review: dashboard v3',
    'Pinging ahead of Friday',
    'Mon',
    false
  ],
  [
    'Parker Wren',
    '1:1 notes, Q2 growth plan',
    'Growth plan notes: define H1',
    'Fri',
    false
  ]
] as const

export const Mail: React.FC = () => {
  const theme = useTheme()
  const labels: Array<[string, string]> = [
    ['Work', theme.palette.primary],
    ['Personal', theme.palette.accents_5],
    ['Billing', theme.palette.warning],
    ['Travel', theme.palette.success],
    ['Urgent', theme.palette.error]
  ]
  return (
    <Shell
      user={['You', 'you@bolio.dev']}
      nav={FOLDERS.map(([Icon, label, tag], i) => ({
        icon: icon(Icon),
        label,
        tag,
        active: i === 0
      }))}
      extra={
        <div className={styles.nav}>
          <Muted>Labels</Muted>
          {labels.map(([label, color]) => (
            <div className={styles.navItem} key={label}>
              <span className={styles.dot} style={{ background: color }} />
              <Text small my={0}>
                {label}
              </Text>
            </div>
          ))}
        </div>
      }
      bottom={
        <Button type="primary" icon={icon(Edit2)} width="100%">
          New email
        </Button>
      }
    >
      <div className={styles.mail}>
        <div className={styles.mailList}>
          <Input icon={icon(Search)} placeholder="Search" width="100%" />
          {MAILS.map(([name, subject, preview, time, unread], i) => (
            <div
              className={styles.mailRow}
              key={subject}
              style={{
                background: i === 0 ? theme.palette.accents_2 : undefined,
                borderRadius: theme.layout.radius
              }}
            >
              <Avatar text={name.slice(0, 2).toUpperCase()} />
              <div className={styles.fill}>
                <div className={styles.between}>
                  <Text small b my={0}>
                    {name}
                  </Text>
                  <Muted>{time}</Muted>
                </div>
                <Text small my={0} b={unread}>
                  {subject}
                </Text>
                <Muted>{preview}</Muted>
              </div>
            </div>
          ))}
        </div>
        <Tile>
          <div className={styles.row}>
            <IconButton icon={icon(Trash2)} label="Delete" />
            <IconButton icon={icon(Archive)} label="Archive" />
            <IconButton icon={icon(Bookmark)} label="Save" />
          </div>
          <Text b my={0}>
            Launch recap + next steps
          </Text>
          <div className={styles.row}>
            <Avatar text="CI" />
            <div>
              <Text small b my={0}>
                Carlos Iglesias
              </Text>
              <Muted>carlos@bolio.dev, to me</Muted>
            </div>
          </div>
          <Text small my={0}>
            Quick recap from this morning&apos;s launch review so we have it in
            writing.
          </Text>
          <Text small my={0}>
            We agreed on the final launch date (Tuesday the 24th) and the three
            must-ship items: onboarding tour, billing update flow, and the new
            analytics dashboard.
          </Text>
          <Textarea placeholder="Write a reply" width="100%" />
          <div className={styles.row}>
            <Button auto type="primary" iconRight={icon(Send)}>
              Send reply
            </Button>
            <Button auto>Save draft</Button>
          </div>
        </Tile>
      </div>
    </Shell>
  )
}

const Bubble: React.FC<React.PropsWithChildren<{ mine?: boolean }>> = ({
  mine,
  children
}) => {
  const theme = useTheme()
  return (
    <div
      className={styles.bubble}
      style={{
        alignSelf: mine ? 'flex-end' : 'flex-start',
        background: mine ? theme.palette.primary : theme.palette.accents_2,
        color: mine ? '#fff' : theme.palette.foreground,
        borderRadius: theme.layout.radius
      }}
    >
      {children}
    </div>
  )
}

const CHATS = [
  ['Ana Souza', 'See you at 3pm', '2'],
  ['Design team', 'Lucas: new mockups', ''],
  ['Marta Reis', 'Thanks!', ''],
  ['Studio Nova', 'Files are ready', '']
]

export const Chat: React.FC = () => (
  <Shell
    user={['You', 'Online']}
    nav={[
      { icon: icon(MessageCircle), label: 'Chats', tag: '2', active: true },
      { icon: icon(Phone), label: 'Calls' },
      { icon: icon(Users), label: 'Contacts' },
      { icon: icon(Settings), label: 'Settings' }
    ]}
    bottom={SIDEBAR_BOTTOM}
  >
    <div className={styles.chat}>
      <div className={styles.mailList}>
        <Input icon={icon(Search)} placeholder="Search chats" width="100%" />
        {CHATS.map(([name, last, unread], i) => (
          <NavItemRow
            key={name}
            name={name}
            last={last}
            unread={unread}
            active={i === 0}
          />
        ))}
      </div>
      <Tile>
        <div className={styles.between}>
          <div className={styles.row}>
            <Avatar text="AS" />
            <div>
              <Text small b my={0}>
                Ana Souza
              </Text>
              <Muted>Online</Muted>
            </div>
          </div>
          <IconButton icon={icon(Phone)} label="Call" />
        </div>
        <Bubble>Did you see the new theme builder?</Bubble>
        <Bubble mine>Yes, the radius and colors update live.</Bubble>
        <Bubble>Great, send me the link to the preview.</Bubble>
        <Bubble mine>Sending it now.</Bubble>
        <div className={styles.row}>
          <div className={styles.fill}>
            <Input placeholder="Type a message" width="100%" />
          </div>
          <Button auto type="primary" icon={icon(Send)} aria-label="Send" />
        </div>
      </Tile>
      <Tile>
        <div className={styles.center}>
          <Avatar text="AS" />
          <Text b my={0}>
            Ana Souza
          </Text>
          <Muted>Product designer</Muted>
        </div>
        <div className={styles.between}>
          <Text small my={0}>
            Mute chat
          </Text>
          <Toggle />
        </div>
        <Muted>Shared files</Muted>
        <div className={styles.row}>
          <File width={16} height={16} />
          <Text small my={0}>
            mockups.fig
          </Text>
        </div>
        <div className={styles.row}>
          <File width={16} height={16} />
          <Text small my={0}>
            brief.pdf
          </Text>
        </div>
      </Tile>
    </div>
  </Shell>
)

const NavItemRow: React.FC<{
  name: string
  last: string
  unread: string
  active: boolean
}> = ({ name, last, unread, active }) => {
  const theme = useTheme()
  return (
    <div
      className={styles.mailRow}
      style={{
        background: active ? theme.palette.accents_2 : undefined,
        borderRadius: theme.layout.radius
      }}
    >
      <Avatar text={name.slice(0, 2).toUpperCase()} />
      <div className={styles.fill}>
        <Text small b my={0}>
          {name}
        </Text>
        <Muted>{last}</Muted>
      </div>
      {unread && (
        <Tag type="primary" light>
          {unread}
        </Tag>
      )}
    </div>
  )
}

const TRANSACTIONS = [
  {
    id: 1,
    name: 'Salary',
    date: 'Today',
    category: 'Income',
    amount: '+$4,200.00'
  },
  {
    id: 2,
    name: 'Subscription',
    date: 'Yesterday',
    category: 'Software',
    amount: '-$12.00'
  },
  {
    id: 3,
    name: 'Rent',
    date: 'Mon',
    category: 'Housing',
    amount: '-$1,350.00'
  }
]

export const Finances: React.FC = () => {
  const theme = useTheme()
  return (
    <Shell
      user={['Kate Moore', 'Personal']}
      nav={[
        { icon: icon(Layout), label: 'Overview', active: true },
        { icon: icon(CreditCard), label: 'Cards' },
        { icon: icon(List), label: 'Transactions' },
        { icon: icon(Target), label: 'Budgets' },
        { icon: icon(Briefcase), label: 'Savings' },
        { icon: icon(Settings), label: 'Settings' }
      ]}
      bottom={SIDEBAR_BOTTOM}
    >
      <Head title="Overview" sub="Total balance $12,480.20">
        <Button auto scale={0.8} type="primary" icon={icon(Plus)}>
          Add money
        </Button>
      </Head>
      <div className={styles.twoCols}>
        <Tile title="Balance">
          <AreaChart
            aria-label="Balance"
            height={200}
            data={MONTHS.map((month, i) => ({
              month,
              balance: [
                8, 9, 8.5, 10, 9.8, 11, 10.5, 11.5, 12, 11.8, 12.2, 12.5
              ][i]
            }))}
            dataKey="month"
            series={[{ name: 'balance', label: 'Balance' }]}
            withLegend={false}
          />
        </Tile>
        <Tile>
          <div
            className={styles.creditCard}
            style={{
              background: `linear-gradient(135deg, ${theme.palette.primary}, ${theme.palette.primaryDark})`,
              borderRadius: theme.layout.radius
            }}
          >
            <CreditCard width={24} height={24} />
            <div>
              <Text
                small
                my={0}
                style={{ display: 'block', color: 'inherit', opacity: 0.8 }}
              >
                Bolio Card
              </Text>
              <Text b my={0} style={{ color: 'inherit', letterSpacing: 2 }}>
                •••• •••• •••• 4242
              </Text>
            </div>
          </div>
          <Muted>Food</Muted>
          <Progress value={64} type="success" />
          <Muted>Transport</Muted>
          <Progress value={88} type="warning" />
        </Tile>
      </div>
      <Text b my={0}>
        Transactions
      </Text>
      <Table data={TRANSACTIONS}>
        <Table.Column prop="name" label="Name" />
        <Table.Column prop="date" label="Date" />
        <Table.Column prop="category" label="Category" />
        <Table.Column<(typeof TRANSACTIONS)[number]>
          prop="amount"
          label="Amount"
          render={(_, row) => (
            <Text
              small
              b
              my={0}
              style={{
                color: row.amount.startsWith('+')
                  ? theme.palette.success
                  : undefined
              }}
            >
              {row.amount}
            </Text>
          )}
        />
      </Table>
    </Shell>
  )
}

const STAGES = [
  [
    'Lead',
    [
      ['Acme Inc', '$4,000'],
      ['Globex', '$12,500']
    ]
  ],
  ['Contacted', [['Initech', '$8,200']]],
  [
    'Proposal',
    [
      ['Soylent', '$15,000'],
      ['Wayne Co', '$9,400']
    ]
  ],
  [
    'Won',
    [
      ['Umbrella', '$21,000'],
      ['Hooli', '$6,300']
    ]
  ]
] as const

export const CRM: React.FC = () => (
  <Shell
    user={['Kate Moore', 'Sales']}
    nav={[
      { icon: icon(Users), label: 'Contacts' },
      { icon: icon(Briefcase), label: 'Deals', active: true },
      { icon: icon(Target), label: 'Tasks', tag: '3' },
      { icon: icon(Sliders), label: 'Reports' },
      { icon: icon(Settings), label: 'Settings' }
    ]}
    bottom={SIDEBAR_BOTTOM}
  >
    <Head title="Deals" sub="Pipeline for this quarter">
      <Input icon={icon(Search)} placeholder="Search deals" width="200px" />
      <Button auto scale={0.8} type="primary" icon={icon(Plus)}>
        New deal
      </Button>
    </Head>
    <div className={styles.stats}>
      <Metric label="Pipeline" value="US$ 76.400" change="+8.2%" />
      <Metric label="Won" value="US$ 27.300" change="+3.1%" />
      <Metric label="Open deals" value="12" change="+2.0%" />
      <Metric label="Win rate" value="38%" change="-1.2%" />
    </div>
    <div className={styles.kanban}>
      {STAGES.map(([stage, deals]) => (
        <div className={styles.column} key={stage}>
          <div className={styles.between}>
            <Text small b my={0}>
              {stage}
            </Text>
            <Tag type="lite">{deals.length}</Tag>
          </div>
          {deals.map(([company, value]) => (
            <Tile key={company}>
              <Text small b my={0}>
                {company}
              </Text>
              <Muted>Renewal and expansion</Muted>
              <div className={styles.between}>
                <Avatar.Group>
                  <Avatar text="AB" />
                  <Avatar text="CD" />
                </Avatar.Group>
                <Tag type={stage === 'Won' ? 'success' : 'primary'} light>
                  {value}
                </Tag>
              </div>
            </Tile>
          ))}
        </div>
      ))}
    </div>
  </Shell>
)

const EVENTS = [
  ['09:00', 'Design review', 'Meeting room 2', 'primary'],
  ['11:30', 'Customer call', 'Video call', 'success'],
  ['14:00', 'Sprint planning', 'Main office', 'warning'],
  ['17:30', 'Team happy hour', 'Rooftop bar', 'secondary']
] as const

export const CalendarApp: React.FC = () => (
  <Shell
    user={['Kate Moore', 'Admin']}
    nav={[
      { icon: icon(CalendarIcon), label: 'Calendar', active: true },
      { icon: icon(Clock), label: 'Events', tag: '4' },
      { icon: icon(Users), label: 'Meetings' },
      { icon: icon(Settings), label: 'Settings' }
    ]}
    bottom={SIDEBAR_BOTTOM}
  >
    <Head title="Calendar" sub="You have 4 events today">
      <Button auto scale={0.8} type="primary" icon={icon(Plus)}>
        New event
      </Button>
    </Head>
    <MiniCalendar aria-label="Week" />
    <div className={styles.twoCols}>
      <Tile title="November">
        <Calendar width="100%" />
      </Tile>
      <Tile title="Today">
        {EVENTS.map(([time, title, place, type]) => (
          <div className={styles.row} key={title}>
            <Tag type={type} light>
              {time}
            </Tag>
            <div className={styles.fill}>
              <Text small b my={0}>
                {title}
              </Text>
              <Muted>{place}</Muted>
            </div>
            <MapPin width={14} height={14} />
          </div>
        ))}
      </Tile>
    </div>
  </Shell>
)

export const SettingsApp: React.FC = () => (
  <Shell
    user={['Kate Moore', 'Admin']}
    nav={[
      { icon: icon(User), label: 'Profile', active: true },
      { icon: icon(Key), label: 'Account' },
      { icon: icon(Bell), label: 'Notifications' },
      { icon: icon(CreditCard), label: 'Billing' },
      { icon: icon(Shield), label: 'Security' }
    ]}
    bottom={SIDEBAR_BOTTOM}
  >
    <Head title="Profile" sub="Manage how you appear to your team">
      <Button auto scale={0.8}>
        Cancel
      </Button>
      <Button auto scale={0.8} type="primary">
        Save changes
      </Button>
    </Head>
    <Tile>
      <div className={styles.row}>
        <Avatar text="KM" />
        <div className={styles.fill}>
          <Text small b my={0}>
            Profile photo
          </Text>
          <Muted>PNG or JPG up to 2 MB</Muted>
        </div>
        <Button auto scale={0.7}>
          Change photo
        </Button>
      </div>
      <div className={styles.twoCols}>
        <Input initialValue="Kate" width="100%">
          First name
        </Input>
        <Input initialValue="Moore" width="100%">
          Last name
        </Input>
        <Input initialValue="kate@acme.com" icon={icon(Globe)} width="100%">
          Email
        </Input>
        <Select initialValue="en" width="100%">
          <Select.Option value="en">English</Select.Option>
          <Select.Option value="pt">Portuguese</Select.Option>
        </Select>
      </div>
      <Textarea placeholder="Tell your team about yourself" width="100%" />
    </Tile>
    <div className={styles.twoCols}>
      <Tile title="Notifications">
        <div className={styles.between}>
          <Text small my={0}>
            Product updates
          </Text>
          <Toggle initialChecked />
        </div>
        <div className={styles.between}>
          <Text small my={0}>
            Weekly summary
          </Text>
          <Toggle initialChecked />
        </div>
        <div className={styles.between}>
          <Text small my={0}>
            Mentions
          </Text>
          <Toggle />
        </div>
        <Checkbox checked>Email me about security alerts</Checkbox>
      </Tile>
      <Tile title="Plan">
        <Radio.Group value="pro">
          <Radio value="free">Free, up to 3 projects</Radio>
          <Radio value="pro">Pro, unlimited projects</Radio>
          <Radio value="team">Team, shared workspace</Radio>
        </Radio.Group>
        <Button type="error-light" width="100%">
          Delete account
        </Button>
      </Tile>
    </div>
  </Shell>
)

const PRODUCTS = [
  ['Ceramic mug', '$18', 4, 'Free shipping'],
  ['Linen shirt', '$64', 5, ''],
  ['Desk lamp', '$92', 4, 'New'],
  ['Canvas tote', '$27', 3, '']
] as const

export const Store: React.FC = () => {
  const theme = useTheme()
  return (
    <div
      className={styles.storeFrame}
      style={{
        borderColor: theme.palette.border,
        borderRadius: theme.layout.radius
      }}
    >
      <div className={styles.between}>
        <Text b my={0} style={{ fontSize: 18 }}>
          Bolio Store
        </Text>
        <Input
          icon={icon(Search)}
          placeholder="Search products"
          width="280px"
        />
        <div className={styles.row}>
          <IconButton icon={icon(Heart)} label="Favorites" />
          <Button auto scale={0.8} type="primary" icon={icon(ShoppingCart)}>
            Cart (2)
          </Button>
        </div>
      </div>
      <div
        className={styles.banner}
        style={{
          background: `linear-gradient(135deg, ${theme.palette.primary}, ${theme.palette.primaryDark})`,
          borderRadius: theme.layout.radius
        }}
      >
        <Text b my={0} style={{ color: 'inherit', fontSize: 20 }}>
          Autumn sale, up to 30% off
        </Text>
        <Text small my={0} style={{ display: 'block', color: 'inherit' }}>
          Free shipping on orders over $50.
        </Text>
      </div>
      <div className={styles.row}>
        <Chip initialChecked>All</Chip>
        <Chip>Home</Chip>
        <Chip>Clothing</Chip>
        <Chip>Lighting</Chip>
        <Chip>Free shipping</Chip>
      </div>
      <div className={styles.stats}>
        {PRODUCTS.map(([name, price, rating, tag]) => (
          <Tile key={name}>
            <div
              className={styles.product}
              style={{
                background: `linear-gradient(135deg, color-mix(in srgb, ${theme.palette.primary} 22%, ${theme.palette.accents_2}), color-mix(in srgb, ${theme.palette.primary} 40%, ${theme.palette.accents_3}))`,
                borderRadius: theme.layout.radius
              }}
            />
            <div className={`${styles.between} ${styles.titleRow}`}>
              <Text small b my={0}>
                {name}
              </Text>
              {tag && (
                <Tag type="primary" light>
                  {tag}
                </Tag>
              )}
            </div>
            <Rating initialValue={rating} />
            <div className={styles.between}>
              <Text b my={0}>
                {price}
              </Text>
              <Button auto scale={0.7} type="primary">
                Add to cart
              </Button>
            </div>
          </Tile>
        ))}
      </div>
    </div>
  )
}

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    cta: 'Start for free',
    features: ['3 projects', '1 GB storage', 'Community support']
  },
  {
    name: 'Pro',
    price: '$12',
    cta: 'Start Pro trial',
    popular: true,
    features: [
      'Unlimited projects',
      '100 GB storage',
      'Priority support',
      'Custom themes'
    ]
  },
  {
    name: 'Team',
    price: '$29',
    cta: 'Talk to sales',
    features: [
      'Everything in Pro',
      'Shared workspace',
      '1 TB storage',
      'SSO and audit log'
    ]
  }
]

export const Pricing: React.FC = () => {
  const theme = useTheme()
  return (
    <div className={styles.storeFrame} style={frameStyle(theme)}>
      <div className={styles.center}>
        <Text b my={0} style={{ fontSize: 22 }}>
          Pick the plan that fits your team
        </Text>
        <Muted>No credit card required. Cancel anytime.</Muted>
        <SegmentedControl initialValue="monthly" aria-label="Billing">
          <SegmentedControl.Item value="monthly">Monthly</SegmentedControl.Item>
          <SegmentedControl.Item value="yearly">
            Yearly, save 20%
          </SegmentedControl.Item>
        </SegmentedControl>
      </div>
      <div className={styles.stats}>
        {PLANS.map((plan) => (
          <div
            key={plan.name}
            className={styles.plan}
            style={{
              background: theme.palette.accents_1,
              border: `1px solid ${plan.popular ? theme.palette.primary : theme.palette.border}`,
              borderRadius: `calc(${theme.layout.radius} + 4px)`
            }}
          >
            <div className={styles.between}>
              <Text b my={0}>
                {plan.name}
              </Text>
              {plan.popular && (
                <Tag type="primary" light>
                  Most popular
                </Tag>
              )}
            </div>
            <div className={styles.row}>
              <Text b my={0} style={{ fontSize: 32 }}>
                {plan.price}
              </Text>
              <Muted>per user, per month</Muted>
            </div>
            {plan.features.map((feature) => (
              <div className={styles.row} key={feature}>
                <Check width={16} height={16} color={theme.palette.success} />
                <Text small my={0}>
                  {feature}
                </Text>
              </div>
            ))}
            <Button type={plan.popular ? 'primary' : 'default'} width="100%">
              {plan.cta}
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

export const Login: React.FC = () => {
  const theme = useTheme()
  return (
    <div className={styles.login} style={frameStyle(theme)}>
      <div className={styles.loginForm}>
        <div>
          <Text b my={0} style={{ fontSize: 22 }}>
            Welcome back
          </Text>
          <Muted>Sign in to continue to Bolio UI</Muted>
        </div>
        <Input icon={icon(MailIcon)} placeholder="you@email.com" width="100%">
          Email
        </Input>
        <Input.Password placeholder="Your password" width="100%">
          Password
        </Input.Password>
        <div className={styles.between}>
          <Checkbox checked>Remember me</Checkbox>
          <Text small my={0} style={{ color: theme.palette.primary }}>
            Forgot password?
          </Text>
        </div>
        <Button type="primary" width="100%">
          Sign in
        </Button>
        <Divider>OR</Divider>
        <Button width="100%" icon={icon(Github)}>
          Continue with GitHub
        </Button>
        <Muted>New here? Create an account, it takes 2 minutes.</Muted>
      </div>
      <div
        className={styles.loginSide}
        style={{
          background: `linear-gradient(135deg, ${theme.palette.primary}, ${theme.palette.primaryDark})`
        }}
      >
        <Zap width={28} height={28} />
        <Text b my={0} style={{ color: 'inherit', fontSize: 20 }}>
          Ship interfaces your team actually enjoys.
        </Text>
        <div className={styles.row}>
          <Avatar text="AS" />
          <div>
            <Text small b my={0} style={{ color: 'inherit' }}>
              Ana Souza
            </Text>
            <Text
              small
              my={0}
              style={{ display: 'block', color: 'inherit', opacity: 0.8 }}
            >
              Head of Product
            </Text>
          </div>
        </div>
      </div>
    </div>
  )
}

const TASKS = [
  ['Review the launch checklist', 'High', 'AS', 'Today', true],
  ['Update the pricing page copy', 'Medium', 'LL', 'Tomorrow', false],
  ['Fix the empty state on Orders', 'Low', 'MR', 'Fri', false],
  ['Write the release notes', 'Medium', 'AS', 'Mon', false]
] as const

const PRIORITY = { High: 'error', Medium: 'warning', Low: 'success' } as const

export const Tasks: React.FC = () => (
  <Shell
    user={['Kate Moore', 'Product']}
    nav={[
      { icon: icon(Inbox), label: 'Inbox', tag: '3' },
      { icon: icon(Check), label: 'My tasks', active: true },
      { icon: icon(Folder), label: 'Projects' },
      { icon: icon(Flag), label: 'Roadmap' },
      { icon: icon(Settings), label: 'Settings' }
    ]}
    bottom={SIDEBAR_BOTTOM}
  >
    <Head title="My tasks" sub="4 open, 1 due today">
      <Input icon={icon(Search)} placeholder="Search tasks" width="200px" />
      <Button auto scale={0.8} type="primary" icon={icon(Plus)}>
        New task
      </Button>
    </Head>
    <div className={styles.row}>
      <Chip initialChecked>All</Chip>
      <Chip>Today</Chip>
      <Chip>This week</Chip>
      <Chip>Assigned to me</Chip>
    </div>
    <div className={styles.twoCols}>
      <div className={styles.wide}>
        <Tile>
          {TASKS.map(([title, priority, who, due, done]) => (
            <div className={styles.row} key={title}>
              <Checkbox checked={done} />
              <div className={styles.fill}>
                <Text small b my={0}>
                  {title}
                </Text>
                <Muted>Due {due}</Muted>
              </div>
              <Tag type={PRIORITY[priority]} light>
                {priority}
              </Tag>
              <Avatar text={who} />
            </div>
          ))}
        </Tile>
      </div>
      <Tile title="Sprint 12">
        <Progress value={68} type="primary" />
        <Muted>17 of 25 tasks done</Muted>
        <Timeline>
          <Timeline.Item title="Design freeze" time="Done" />
          <Timeline.Item title="Beta release" time="Thu" />
        </Timeline>
      </Tile>
    </div>
  </Shell>
)

const QUEUE = [
  { id: 1, title: 'Midnight City', artist: 'M83', time: '4:03' },
  { id: 2, title: 'Intro', artist: 'The xx', time: '2:07' },
  { id: 3, title: 'Genesis', artist: 'Grimes', time: '4:15' },
  { id: 4, title: 'Nightcall', artist: 'Kavinsky', time: '4:18' }
]

export const Player: React.FC = () => {
  const theme = useTheme()
  return (
    <Shell
      user={['Kate Moore', 'Premium']}
      nav={[
        { icon: icon(Layout), label: 'Home' },
        { icon: icon(Search), label: 'Search' },
        { icon: icon(Music), label: 'Library', active: true },
        { icon: icon(Disc), label: 'Albums' },
        { icon: icon(Users), label: 'Artists' }
      ]}
      bottom={SIDEBAR_BOTTOM}
    >
      <div className={styles.twoCols}>
        <Tile>
          <div
            className={styles.cover}
            style={{
              background: `linear-gradient(135deg, ${theme.palette.primary}, ${theme.palette.secondary})`,
              borderRadius: theme.layout.radius
            }}
          />
          <div className={styles.between}>
            <div>
              <Text b my={0}>
                Midnight City
              </Text>
              <Muted>M83, Hurry Up, We&apos;re Dreaming</Muted>
            </div>
            <Heart width={18} height={18} />
          </div>
          <Slider initialValue={38} hideValue aria-label="Progress" />
          <div className={styles.between}>
            <Muted>1:32</Muted>
            <Muted>4:03</Muted>
          </div>
          <div className={styles.controls}>
            <IconButton icon={icon(Shuffle)} label="Shuffle" />
            <IconButton icon={icon(SkipBack)} label="Previous" />
            <Button auto type="primary" icon={icon(Pause)} aria-label="Pause" />
            <IconButton icon={icon(SkipForward)} label="Next" />
            <IconButton icon={icon(Repeat)} label="Repeat" />
          </div>
          <div className={styles.row}>
            <Volume2 width={16} height={16} />
            <div className={styles.fill}>
              <Slider initialValue={70} hideValue aria-label="Volume" />
            </div>
          </div>
        </Tile>
        <Tile title="Up next">
          <Table data={QUEUE}>
            <Table.Column prop="title" label="Title" />
            <Table.Column prop="artist" label="Artist" />
            <Table.Column prop="time" label="Time" />
          </Table>
          <Button auto scale={0.8} icon={icon(Play)}>
            Play all
          </Button>
        </Tile>
      </div>
    </Shell>
  )
}

export const TABS = {
  components: ['Components', ThemeGallery],
  dashboard: ['Dashboard', Dashboard],
  mail: ['Mail', Mail],
  chat: ['Chat', Chat],
  finances: ['Finances', Finances],
  crm: ['CRM', CRM],
  calendar: ['Calendar', CalendarApp],
  settings: ['Settings', SettingsApp],
  store: ['Store', Store],
  pricing: ['Pricing', Pricing],
  login: ['Login', Login],
  tasks: ['Tasks', Tasks],
  player: ['Player', Player]
} as const

export type Tab = keyof typeof TABS
