import type { Meta, StoryObj } from '@storybook/react-vite'
import { Bell, BookOpen, FileText, GalleryVerticalEnd, Home, Inbox, Mail, Settings, Star, Users } from 'lucide-react'
import * as React from 'react'
import { colorPropDef } from '@/theme/props/color.prop'
import { getPropDefValues } from '@/theme/props/prop-def'
import { Sidebar } from './Sidebar'
import { SidebarWrapper } from './SidebarWrapper'
import { sidebarRootPropDefs } from './sidebar.props'
import type {
  SidebarWrapperData,
  SidebarWrapperItem,
  SidebarWrapperProps,
  SidebarWrapperSearch,
  SidebarWrapperTeam,
  SidebarWrapperUser,
} from './sidebar-wrapper.types'

// ---------------------------------------------------------------------------
// Shared data objects
// ---------------------------------------------------------------------------

const demoTeam: SidebarWrapperTeam = {
  name: 'Acme Inc',
  subtitle: 'Enterprise',
  logo: GalleryVerticalEnd,
  onClick: () => {},
}

const demoUser: SidebarWrapperUser = {
  name: 'shadcn',
  email: 'm@example.com',
  avatar: 'SC',
  onClick: () => {},
}

const demoSearch: SidebarWrapperSearch = {
  placeholder: 'Search...',
}

const defaultData: SidebarWrapperData = [
  {
    group: 'Workspace',
    anchor: 'top',
    items: [
      { label: 'Home', icon: Home, href: '#', tooltip: 'Home', isActive: true },
      { label: 'Inbox', icon: Inbox, badge: 8, href: '#', tooltip: 'Inbox' },
      { label: 'Documents', icon: FileText, href: '#', tooltip: 'Documents' },
      { label: 'Members', icon: Users, href: '#', tooltip: 'Members' },
    ],
  },
  {
    group: 'Settings',
    anchor: 'bottom',
    items: [
      { label: 'Notifications', icon: Bell, href: '#', tooltip: 'Notifications' },
      { label: 'Settings', icon: Settings, href: '#', tooltip: 'Settings' },
    ],
  },
]

const dataWithSubItems: SidebarWrapperData = [
  {
    group: 'Workspace',
    anchor: 'top',
    items: [
      { label: 'Home', icon: Home, href: '#', tooltip: 'Home' },
      {
        label: 'Inbox',
        icon: Inbox,
        badge: 8,
        tooltip: 'Inbox',
        children: [
          { label: 'Unread', icon: Mail, href: '#', isActive: true },
          { label: 'Starred', icon: Star, href: '#' },
        ],
      },
      {
        label: 'Docs',
        icon: BookOpen,
        tooltip: 'Docs',
        children: [
          { label: 'Getting Started', href: '#' },
          { label: 'API Reference', href: '#' },
          { label: 'Examples', href: '#' },
        ],
      },
    ],
  },
  {
    group: 'Settings',
    anchor: 'bottom',
    items: [{ label: 'Settings', icon: Settings, href: '#', tooltip: 'Settings' }],
  },
]

const remoteDataWithSubItems: SidebarWrapperData = [
  {
    group: 'Workspace',
    anchor: 'top',
    items: [
      { label: 'Home', href: '#', tooltip: 'Home' },
      {
        label: 'Inbox',
        badge: 8,
        tooltip: 'Inbox',
        children: [
          { label: 'Unread', href: '#', isActive: true },
          { label: 'Starred', href: '#' },
        ],
      },
      {
        label: 'Docs',
        tooltip: 'Docs',
        children: [
          { label: 'Getting Started', href: '#' },
          { label: 'API Reference', href: '#' },
          { label: 'Examples', href: '#' },
        ],
      },
    ],
  },
  {
    group: 'Settings',
    anchor: 'bottom',
    items: [{ label: 'Settings', href: '#', tooltip: 'Settings' }],
  },
]

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta = {
  title: 'Layouts/SidebarWrapper',
  component: SidebarWrapper,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Data-driven sidebar wrapper that renders `Sidebar.*` primitives from a typed data array. ' +
          'Supports local data, remote fetching with skeleton loading, collapsible sub-items, and render overrides.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: getPropDefValues(sidebarRootPropDefs.variant),
      description: 'Visual variant passed to the underlying Surface.',
    },
    collapsible: {
      control: 'select',
      options: getPropDefValues(sidebarRootPropDefs.collapsible),
      description: 'Collapse behaviour on desktop.',
    },
    side: {
      control: 'select',
      options: getPropDefValues(sidebarRootPropDefs.side),
      description: 'Which side the sidebar is anchored to.',
    },
    color: {
      control: 'select',
      options: getPropDefValues(colorPropDef.color),
      description: 'Semantic colour lane.',
    },
    defaultOpen: {
      control: 'boolean',
      description: 'Initial open state in uncontrolled mode.',
    },
  },
} satisfies Meta<SidebarWrapperProps>

export default meta
type Story = StoryObj<SidebarWrapperProps>

// ---------------------------------------------------------------------------
// Shared layout shell — only uses children slot (Sidebar.Inset + Trigger)
// ---------------------------------------------------------------------------

function WithInset({ children, ...wrapperProps }: SidebarWrapperProps & { children?: React.ReactNode }) {
  return (
    <SidebarWrapper {...wrapperProps}>
      <Sidebar.Inset>
        <header className="border-b p-4">
          <Sidebar.Trigger />
        </header>
        <main className="p-6">
          {children ?? (
            <>
              <h2 className="text-xl font-semibold">SidebarWrapper Demo</h2>
              <p className="mt-2 text-sm text-muted-foreground">This sidebar is rendered entirely from data props.</p>
            </>
          )}
        </main>
      </Sidebar.Inset>
    </SidebarWrapper>
  )
}

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

export const Default: Story = {
  args: {
    data: defaultData,
    variant: 'surface',
    collapsible: 'icon',
    side: 'left',
    color: 'neutral',
    defaultOpen: true,
  },
  render: args => <WithInset {...args} />,
}

export const WithSubItems: Story = {
  args: {
    data: dataWithSubItems,
    variant: 'surface',
    collapsible: 'icon',
    side: 'left',
    color: 'neutral',
    defaultOpen: true,
  },
  render: args => <WithInset {...args} />,
}

export const Solid: Story = {
  args: {
    data: defaultData,
    variant: 'solid',
    collapsible: 'icon',
    side: 'left',
    color: 'primary',
    defaultOpen: true,
  },
  render: args => <WithInset {...args} />,
}

export const Soft: Story = {
  args: {
    data: defaultData,
    variant: 'soft',
    collapsible: 'icon',
    side: 'left',
    color: 'accent',
    defaultOpen: true,
  },
  render: args => <WithInset {...args} />,
}

// ---------------------------------------------------------------------------
// With team header, user footer, and search — all data-driven
// ---------------------------------------------------------------------------

export const WithTeamAndUser: Story = {
  args: {
    data: dataWithSubItems,
    team: demoTeam,
    user: demoUser,
    search: demoSearch,
    variant: 'surface',
    collapsible: 'icon',
    side: 'left',
    color: 'neutral',
    defaultOpen: true,
  },
  render: args => <WithInset {...args} />,
}

// ---------------------------------------------------------------------------
// Remote loading simulation
// ---------------------------------------------------------------------------

function RemoteLoadingDemo(props: SidebarWrapperProps) {
  const mockRemotePath = '/__storybook/sidebar-wrapper-remote-loading'

  React.useLayoutEffect(() => {
    const originalFetch = globalThis.fetch
    globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const requestUrl = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url
      let pathname = ''
      try {
        pathname = new URL(requestUrl, globalThis.location?.href).pathname
      } catch {
        pathname = requestUrl
      }

      if (pathname.includes(mockRemotePath)) {
        await new Promise(resolve => setTimeout(resolve, 2000))
        return new Response(JSON.stringify(remoteDataWithSubItems), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      }
      return originalFetch(input, init)
    }

    return () => {
      globalThis.fetch = originalFetch
    }
  }, [])

  return (
    <SidebarWrapper {...props} data={undefined} remoteUrl={mockRemotePath}>
      <Sidebar.Inset>
        <header className="border-b p-4">
          <Sidebar.Trigger />
        </header>
        <main className="p-6">
          <h2 className="text-xl font-semibold">Remote Loading Demo</h2>
          <p className="mt-2 text-sm text-muted-foreground">Sidebar loads from a mocked 2-second remote response.</p>
        </main>
      </Sidebar.Inset>
    </SidebarWrapper>
  )
}

export const RemoteLoading: Story = {
  args: {
    team: demoTeam,
    user: demoUser,
    variant: 'surface',
    collapsible: 'icon',
    side: 'left',
    color: 'neutral',
    defaultOpen: true,
  },
  render: args => <RemoteLoadingDemo {...args} />,
}

// ---------------------------------------------------------------------------
// Custom render override
// ---------------------------------------------------------------------------

/**
 * Demonstrates `renderItem` override — the "Home" item gets a fully custom
 * render while all other items fall back to the default data-driven output.
 */
export const CustomRender: Story = {
  args: {
    data: [
      {
        group: 'Workspace',
        anchor: 'top' as const,
        items: [
          { label: 'Home', icon: Home, href: '#', tooltip: 'Home', isActive: true },
          { label: 'Inbox', icon: Inbox, badge: 8, href: '#', tooltip: 'Inbox' },
          { label: 'Documents', icon: FileText, href: '#', tooltip: 'Documents' },
          { label: 'Members', icon: Users, href: '#', tooltip: 'Members' },
        ],
      },
      {
        group: 'Settings',
        anchor: 'bottom' as const,
        items: [
          { label: 'Notifications', icon: Bell, href: '#', tooltip: 'Notifications' },
          { label: 'Settings', icon: Settings, href: '#', tooltip: 'Settings' },
        ],
      },
    ],
    team: demoTeam,
    user: demoUser,
    variant: 'surface',
    collapsible: 'icon',
    side: 'left',
    color: 'neutral',
    defaultOpen: true,
    renderItem: (item: SidebarWrapperItem, defaultRender: React.ReactNode) => {
      if (item.label === 'Home') {
        return (
          <Sidebar.MenuItem className="flex items-center">
            <Sidebar.MenuButton tooltip="Home" isActive className="flex-1 min-w-0">
              <Home className="size-4 shrink-0" />
              <span>Home</span>
            </Sidebar.MenuButton>
            <span className="me-1 shrink-0 rounded-full bg-emerald-500 px-1.5 py-0.5 text-[0.65rem] font-semibold leading-none text-white">
              New
            </span>
          </Sidebar.MenuItem>
        )
      }
      return defaultRender
    },
  },
  render: args => (
    <WithInset {...args}>
      <h2 className="text-xl font-semibold">Custom Render Demo</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        The &quot;Home&quot; item uses a <code>renderItem</code> override with a custom badge. All other items use the
        default data-driven rendering.
      </p>
    </WithInset>
  ),
}

// ---------------------------------------------------------------------------
// Overflow — many items with sticky top/bottom groups
// ---------------------------------------------------------------------------

const overflowData: SidebarWrapperData = [
  {
    group: 'Pinned',
    anchor: 'top',
    items: [{ label: 'Home', icon: Home, href: '#', tooltip: 'Home', isActive: true }],
  },
  {
    group: 'All Items',
    items: Array.from({ length: 30 }, (_, i) => ({
      label: `Item ${i + 1}`,
      icon: Inbox,
      href: '#',
      tooltip: `Item ${i + 1}`,
    })),
  },
  {
    group: 'Settings',
    anchor: 'bottom',
    items: [{ label: 'Settings', icon: Settings, href: '#', tooltip: 'Settings' }],
  },
]

export const Overflow: Story = {
  args: {
    data: overflowData,
    variant: 'surface',
    collapsible: 'icon',
    side: 'left',
    color: 'neutral',
    defaultOpen: true,
  },
  render: args => (
    <WithInset {...args}>
      <h2 className="text-xl font-semibold">Overflow Test</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        The middle group should scroll while top (Pinned) and bottom (Settings) stay sticky.
      </p>
    </WithInset>
  ),
}

// ---------------------------------------------------------------------------
// Playground (full controls)
// ---------------------------------------------------------------------------

export const Playground: Story = {
  args: {
    data: dataWithSubItems,
    team: demoTeam,
    user: demoUser,
    search: demoSearch,
    variant: 'surface',
    collapsible: 'icon',
    side: 'left',
    color: 'neutral',
    defaultOpen: true,
    showRail: true,
  },
  argTypes: {
    showRail: { control: 'boolean', description: 'Show the sidebar rail for resize/toggle.' },
  },
  render: args => <WithInset {...args} />,
}
