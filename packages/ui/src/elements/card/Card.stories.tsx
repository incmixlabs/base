import type { Meta, StoryObj } from '@storybook/react-vite'
import { Bell, CreditCard, Settings, User } from 'lucide-react'
import { Tabs } from '@/elements/tabs/Tabs'
import { normalizeChartColor } from '@/theme/props/color.prop'
import { getPropDefValues } from '@/theme/props/prop-def'
import { radiusPropDef } from '@/theme/props/radius.prop'
import type { ChartColorToken } from '@/theme/tokens'
import { Avatar } from '../avatar/Avatar'
import { Badge } from '../badge/Badge'
import { Button } from '../button/Button'
import { Card } from './Card'
import { cardPropDefs } from './card.props'

const chartToneColors = getPropDefValues(cardPropDefs.color).filter(
  (value): value is ChartColorToken => normalizeChartColor(value) === value,
)

const meta: Meta<typeof Card.Root> = {
  title: 'Elements/Card',
  component: Card.Root,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Card is a semantic composition component (`Root`, `Header`, `Title`, `Description`, `Content`, `Footer`) that now composes `Surface` internally. Use `size` for padding and visual props (`variant`, `color`, `radius`, `shape`, `square`, `highContrast`) for appearance.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: getPropDefValues(cardPropDefs.size),
      description: 'Padding size',
    },
    variant: {
      control: 'select',
      options: getPropDefValues(cardPropDefs.variant),
      description: 'Visual variant',
    },
    layout: {
      control: 'select',
      options: getPropDefValues(cardPropDefs.layout),
      description: 'Optional child layout mode for the card root',
    },
    color: {
      control: 'select',
      options: getPropDefValues(cardPropDefs.color),
      description: 'Surface tone, including semantic and chart tones',
    },
    radius: {
      control: 'select',
      options: getPropDefValues(radiusPropDef.radius),
      description: 'Border radius token',
    },
    highContrast: {
      control: 'boolean',
      description: 'Increase contrast for improved legibility',
    },
    shape: {
      control: 'select',
      options: getPropDefValues(cardPropDefs.shape),
      description: 'Geometric shape treatment',
    },
    square: {
      control: 'boolean',
      description: 'Force 1:1 aspect ratio',
    },
    asChild: {
      control: 'boolean',
      description: 'Render onto child element using Slot',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// ============================================================================
// Basic Examples
// ============================================================================

export const Default: Story = {
  args: {
    size: 'sm',
    variant: 'surface',
    color: 'slate',
    radius: 'md',
    highContrast: false,
    shape: 'rect',
    square: false,
  },
  render: args => (
    <Card.Root
      size={args.size}
      variant={args.variant}
      color={args.color}
      radius={args.radius}
      highContrast={args.highContrast}
      shape={args.shape}
      square={args.square}
      className="w-80"
    >
      <Card.Header>
        <Card.Title>Card Title</Card.Title>
        <Card.Description>Card description goes here.</Card.Description>
      </Card.Header>
      <Card.Content>
        <p className="text-sm">This is the main content area of the card.</p>
      </Card.Content>
      <Card.Footer>
        <Button variant="outline" size="md">
          Cancel
        </Button>
        <Button size="md" className="ml-2">
          Save
        </Button>
      </Card.Footer>
    </Card.Root>
  ),
}

export const Simple: Story = {
  render: () => (
    <Card.Root className="w-80">
      <p className="text-sm">A simple card with just content and default padding.</p>
    </Card.Root>
  ),
}

export const LayoutComposition: Story = {
  render: () => (
    <Card.Root layout="grid" columns={{ initial: '1', md: '2' }} gap="4" className="w-[560px]">
      <Card.Header>
        <Card.Title>Layout-aware card</Card.Title>
        <Card.Description>Card remains a visual surface while arranging children directly.</Card.Description>
      </Card.Header>
      <Card.Content className="pt-0">
        <p className="text-sm">Grid props are applied to the Card root without using an `as` prop.</p>
      </Card.Content>
    </Card.Root>
  ),
}

export const SurfacePropsShowcase: Story = {
  name: 'Surface Props Showcase',
  parameters: {
    docs: {
      description: {
        story:
          'Examples of the new Surface-backed visual props on `Card.Root`: `color`, `radius`, `highContrast`, and `shape`.',
      },
    },
  },
  render: () => (
    <div className="grid grid-cols-2 gap-4 w-[720px]">
      <Card.Root variant="surface" color="primary" radius="lg">
        <Card.Header>
          <Card.Title>Primary Surface</Card.Title>
          <Card.Description>surface + primary + radius=lg</Card.Description>
        </Card.Header>
      </Card.Root>
      <Card.Root variant="classic" color="info" highContrast>
        <Card.Header>
          <Card.Title>High Contrast Classic</Card.Title>
          <Card.Description>classic + info + highContrast</Card.Description>
        </Card.Header>
      </Card.Root>
      <Card.Root variant="surface" color="success" shape="ellipse" className="h-24">
        <Card.Header>
          <Card.Title>Ellipse</Card.Title>
          <Card.Description>surface + success + shape=ellipse</Card.Description>
        </Card.Header>
      </Card.Root>
      <Card.Root variant="surface" color="warning" shape="hexagon" className="h-40">
        <Card.Content className="pt-0 flex h-full items-center justify-center text-center">
          <div>
            <p className="text-base font-semibold">Hexagon</p>
            <p className="text-sm">shape=hexagon</p>
          </div>
        </Card.Content>
      </Card.Root>
      <Card.Root variant="soft" color="chart1">
        <Card.Header>
          <Card.Title>Chart Lane</Card.Title>
          <Card.Description>soft + chart1</Card.Description>
        </Card.Header>
      </Card.Root>
    </div>
  ),
}

export const ChartToneCards: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div className="grid grid-cols-2 gap-4 w-[720px]">
      {chartToneColors.map(color => (
        <Card.Root key={color} variant="soft" color={color}>
          <Card.Header>
            <Card.Title>{color}</Card.Title>
            <Card.Description>soft + {color}</Card.Description>
          </Card.Header>
          <Card.Content>
            <p className="text-sm">Chart-toned card surface.</p>
          </Card.Content>
        </Card.Root>
      ))}
    </div>
  ),
}

export const SquareCard: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'When `square` is true, Card uses a 1:1 aspect ratio. Set one dimension (`w-*` or `h-*`) and the other is derived.',
      },
    },
  },
  render: () => (
    <Card.Root square className="w-64 flex items-center justify-center text-center" variant="surface" color="accent">
      <Card.Content className="pt-0">
        <p className="text-sm">square + w-64</p>
      </Card.Content>
    </Card.Root>
  ),
}

// ============================================================================
// Sizes
// ============================================================================

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map(size => (
        <Card.Root key={size} size={size} className="w-80">
          <Card.Header>
            <Card.Title>Size {size}</Card.Title>
          </Card.Header>
          <Card.Content>
            <p className="text-sm">Content with size {size} padding.</p>
          </Card.Content>
        </Card.Root>
      ))}
    </div>
  ),
}

export const EmbeddedResponsivePadding: Story = {
  render: () => {
    const previewWidths = {
      wide: 1040,
      medium: 720,
      narrow: 360,
    } as const

    return (
      <Tabs.Root defaultValue="wide">
        <Tabs.List>
          <Tabs.Trigger value="wide">Wide</Tabs.Trigger>
          <Tabs.Trigger value="medium">Medium</Tabs.Trigger>
          <Tabs.Trigger value="narrow">Narrow</Tabs.Trigger>
        </Tabs.List>
        {Object.entries(previewWidths).map(([viewport, width]) => (
          <Tabs.Content key={viewport} value={viewport}>
            <div className="space-y-3 pt-4">
              <div className="text-sm font-medium text-foreground">Preview width: {width}px</div>
              <div className="border rounded-xl bg-muted/30 p-4" style={{ width }}>
                <Card.Root size={{ initial: 'xs', md: 'md', xl: 'xl' }} className="w-full">
                  <Card.Header>
                    <Card.Title>Embedded Card</Card.Title>
                    <Card.Description>Padding should respond to the preview pane width.</Card.Description>
                  </Card.Header>
                  <Card.Content>
                    <p className="text-sm text-muted-foreground">
                      This card now uses container queries for responsive size variants instead of viewport media
                      queries.
                    </p>
                  </Card.Content>
                </Card.Root>
              </div>
            </div>
          </Tabs.Content>
        ))}
      </Tabs.Root>
    )
  },
}

// ============================================================================
// Variants
// ============================================================================

export const VariantSurface: Story = {
  args: {
    size: 'sm',
    variant: 'surface',
    color: 'slate',
    radius: 'md',
    highContrast: false,
    shape: 'rect',
    square: false,
  },
  render: args => (
    <Card.Root
      size={args.size}
      variant={args.variant}
      color={args.color}
      radius={args.radius}
      highContrast={args.highContrast}
      shape={args.shape}
      square={args.square}
      className="w-80"
    >
      <Card.Header>
        <Card.Title>Surface Variant</Card.Title>
        <Card.Description>Background with subtle shadow</Card.Description>
      </Card.Header>
      <Card.Content>
        <p className="text-sm">Default card appearance with background color and border.</p>
      </Card.Content>
    </Card.Root>
  ),
}

export const VariantClassic: Story = {
  args: {
    size: 'sm',
    variant: 'classic',
    color: 'slate',
    radius: 'md',
    highContrast: false,
    shape: 'rect',
    square: false,
  },
  render: args => (
    <Card.Root
      size={args.size}
      variant={args.variant}
      color={args.color}
      radius={args.radius}
      highContrast={args.highContrast}
      shape={args.shape}
      square={args.square}
      className="w-80"
    >
      <Card.Header>
        <Card.Title>Classic Variant</Card.Title>
        <Card.Description>More prominent shadow</Card.Description>
      </Card.Header>
      <Card.Content>
        <p className="text-sm">Classic card with deeper shadow for more emphasis.</p>
      </Card.Content>
    </Card.Root>
  ),
}

export const VariantGhost: Story = {
  args: {
    size: 'sm',
    variant: 'ghost',
    color: 'slate',
    radius: 'md',
    highContrast: false,
    shape: 'rect',
    square: false,
  },
  render: args => (
    <div className="p-6 bg-muted rounded-lg">
      <Card.Root
        size={args.size}
        variant={args.variant}
        color={args.color}
        radius={args.radius}
        highContrast={args.highContrast}
        shape={args.shape}
        square={args.square}
        className="w-80"
      >
        <Card.Header>
          <Card.Title>Ghost Variant</Card.Title>
          <Card.Description>Transparent background</Card.Description>
        </Card.Header>
        <Card.Content>
          <p className="text-sm">Ghost card with no background, useful for nested cards.</p>
        </Card.Content>
      </Card.Root>
    </div>
  ),
}

// ============================================================================
// Real-world Examples
// ============================================================================

export const UserProfile: Story = {
  render: () => (
    <Card.Root className="w-80">
      <Card.Header>
        <div className="flex items-center gap-4">
          <Avatar
            size="lg"
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
          />
          <div>
            <Card.Title>John Doe</Card.Title>
            <Card.Description>Software Engineer</Card.Description>
          </div>
        </div>
      </Card.Header>
      <Card.Content>
        <p className="text-sm text-muted-foreground">
          Building great products with React and TypeScript. Passionate about clean code and user experience.
        </p>
      </Card.Content>
      <Card.Footer className="justify-between">
        <Button variant="outline" size="md">
          Message
        </Button>
        <Button size="md">Follow</Button>
      </Card.Footer>
    </Card.Root>
  ),
}

export const PricingCard: Story = {
  render: () => (
    <Card.Root className="w-72" variant="classic">
      <Card.Header>
        <Badge color="primary" className="w-fit mb-2">
          Popular
        </Badge>
        <Card.Title>Pro Plan</Card.Title>
        <Card.Description>Perfect for growing teams</Card.Description>
      </Card.Header>
      <Card.Content>
        <div className="mb-4">
          <span className="text-4xl font-bold">$29</span>
          <span className="text-muted-foreground">/month</span>
        </div>
        <ul className="space-y-2 text-sm">
          <li className="flex items-center gap-2">
            <span className="text-green-500">✓</span> Unlimited projects
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-500">✓</span> 10GB storage
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-500">✓</span> Priority support
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-500">✓</span> Advanced analytics
          </li>
        </ul>
      </Card.Content>
      <Card.Footer>
        <Button className="w-full">Get Started</Button>
      </Card.Footer>
    </Card.Root>
  ),
}

export const NotificationCard: Story = {
  render: () => (
    <Card.Root className="w-96">
      <Card.Header>
        <div className="flex items-center justify-between">
          <Card.Title className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </Card.Title>
          <Badge variant="solid" color="error">
            3 new
          </Badge>
        </div>
      </Card.Header>
      <Card.Content className="space-y-3">
        <div className="flex items-start gap-3 p-2 rounded-md hover:bg-muted">
          <Avatar size="sm" name="John Doe" />
          <div className="flex-1">
            <p className="text-sm font-medium">John commented on your post</p>
            <p className="text-xs text-muted-foreground">2 minutes ago</p>
          </div>
        </div>
        <div className="flex items-start gap-3 p-2 rounded-md hover:bg-muted">
          <Avatar size="sm" name="Alice Smith" />
          <div className="flex-1">
            <p className="text-sm font-medium">Alice started following you</p>
            <p className="text-xs text-muted-foreground">1 hour ago</p>
          </div>
        </div>
        <div className="flex items-start gap-3 p-2 rounded-md hover:bg-muted">
          <Avatar size="sm" name="Mike King" />
          <div className="flex-1">
            <p className="text-sm font-medium">Mike liked your photo</p>
            <p className="text-xs text-muted-foreground">3 hours ago</p>
          </div>
        </div>
      </Card.Content>
      <Card.Footer>
        <Button variant="ghost" className="w-full">
          View all notifications
        </Button>
      </Card.Footer>
    </Card.Root>
  ),
}

export const SettingsCard: Story = {
  render: () => (
    <Card.Root className="w-96">
      <Card.Header>
        <Card.Title className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Account Settings
        </Card.Title>
        <Card.Description>Manage your account preferences</Card.Description>
      </Card.Header>
      <Card.Content className="space-y-4">
        <div className="flex items-center justify-between py-2 border-b">
          <div className="flex items-center gap-3">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Profile</span>
          </div>
          <Button variant="ghost" size="sm">
            Edit
          </Button>
        </div>
        <div className="flex items-center justify-between py-2 border-b">
          <div className="flex items-center gap-3">
            <Bell className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Notifications</span>
          </div>
          <Button variant="ghost" size="sm">
            Edit
          </Button>
        </div>
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-3">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Billing</span>
          </div>
          <Button variant="ghost" size="sm">
            Edit
          </Button>
        </div>
      </Card.Content>
    </Card.Root>
  ),
}

export const StatsCard: Story = {
  render: () => (
    <div className="flex gap-4">
      <Card.Root className="w-48">
        <Card.Header className="pb-2">
          <Card.Description>Total Revenue</Card.Description>
        </Card.Header>
        <Card.Content className="pt-0">
          <p className="text-2xl font-bold">$45,231</p>
          <p className="text-xs text-green-500">+20.1% from last month</p>
        </Card.Content>
      </Card.Root>

      <Card.Root className="w-48">
        <Card.Header className="pb-2">
          <Card.Description>Active Users</Card.Description>
        </Card.Header>
        <Card.Content className="pt-0">
          <p className="text-2xl font-bold">2,350</p>
          <p className="text-xs text-green-500">+180 new this week</p>
        </Card.Content>
      </Card.Root>

      <Card.Root className="w-48">
        <Card.Header className="pb-2">
          <Card.Description>Pending Orders</Card.Description>
        </Card.Header>
        <Card.Content className="pt-0">
          <p className="text-2xl font-bold">12</p>
          <p className="text-xs text-amber-500">3 require attention</p>
        </Card.Content>
      </Card.Root>
    </div>
  ),
}

export const CardGrid: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4 w-[700px]">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <Card.Root key={i}>
          <Card.Header>
            <Card.Title>Card {i}</Card.Title>
          </Card.Header>
          <Card.Content>
            <p className="text-sm text-muted-foreground">Card content goes here.</p>
          </Card.Content>
        </Card.Root>
      ))}
    </div>
  ),
}
