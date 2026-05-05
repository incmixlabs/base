import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Bell,
  BookOpen,
  Bot,
  ChevronDown,
  ChevronsUpDown,
  CreditCard,
  Frame,
  Home,
  Inbox,
  LogOut,
  Mail,
  Map,
  PieChart,
  Search,
  Settings,
  Sparkles,
  SquareTerminal,
  Star,
  UserCircle,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { DropdownMenu } from '@/elements/menu/DropdownMenu'
import { colorPropDef } from '@/theme/props/color.prop'
import { getPropDefValues } from '@/theme/props/prop-def'
import { Sidebar } from './Sidebar'
import type { SidebarCollapsible, SidebarColor, SidebarSide, SidebarVariant } from './sidebar.props'
import { sidebarRootPropDefs } from './sidebar.props'

type DemoArgs = {
  variant?: SidebarVariant
  collapsible?: SidebarCollapsible
  side?: SidebarSide
  color?: SidebarColor
  defaultOpen?: boolean
}

const meta = {
  title: 'Layouts/Sidebar',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Sidebar navigation layout with responsive collapse modes. Styling uses Tailwind for static structure, Surface for panel visual treatment, and vanilla-extract for prop-driven menu button classes.',
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
      description: 'Collapse behavior on desktop.',
    },
    side: {
      control: 'select',
      options: getPropDefValues(sidebarRootPropDefs.side),
      description: 'Which side the sidebar is anchored to.',
    },
    color: {
      control: 'select',
      options: getPropDefValues(colorPropDef.color),
      description: 'Semantic color lane used by the sidebar panel Surface.',
    },
    defaultOpen: {
      control: 'boolean',
      description: 'Initial open state in uncontrolled mode.',
    },
  },
} satisfies Meta<DemoArgs>

export default meta
type Story = StoryObj<DemoArgs>

function SidebarDemo({
  variant = sidebarRootPropDefs.variant.default,
  collapsible = sidebarRootPropDefs.collapsible.default,
  side = sidebarRootPropDefs.side.default,
  color = sidebarRootPropDefs.color.default,
  defaultOpen = true,
}: DemoArgs) {
  const [inboxOpen, setInboxOpen] = useState(true)
  const [activeItem, setActiveItem] = useState<'home' | 'notifications' | 'settings' | null>(null)
  const [activeSubItem, setActiveSubItem] = useState<'unread' | 'starred' | null>('unread')
  const hasInboxActiveChild = activeSubItem === 'unread' || activeSubItem === 'starred'

  return (
    <Sidebar.Provider defaultOpen={defaultOpen} className="h-screen">
      <Sidebar.Root variant={variant} collapsible={collapsible} side={side} color={color}>
        <Sidebar.Content>
          <Sidebar.Group anchor="top">
            <Sidebar.GroupLabel>Workspace</Sidebar.GroupLabel>
            <Sidebar.Menu>
              <Sidebar.MenuItem>
                <Sidebar.MenuButton
                  tooltip="Home"
                  isActive={activeItem === 'home'}
                  onClick={() => {
                    setActiveItem('home')
                    setActiveSubItem(null)
                  }}
                >
                  <Home />
                  <span>Home</span>
                </Sidebar.MenuButton>
              </Sidebar.MenuItem>
              <Sidebar.MenuItem>
                <Sidebar.MenuButton
                  tooltip="Inbox"
                  hasActiveChild={hasInboxActiveChild}
                  onClick={() => setInboxOpen(prev => !prev)}
                  aria-expanded={inboxOpen}
                >
                  <Inbox />
                  <span>Inbox</span>
                  <span className={`ms-auto shrink-0 ${inboxOpen ? '[&>svg]:rotate-180' : '[&>svg]:rotate-0'}`}>
                    <ChevronDown className="size-4 opacity-80 transition-transform duration-150" />
                  </span>
                </Sidebar.MenuButton>
                <Sidebar.MenuBadge>8</Sidebar.MenuBadge>
                <Sidebar.MenuSub open={inboxOpen}>
                  <Sidebar.MenuSubItem>
                    <Sidebar.MenuSubButton
                      href="#"
                      size="sm"
                      isActive={activeSubItem === 'unread'}
                      onClick={event => {
                        event.preventDefault()
                        setActiveItem(null)
                        setActiveSubItem('unread')
                        setInboxOpen(true)
                      }}
                    >
                      <Mail />
                      <span>Unread</span>
                    </Sidebar.MenuSubButton>
                  </Sidebar.MenuSubItem>
                  <Sidebar.MenuSubItem>
                    <Sidebar.MenuSubButton
                      href="#"
                      size="sm"
                      isActive={activeSubItem === 'starred'}
                      onClick={event => {
                        event.preventDefault()
                        setActiveItem(null)
                        setActiveSubItem('starred')
                        setInboxOpen(true)
                      }}
                    >
                      <Star />
                      <span>Starred</span>
                    </Sidebar.MenuSubButton>
                  </Sidebar.MenuSubItem>
                </Sidebar.MenuSub>
              </Sidebar.MenuItem>
            </Sidebar.Menu>
            <Sidebar.Input placeholder="Search" leftIcon={<Search />} className="mt-2" />
          </Sidebar.Group>
          <Sidebar.Group anchor="bottom">
            <Sidebar.Separator />
            <Sidebar.Menu>
              <Sidebar.MenuItem>
                <Sidebar.MenuButton
                  tooltip="Notifications"
                  isActive={activeItem === 'notifications'}
                  onClick={() => {
                    setActiveItem('notifications')
                    setActiveSubItem(null)
                  }}
                >
                  <Bell />
                  <span>Notifications</span>
                </Sidebar.MenuButton>
              </Sidebar.MenuItem>
              <Sidebar.MenuItem>
                <Sidebar.MenuButton
                  tooltip="Settings"
                  isActive={activeItem === 'settings'}
                  onClick={() => {
                    setActiveItem('settings')
                    setActiveSubItem(null)
                  }}
                >
                  <Settings />
                  <span>Settings</span>
                </Sidebar.MenuButton>
              </Sidebar.MenuItem>
            </Sidebar.Menu>
          </Sidebar.Group>
        </Sidebar.Content>
        <Sidebar.Rail />
      </Sidebar.Root>
      <Sidebar.Inset>
        <header className="border-b p-4">
          <Sidebar.Trigger />
        </header>
        <main className="p-6">
          <h2 className="text-xl font-semibold">Sidebar Layout Demo</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Use the controls to switch sidebar variant, side, and collapse behavior.
          </p>
        </main>
      </Sidebar.Inset>
    </Sidebar.Provider>
  )
}

function ControlledSidebarDemo({
  variant = sidebarRootPropDefs.variant.default,
  collapsible = sidebarRootPropDefs.collapsible.default,
  side = sidebarRootPropDefs.side.default,
  color = sidebarRootPropDefs.color.default,
  defaultOpen = true,
}: DemoArgs) {
  const [open, setOpen] = useState(defaultOpen)

  useEffect(() => {
    setOpen(defaultOpen)
  }, [defaultOpen])

  return (
    <Sidebar.Provider open={open} onOpenChange={setOpen} className="h-screen">
      <Sidebar.Root variant={variant} collapsible={collapsible} side={side} color={color}>
        <Sidebar.Content>
          <Sidebar.Group anchor="top">
            <Sidebar.GroupLabel>Navigation</Sidebar.GroupLabel>
            <Sidebar.Menu>
              <Sidebar.MenuItem>
                <Sidebar.MenuButton tooltip="Home" isActive>
                  <Home />
                  <span>Home</span>
                </Sidebar.MenuButton>
              </Sidebar.MenuItem>
              <Sidebar.MenuItem>
                <Sidebar.MenuButton tooltip="Inbox">
                  <Inbox />
                  <span>Inbox</span>
                </Sidebar.MenuButton>
              </Sidebar.MenuItem>
              <Sidebar.MenuItem>
                <Sidebar.MenuButton tooltip="Settings">
                  <Settings />
                  <span>Settings</span>
                </Sidebar.MenuButton>
              </Sidebar.MenuItem>
            </Sidebar.Menu>
          </Sidebar.Group>
        </Sidebar.Content>
        <Sidebar.Rail />
      </Sidebar.Root>
      <Sidebar.Inset>
        <header className="flex items-center gap-3 border-b p-4">
          <Sidebar.Trigger />
          <button
            type="button"
            onClick={() => setOpen(prev => !prev)}
            className="rounded-md border px-3 py-1.5 text-sm"
          >
            {open ? 'Collapse' : 'Expand'}
          </button>
          <span className="text-sm text-muted-foreground">Controlled state: {open ? 'open' : 'closed'}</span>
        </header>
        <main className="space-y-3 p-6">
          <h2 className="text-xl font-semibold">Controlled Sidebar Demo</h2>
          <p className="max-w-2xl text-sm text-muted-foreground">
            This story exercises the controlled `open` / `onOpenChange` API so persistence can be handled outside the
            component with local storage, session storage, or cookies later.
          </p>
        </main>
      </Sidebar.Inset>
    </Sidebar.Provider>
  )
}

export const Playground: Story = {
  args: {
    variant: 'surface',
    collapsible: 'icon',
    side: 'left',
    color: 'neutral',
    defaultOpen: true,
  },
  render: args => <SidebarDemo {...args} />,
}

export const Solid: Story = {
  args: {
    variant: 'solid',
    collapsible: 'icon',
    side: 'left',
    color: 'neutral',
    defaultOpen: true,
  },
  render: args => <SidebarDemo {...args} />,
}

export const Soft: Story = {
  args: {
    variant: 'soft',
    collapsible: 'icon',
    side: 'left',
    color: 'neutral',
    defaultOpen: true,
  },
  render: args => <SidebarDemo {...args} />,
}

export const NestedItems: Story = {
  args: {
    variant: 'surface',
    collapsible: 'icon',
    side: 'left',
    color: 'neutral',
    defaultOpen: true,
  },
  render: args => <SidebarDemo {...args} />,
}

export const ControlledState: Story = {
  args: {
    variant: 'surface',
    collapsible: 'icon',
    side: 'left',
    color: 'neutral',
    defaultOpen: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates the controlled sidebar API. This is the integration point for future persistence helpers built on local storage, session storage, or cookies.',
      },
    },
  },
  render: args => <ControlledSidebarDemo {...args} />,
}

const overflowItems = Array.from({ length: 30 }, (_, i) => `Item ${i + 1}`)

function OverflowDemo({ variant = 'surface', color = 'slate' }: DemoArgs) {
  return (
    <Sidebar.Provider defaultOpen className="h-screen">
      <Sidebar.Root variant={variant} collapsible="icon" color={color}>
        <Sidebar.Content>
          <Sidebar.Group anchor="top">
            <Sidebar.GroupLabel>Pinned</Sidebar.GroupLabel>
            <Sidebar.Menu>
              <Sidebar.MenuItem>
                <Sidebar.MenuButton tooltip="Home">
                  <Home />
                  <span>Home</span>
                </Sidebar.MenuButton>
              </Sidebar.MenuItem>
            </Sidebar.Menu>
          </Sidebar.Group>
          <Sidebar.Group>
            <Sidebar.GroupLabel>All Items</Sidebar.GroupLabel>
            <Sidebar.Menu>
              {overflowItems.map(item => (
                <Sidebar.MenuItem key={item}>
                  <Sidebar.MenuButton tooltip={item}>
                    <Inbox />
                    <span>{item}</span>
                  </Sidebar.MenuButton>
                </Sidebar.MenuItem>
              ))}
            </Sidebar.Menu>
          </Sidebar.Group>
          <Sidebar.Group anchor="bottom">
            <Sidebar.Separator />
            <Sidebar.Menu>
              <Sidebar.MenuItem>
                <Sidebar.MenuButton tooltip="Settings">
                  <Settings />
                  <span>Settings</span>
                </Sidebar.MenuButton>
              </Sidebar.MenuItem>
            </Sidebar.Menu>
          </Sidebar.Group>
        </Sidebar.Content>
        <Sidebar.Rail />
      </Sidebar.Root>
      <Sidebar.Inset>
        <header className="border-b p-4">
          <Sidebar.Trigger />
        </header>
        <main className="p-6">
          <h2 className="text-xl font-semibold">Overflow Test</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            The middle group should scroll while top (Pinned) and bottom (Settings) stay sticky.
          </p>
        </main>
      </Sidebar.Inset>
    </Sidebar.Provider>
  )
}

export const Overflow: Story = {
  args: {
    variant: 'surface',
    color: 'neutral',
  },
  render: args => <OverflowDemo {...args} />,
}

function HoverHighlightDemo({ variant = 'surface', color = 'neutral' }: DemoArgs) {
  const [activeItem, setActiveItem] = useState<string | null>('home')
  const [inboxOpen, setInboxOpen] = useState(false)
  const [activeSubItem, setActiveSubItem] = useState<string | null>(null)

  return (
    <Sidebar.Provider defaultOpen className="h-screen">
      <Sidebar.Root variant={variant} collapsible="icon" color={color}>
        <Sidebar.Content>
          <Sidebar.Group anchor="top">
            <Sidebar.GroupLabel>Navigation</Sidebar.GroupLabel>
            <Sidebar.Menu hoverHighlight>
              <Sidebar.MenuItem>
                <Sidebar.MenuButton
                  tooltip="Home"
                  isActive={activeItem === 'home'}
                  onClick={() => {
                    setActiveItem('home')
                    setActiveSubItem(null)
                  }}
                >
                  <Home />
                  <span>Home</span>
                </Sidebar.MenuButton>
              </Sidebar.MenuItem>
              <Sidebar.MenuItem>
                <Sidebar.MenuButton
                  tooltip="Inbox"
                  hasActiveChild={activeSubItem === 'unread' || activeSubItem === 'starred'}
                  onClick={() => setInboxOpen(prev => !prev)}
                  aria-expanded={inboxOpen}
                >
                  <Inbox />
                  <span>Inbox</span>
                  <span className={`ms-auto shrink-0 ${inboxOpen ? '[&>svg]:rotate-180' : '[&>svg]:rotate-0'}`}>
                    <ChevronDown className="size-4 opacity-80 transition-transform duration-150" />
                  </span>
                </Sidebar.MenuButton>
                <Sidebar.MenuSub open={inboxOpen}>
                  <Sidebar.MenuSubItem>
                    <Sidebar.MenuSubButton
                      href="#"
                      size="sm"
                      isActive={activeSubItem === 'unread'}
                      onClick={event => {
                        event.preventDefault()
                        setActiveItem(null)
                        setActiveSubItem('unread')
                      }}
                    >
                      <Mail />
                      <span>Unread</span>
                    </Sidebar.MenuSubButton>
                  </Sidebar.MenuSubItem>
                  <Sidebar.MenuSubItem>
                    <Sidebar.MenuSubButton
                      href="#"
                      size="sm"
                      isActive={activeSubItem === 'starred'}
                      onClick={event => {
                        event.preventDefault()
                        setActiveItem(null)
                        setActiveSubItem('starred')
                      }}
                    >
                      <Star />
                      <span>Starred</span>
                    </Sidebar.MenuSubButton>
                  </Sidebar.MenuSubItem>
                </Sidebar.MenuSub>
              </Sidebar.MenuItem>
              <Sidebar.MenuItem>
                <Sidebar.MenuButton
                  tooltip="Search"
                  isActive={activeItem === 'search'}
                  onClick={() => {
                    setActiveItem('search')
                    setActiveSubItem(null)
                  }}
                >
                  <Search />
                  <span>Search</span>
                </Sidebar.MenuButton>
              </Sidebar.MenuItem>
              <Sidebar.MenuItem>
                <Sidebar.MenuButton
                  tooltip="Notifications"
                  isActive={activeItem === 'notifications'}
                  onClick={() => {
                    setActiveItem('notifications')
                    setActiveSubItem(null)
                  }}
                >
                  <Bell />
                  <span>Notifications</span>
                </Sidebar.MenuButton>
              </Sidebar.MenuItem>
              <Sidebar.MenuItem>
                <Sidebar.MenuButton
                  tooltip="Settings"
                  isActive={activeItem === 'settings'}
                  onClick={() => {
                    setActiveItem('settings')
                    setActiveSubItem(null)
                  }}
                >
                  <Settings />
                  <span>Settings</span>
                </Sidebar.MenuButton>
              </Sidebar.MenuItem>
            </Sidebar.Menu>
          </Sidebar.Group>
        </Sidebar.Content>
        <Sidebar.Rail />
      </Sidebar.Root>
      <Sidebar.Inset>
        <header className="border-b p-4">
          <Sidebar.Trigger />
        </header>
        <main className="p-6">
          <h2 className="text-xl font-semibold">Hover Highlight</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Hover over the sidebar menu items to see the animated highlight follow your cursor. Click "Inbox" to
            expand/collapse sub-items. The highlight also follows keyboard focus (Tab through items).
          </p>
        </main>
      </Sidebar.Inset>
    </Sidebar.Provider>
  )
}

export const HoverHighlight: Story = {
  args: {
    variant: 'surface',
    color: 'neutral',
  },
  argTypes: {
    collapsible: { table: { disable: true } },
    side: { table: { disable: true } },
    defaultOpen: { table: { disable: true } },
  },
  render: args => <HoverHighlightDemo {...args} />,
}

// ============================================================================
// Sidebar with Dropdown Menu
// ============================================================================

function SidebarDropdownMenuDemo({ variant = 'surface', color = 'neutral' }: DemoArgs) {
  const [activeItem, setActiveItem] = useState<string | null>('playground')
  const [playgroundOpen, setPlaygroundOpen] = useState(true)

  return (
    <Sidebar.Provider defaultOpen className="h-screen">
      <Sidebar.Root variant={variant} collapsible="icon" color={color}>
        <Sidebar.Content>
          <Sidebar.Group anchor="top">
            <Sidebar.GroupLabel>Platform</Sidebar.GroupLabel>
            <Sidebar.Menu hoverHighlight>
              <Sidebar.MenuItem>
                <Sidebar.MenuButton
                  tooltip="Playground"
                  hasActiveChild={activeItem === 'playground'}
                  onClick={() => setPlaygroundOpen(prev => !prev)}
                  aria-expanded={playgroundOpen}
                >
                  <SquareTerminal />
                  <span>Playground</span>
                  <span className={`ms-auto shrink-0 ${playgroundOpen ? '[&>svg]:rotate-180' : '[&>svg]:rotate-0'}`}>
                    <ChevronDown className="size-4 opacity-80 transition-transform duration-150" />
                  </span>
                </Sidebar.MenuButton>
                <Sidebar.MenuSub open={playgroundOpen}>
                  <Sidebar.MenuSubItem>
                    <Sidebar.MenuSubButton href="#" size="sm" isActive onClick={e => e.preventDefault()}>
                      <span>History</span>
                    </Sidebar.MenuSubButton>
                  </Sidebar.MenuSubItem>
                  <Sidebar.MenuSubItem>
                    <Sidebar.MenuSubButton href="#" size="sm" onClick={e => e.preventDefault()}>
                      <span>Starred</span>
                    </Sidebar.MenuSubButton>
                  </Sidebar.MenuSubItem>
                  <Sidebar.MenuSubItem>
                    <Sidebar.MenuSubButton href="#" size="sm" onClick={e => e.preventDefault()}>
                      <span>Settings</span>
                    </Sidebar.MenuSubButton>
                  </Sidebar.MenuSubItem>
                </Sidebar.MenuSub>
              </Sidebar.MenuItem>
              <Sidebar.MenuItem>
                <Sidebar.MenuButton tooltip="Models" onClick={() => setActiveItem('models')}>
                  <Bot />
                  <span>Models</span>
                </Sidebar.MenuButton>
              </Sidebar.MenuItem>
              <Sidebar.MenuItem>
                <Sidebar.MenuButton tooltip="Documentation" onClick={() => setActiveItem('docs')}>
                  <BookOpen />
                  <span>Documentation</span>
                </Sidebar.MenuButton>
              </Sidebar.MenuItem>
              <Sidebar.MenuItem>
                <Sidebar.MenuButton tooltip="Settings" onClick={() => setActiveItem('settings')}>
                  <Settings />
                  <span>Settings</span>
                </Sidebar.MenuButton>
              </Sidebar.MenuItem>
            </Sidebar.Menu>
          </Sidebar.Group>
          <Sidebar.Group>
            <Sidebar.GroupLabel>Projects</Sidebar.GroupLabel>
            <Sidebar.Menu hoverHighlight>
              <Sidebar.MenuItem>
                <Sidebar.MenuButton tooltip="Design Engineering">
                  <Frame />
                  <span>Design Engineering</span>
                </Sidebar.MenuButton>
              </Sidebar.MenuItem>
              <Sidebar.MenuItem>
                <Sidebar.MenuButton tooltip="Sales & Marketing">
                  <PieChart />
                  <span>Sales &amp; Marketing</span>
                </Sidebar.MenuButton>
              </Sidebar.MenuItem>
              <Sidebar.MenuItem>
                <Sidebar.MenuButton tooltip="Travel">
                  <Map />
                  <span>Travel</span>
                </Sidebar.MenuButton>
              </Sidebar.MenuItem>
            </Sidebar.Menu>
          </Sidebar.Group>
          <Sidebar.Group anchor="bottom">
            <Sidebar.Separator />
            <Sidebar.Menu>
              <Sidebar.MenuItem>
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger>
                    <Sidebar.MenuButton size="lg" tooltip="Skyleen">
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground text-xs font-semibold">
                        CN
                      </span>
                      <span className="flex min-w-0 flex-col">
                        <span className="truncate text-sm font-semibold">Skyleen</span>
                        <span className="truncate text-xs opacity-70">skyleen@example.com</span>
                      </span>
                      <ChevronsUpDown className="ms-auto size-4 opacity-70" />
                    </Sidebar.MenuButton>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content animated side="right" align="end" sideOffset={8}>
                    <DropdownMenu.Label>
                      <span className="flex items-center gap-2">
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground text-xs font-semibold">
                          CN
                        </span>
                        <span className="flex min-w-0 flex-col">
                          <span className="truncate text-sm font-semibold">Skyleen</span>
                          <span className="truncate text-xs opacity-70">skyleen@example.com</span>
                        </span>
                      </span>
                    </DropdownMenu.Label>
                    <DropdownMenu.Separator />
                    <DropdownMenu.Item>
                      <Sparkles className="size-4" />
                      Upgrade to Pro
                    </DropdownMenu.Item>
                    <DropdownMenu.Separator />
                    <DropdownMenu.Item>
                      <UserCircle className="size-4" />
                      Account
                    </DropdownMenu.Item>
                    <DropdownMenu.Item>
                      <CreditCard className="size-4" />
                      Billing
                    </DropdownMenu.Item>
                    <DropdownMenu.Item>
                      <Bell className="size-4" />
                      Notifications
                    </DropdownMenu.Item>
                    <DropdownMenu.Separator />
                    <DropdownMenu.Item>
                      <LogOut className="size-4" />
                      Log out
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
              </Sidebar.MenuItem>
            </Sidebar.Menu>
          </Sidebar.Group>
        </Sidebar.Content>
        <Sidebar.Rail />
      </Sidebar.Root>
      <Sidebar.Inset>
        <header className="border-b p-4">
          <Sidebar.Trigger />
        </header>
        <main className="p-6">
          <h2 className="text-xl font-semibold">Sidebar with Dropdown Menu</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Click the user button at the bottom to open an animated dropdown menu. The highlight follows your
            cursor/keyboard across menu items.
          </p>
        </main>
      </Sidebar.Inset>
    </Sidebar.Provider>
  )
}

export const WithDropdownMenu: Story = {
  args: {
    variant: 'surface',
    color: 'neutral',
  },
  argTypes: {
    collapsible: { table: { disable: true } },
    side: { table: { disable: true } },
    defaultOpen: { table: { disable: true } },
  },
  render: args => <SidebarDropdownMenuDemo {...args} />,
}
