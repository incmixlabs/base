import type { Meta, StoryObj } from '@storybook/react-vite'
import { BookOpen, Boxes, ChartSpline, FileText, Layers, LifeBuoy, Rocket, ShieldCheck } from 'lucide-react'
import { NavigationMenu } from '@/elements'
import { SemanticColor, semanticColorKeys } from '@/theme/props/color.prop'
import { getPropDefValues } from '@/theme/props/prop-def'
import { Text } from '@/typography'
import { navigationMenuPropDefs } from './navigation-menu.props'

const productLinks = [
  {
    href: '#dashboard',
    title: 'Dashboard',
    description: 'Operational views for live teams, metrics, and exceptions.',
    icon: ChartSpline,
  },
  {
    href: '#workflows',
    title: 'Workflows',
    description: 'Coordinate approvals, assignments, and recurring process steps.',
    icon: Layers,
  },
  {
    href: '#automation',
    title: 'Automation',
    description: 'Trigger work from events, schedules, or data changes.',
    icon: Rocket,
  },
  {
    href: '#controls',
    title: 'Controls',
    description: 'Permission-aware tools with audit-friendly interaction trails.',
    icon: ShieldCheck,
  },
] as const

const resourceLinks = [
  {
    href: '#docs',
    title: 'Documentation',
    description: 'Implementation notes, recipes, and component guidance.',
    icon: BookOpen,
  },
  {
    href: '#templates',
    title: 'Templates',
    description: 'Starter surfaces for common app and admin workflows.',
    icon: Boxes,
  },
  {
    href: '#changelog',
    title: 'Changelog',
    description: 'Recent releases and migration notes.',
    icon: FileText,
  },
  {
    href: '#support',
    title: 'Support',
    description: 'Escalation paths and help for production teams.',
    icon: LifeBuoy,
  },
] as const

const meta = {
  title: 'Elements/NavigationMenu',
  component: NavigationMenu.Root,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof NavigationMenu.Root>

export default meta

type Story = StoryObj<typeof NavigationMenu.Root>

type PlaygroundArgs = {
  size: (typeof navigationMenuPropDefs.Root.size.values)[number]
  variant: (typeof navigationMenuPropDefs.Root.variant.values)[number]
  color: (typeof semanticColorKeys)[number]
  highContrast: boolean
  radius: (typeof navigationMenuPropDefs.Root.radius.values)[number] | undefined
  sideOffset: number
}

function LinkGrid({ links }: { links: typeof productLinks | typeof resourceLinks }) {
  return (
    <div className="grid w-[min(36rem,calc(100vw-2rem))] grid-cols-1 gap-1 sm:grid-cols-2">
      {links.map(item => {
        const Icon = item.icon
        return (
          <NavigationMenu.Link
            key={item.href}
            href={item.href}
            title={item.title}
            description={item.description}
            icon={<Icon aria-hidden className="h-5 w-5" />}
          />
        )
      })}
    </div>
  )
}

function ExampleNavigationMenu({ sideOffset = 10, ...rootProps }: Partial<PlaygroundArgs> & { sideOffset?: number }) {
  return (
    <NavigationMenu.Root {...rootProps}>
      <NavigationMenu.List>
        <NavigationMenu.Item value="product">
          <NavigationMenu.Trigger>Product</NavigationMenu.Trigger>
          <NavigationMenu.Content>
            <LinkGrid links={productLinks} />
          </NavigationMenu.Content>
        </NavigationMenu.Item>
        <NavigationMenu.Item value="resources">
          <NavigationMenu.Trigger>Resources</NavigationMenu.Trigger>
          <NavigationMenu.Content>
            <LinkGrid links={resourceLinks} />
          </NavigationMenu.Content>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Link href="#pricing">Pricing</NavigationMenu.Link>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Link href="#company">Company</NavigationMenu.Link>
        </NavigationMenu.Item>
      </NavigationMenu.List>
      <NavigationMenu.Portal>
        <NavigationMenu.Positioner sideOffset={sideOffset}>
          <NavigationMenu.Popup />
        </NavigationMenu.Positioner>
      </NavigationMenu.Portal>
    </NavigationMenu.Root>
  )
}

export const CustomLinkRendering: Story = {
  render: () => (
    <NavigationMenu.Root>
      <NavigationMenu.List>
        <NavigationMenu.Item value="learn">
          <NavigationMenu.Trigger>Learn</NavigationMenu.Trigger>
          <NavigationMenu.Content>
            <div className="flex w-[min(28rem,calc(100vw-2rem))] flex-col gap-1">
              <NavigationMenu.Link href="#guides" title="Guides" description="Step-by-step integration examples." />
              <NavigationMenu.Link
                href="#api"
                title="API reference"
                description="Props, states, and composition notes."
              />
            </div>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Link render={<a href="#external" target="_blank" rel="noreferrer" />}>
            External docs
          </NavigationMenu.Link>
        </NavigationMenu.Item>
      </NavigationMenu.List>
      <NavigationMenu.Portal>
        <NavigationMenu.Positioner sideOffset={10}>
          <NavigationMenu.Popup />
        </NavigationMenu.Positioner>
      </NavigationMenu.Portal>
    </NavigationMenu.Root>
  ),
}
export const Playground: StoryObj<PlaygroundArgs> = {
  argTypes: {
    size: {
      control: 'select',
      options: getPropDefValues(navigationMenuPropDefs.Root.size),
    },
    variant: {
      control: 'select',
      options: getPropDefValues(navigationMenuPropDefs.Root.variant),
    },
    color: {
      control: 'select',
      options: semanticColorKeys,
    },
    highContrast: {
      control: 'boolean',
    },
    radius: {
      control: 'select',
      options: [undefined, ...getPropDefValues(navigationMenuPropDefs.Root.radius)],
    },
    sideOffset: {
      control: { type: 'number', min: 0, max: 24, step: 1 },
    },
  },
  args: {
    size: 'md',
    variant: 'solid',
    color: SemanticColor.slate,
    highContrast: false,
    radius: undefined,
    sideOffset: 10,
  },
  render: args => <ExampleNavigationMenu {...args} />,
}

export const Default: Story = {
  render: () => <ExampleNavigationMenu />,
}

export const SoftPanel: Story = {
  render: () => <ExampleNavigationMenu variant="soft" color="primary" />,
}

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      {navigationMenuPropDefs.Root.size.values.map(size => (
        <div key={size} className="flex flex-col gap-2">
          <Text as="p" size="sm" weight="medium" color="neutral" muted>
            Size {size}
          </Text>
          <ExampleNavigationMenu size={size} />
        </div>
      ))}
    </div>
  ),
}

export const Colors: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      {semanticColorKeys.map(color => (
        <div key={color} className="flex flex-col gap-2">
          <Text as="p" size="sm" weight="medium" color="neutral" muted className="capitalize">
            {color}
          </Text>
          <ExampleNavigationMenu color={color} />
        </div>
      ))}
    </div>
  ),
}

export const Vertical: Story = {
  render: () => (
    <NavigationMenu.Root orientation="vertical" defaultValue="product" className="items-start">
      <NavigationMenu.List>
        <NavigationMenu.Item value="product">
          <NavigationMenu.Trigger>Product</NavigationMenu.Trigger>
          <NavigationMenu.Content>
            <div className="flex w-[min(26rem,calc(100vw-2rem))] flex-col gap-1">
              {productLinks.map(item => {
                const Icon = item.icon
                return (
                  <NavigationMenu.Link
                    key={item.href}
                    href={item.href}
                    title={item.title}
                    description={item.description}
                    icon={<Icon aria-hidden className="h-5 w-5" />}
                  />
                )
              })}
            </div>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
        <NavigationMenu.Item value="resources">
          <NavigationMenu.Trigger>Resources</NavigationMenu.Trigger>
          <NavigationMenu.Content>
            <div className="flex w-[min(26rem,calc(100vw-2rem))] flex-col gap-1">
              {resourceLinks.map(item => {
                const Icon = item.icon
                return (
                  <NavigationMenu.Link
                    key={item.href}
                    href={item.href}
                    title={item.title}
                    description={item.description}
                    icon={<Icon aria-hidden className="h-5 w-5" />}
                  />
                )
              })}
            </div>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
      </NavigationMenu.List>
      <NavigationMenu.Portal>
        <NavigationMenu.Positioner side="right" align="start" sideOffset={10}>
          <NavigationMenu.Popup />
        </NavigationMenu.Positioner>
      </NavigationMenu.Portal>
    </NavigationMenu.Root>
  ),
}
