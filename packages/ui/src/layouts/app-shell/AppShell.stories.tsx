import type { Meta, StoryObj } from '@storybook/react-vite'
import { Bell, FileText, Filter, GalleryVerticalEnd, Home, Inbox, LayoutDashboard, Settings, Users } from 'lucide-react'
import { Badge } from '@/elements/badge/Badge'
import { Checkbox } from '@/form/Checkbox'
import { CommandSearchProvider } from '@/layouts/command-search/CommandSearch'
import { Sidebar } from '@/layouts/sidebar/Sidebar'
import { sidebarRootPropDefs } from '@/layouts/sidebar/sidebar.props'
import { colorPropDef } from '@/theme/props/color.prop'
import { getPropDefValues } from '@/theme/props/prop-def'
import { AppShell } from './AppShell'

// ─── Demo data ──────────────────────────────────────────────────────

const searchItems = [
  { id: 'dashboard', label: 'Dashboard', section: 'Pages', onSelect: () => {} },
  { id: 'home', label: 'Home', section: 'Pages', onSelect: () => {} },
  { id: 'inbox', label: 'Inbox', section: 'Pages', onSelect: () => {} },
  { id: 'documents', label: 'Documents', section: 'Pages', onSelect: () => {} },
  { id: 'members', label: 'Members', section: 'Pages', onSelect: () => {} },
  { id: 'settings', label: 'Settings', section: 'Settings', onSelect: () => {} },
]

// ─── Sidebar content ────────────────────────────────────────────────

function DemoSidebarContent() {
  return (
    <>
      <Sidebar.Content>
        <Sidebar.Group>
          <Sidebar.GroupLabel>
            <GalleryVerticalEnd className="size-4" />
            <span>Acme Inc</span>
          </Sidebar.GroupLabel>
        </Sidebar.Group>
        <Sidebar.Group anchor="top">
          <Sidebar.GroupLabel>Workspace</Sidebar.GroupLabel>
          <Sidebar.Menu>
            <Sidebar.MenuItem>
              <Sidebar.MenuButton isActive tooltip="Dashboard">
                <LayoutDashboard />
                <span>Dashboard</span>
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
            <Sidebar.MenuItem>
              <Sidebar.MenuButton tooltip="Home">
                <Home />
                <span>Home</span>
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
            <Sidebar.MenuItem>
              <Sidebar.MenuButton tooltip="Inbox">
                <Inbox />
                <span>Inbox</span>
              </Sidebar.MenuButton>
              <Sidebar.MenuBadge>8</Sidebar.MenuBadge>
            </Sidebar.MenuItem>
            <Sidebar.MenuItem>
              <Sidebar.MenuButton tooltip="Documents">
                <FileText />
                <span>Documents</span>
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
            <Sidebar.MenuItem>
              <Sidebar.MenuButton tooltip="Members">
                <Users />
                <span>Members</span>
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
          </Sidebar.Menu>
        </Sidebar.Group>
        <Sidebar.Group anchor="bottom">
          <Sidebar.Menu>
            <Sidebar.MenuItem>
              <Sidebar.MenuButton tooltip="Notifications">
                <Bell />
                <span>Notifications</span>
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
    </>
  )
}

// ─── Secondary panel content ────────────────────────────────────────

function DemoSecondaryContent() {
  return (
    <AppShell.SecondaryContent gap="4">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <Filter className="size-3.5" />
        Filters
      </div>
      <div className="flex flex-col gap-3">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Status</label>
          <div className="flex flex-col gap-1.5">
            {['Active', 'Inactive', 'Pending', 'Archived'].map(status => (
              <label key={status} className="flex cursor-pointer items-center gap-2 text-sm">
                <Checkbox size="sm" defaultChecked={status === 'Active'} />
                <span>{status}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Type</label>
          <div className="flex flex-col gap-1.5">
            {['Document', 'Spreadsheet', 'Presentation'].map(type => (
              <label key={type} className="flex cursor-pointer items-center gap-2 text-sm">
                <Checkbox size="sm" />
                <span>{type}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </AppShell.SecondaryContent>
  )
}

function DemoLayoutEditorContent() {
  return (
    <AppShell.SecondaryContent gap="4">
      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Layout Editor</div>
      <div className="rounded-lg border border-border bg-card p-3">
        <div className="text-sm font-medium">Canvas</div>
        <div className="mt-2 text-xs text-muted-foreground">Marketing Landing Page</div>
      </div>
      <div className="space-y-3">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Grid</label>
          <div className="flex flex-col gap-1.5">
            {['12 column', '8 column', 'Freeform'].map(option => (
              <label key={option} className="flex cursor-pointer items-center gap-2 text-sm">
                <Checkbox size="sm" defaultChecked={option === '12 column'} />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Panels</label>
          <div className="flex flex-col gap-1.5">
            {['Inspector', 'Comments', 'Outline'].map(option => (
              <label key={option} className="flex cursor-pointer items-center gap-2 text-sm">
                <Checkbox size="sm" defaultChecked={option !== 'Comments'} />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
      <div className="rounded-lg border border-dashed border-border p-3 text-xs text-muted-foreground">
        Secondary regions can host tools like layout editors, inspectors, and contextual controls, not only filters.
      </div>
    </AppShell.SecondaryContent>
  )
}

// ─── Shared content area ────────────────────────────────────────────

function DemoContent() {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {['Total Revenue', 'Subscriptions', 'Sales', 'Active Now'].map(title => (
          <div key={title} className="rounded-lg border border-border bg-card p-6">
            <div className="text-sm font-medium text-muted-foreground">{title}</div>
            <div className="mt-2 text-2xl font-bold">$45,231.89</div>
            <div className="mt-1 text-xs text-muted-foreground">+20.1% from last month</div>
          </div>
        ))}
      </div>
      <div className="mt-6 rounded-lg border border-border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold">Recent Activity</h2>
        <div className="space-y-4">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="flex items-center justify-between border-b border-border/50 pb-3 last:border-0">
              <div>
                <div className="text-sm font-medium">Activity item {i + 1}</div>
                <div className="text-xs text-muted-foreground">2 hours ago</div>
              </div>
              <Badge size="sm" variant="surface" color={i % 3 === 0 ? 'success' : i % 3 === 1 ? 'warning' : 'slate'}>
                {i % 3 === 0 ? 'Completed' : i % 3 === 1 ? 'Pending' : 'In Progress'}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

// ─── Meta ────────────────────────────────────────────────────────────

const meta: Meta = {
  title: 'Layouts/AppShell',
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta

// ─── Default ─────────────────────────────────────────────────────────

export const Default: StoryObj = {
  render: () => (
    <CommandSearchProvider items={searchItems}>
      <AppShell.Root>
        <AppShell.Body>
          <AppShell.Sidebar>
            <DemoSidebarContent />
          </AppShell.Sidebar>

          <AppShell.Main>
            <AppShell.Header>
              <AppShell.HeaderInner>
                <AppShell.HeaderStart>
                  <AppShell.SidebarTrigger />
                  <h1 className="text-lg font-semibold">Dashboard</h1>
                </AppShell.HeaderStart>
                <AppShell.HeaderEnd>
                  <AppShell.Search />
                </AppShell.HeaderEnd>
              </AppShell.HeaderInner>
            </AppShell.Header>

            <AppShell.Content>
              <DemoContent />
            </AppShell.Content>
          </AppShell.Main>

          <AppShell.Secondary side="right">
            <DemoSecondaryContent />
          </AppShell.Secondary>
        </AppShell.Body>
      </AppShell.Root>
    </CommandSearchProvider>
  ),
}

// ─── Without Secondary ───────────────────────────────────────────────

export const WithoutSecondary: StoryObj = {
  render: () => (
    <CommandSearchProvider items={searchItems}>
      <AppShell.Root>
        <AppShell.Body className="grid-cols-[auto_minmax(0,1fr)]">
          <AppShell.Sidebar>
            <DemoSidebarContent />
          </AppShell.Sidebar>

          <AppShell.Main>
            <AppShell.Header>
              <AppShell.HeaderInner>
                <AppShell.HeaderStart>
                  <AppShell.SidebarTrigger />
                  <h1 className="text-lg font-semibold">Dashboard</h1>
                </AppShell.HeaderStart>
                <AppShell.HeaderEnd>
                  <AppShell.Search />
                </AppShell.HeaderEnd>
              </AppShell.HeaderInner>
            </AppShell.Header>

            <AppShell.Content>
              <p className="text-muted-foreground">This layout has no secondary panel — just sidebar and content.</p>
            </AppShell.Content>
          </AppShell.Main>
        </AppShell.Body>
      </AppShell.Root>
    </CommandSearchProvider>
  ),
}

// ─── Secondary Closed by Default ────────────────────────────────────

export const SecondaryClosed: StoryObj = {
  render: () => (
    <CommandSearchProvider items={searchItems}>
      <AppShell.Root defaultSecondaryOpen={false}>
        <AppShell.Body>
          <AppShell.Sidebar>
            <DemoSidebarContent />
          </AppShell.Sidebar>

          <AppShell.Main>
            <AppShell.Header>
              <AppShell.HeaderInner>
                <AppShell.HeaderStart>
                  <AppShell.SidebarTrigger />
                  <h1 className="text-lg font-semibold">Dashboard</h1>
                </AppShell.HeaderStart>
                <AppShell.HeaderEnd>
                  <AppShell.Search />
                </AppShell.HeaderEnd>
              </AppShell.HeaderInner>
            </AppShell.Header>

            <AppShell.Content>
              <p className="text-muted-foreground">
                The secondary panel starts closed. Click the toggle icon to open it.
              </p>
            </AppShell.Content>
          </AppShell.Main>

          <AppShell.Secondary side="right">
            <DemoSecondaryContent />
          </AppShell.Secondary>
        </AppShell.Body>
      </AppShell.Root>
    </CommandSearchProvider>
  ),
}

// ─── Overlay Mode ────────────────────────────────────────────────────

export const Overlay: StoryObj = {
  render: () => (
    <CommandSearchProvider items={searchItems}>
      <AppShell.Root overlay>
        <AppShell.Body className="grid-cols-[auto_minmax(0,1fr)_auto]">
          <AppShell.Sidebar>
            <DemoSidebarContent />
          </AppShell.Sidebar>

          <AppShell.Main>
            <AppShell.Header>
              <AppShell.HeaderInner>
                <AppShell.HeaderStart>
                  <AppShell.SidebarTrigger />
                  <h1 className="text-lg font-semibold">Dashboard</h1>
                </AppShell.HeaderStart>
                <AppShell.HeaderEnd>
                  <AppShell.Search />
                </AppShell.HeaderEnd>
              </AppShell.HeaderInner>
            </AppShell.Header>

            <AppShell.Content>
              <p className="text-muted-foreground">
                Overlay mode — sidebar and secondary are in a drawer with tabs. Click the triggers in the header to
                open.
              </p>
            </AppShell.Content>
          </AppShell.Main>

          <AppShell.Secondary side="right">
            <DemoSecondaryContent />
          </AppShell.Secondary>
        </AppShell.Body>
      </AppShell.Root>
    </CommandSearchProvider>
  ),
}

export const SecondaryAsEditor: StoryObj = {
  name: 'Secondary As Editor',
  render: () => (
    <CommandSearchProvider items={searchItems}>
      <AppShell.Root defaultSecondaryOpen secondaryLabel="Editor">
        <AppShell.Body className="grid-cols-[auto_minmax(0,1fr)_auto]">
          <AppShell.Sidebar>
            <DemoSidebarContent />
          </AppShell.Sidebar>

          <AppShell.Main>
            <AppShell.Header>
              <AppShell.HeaderInner>
                <AppShell.HeaderStart>
                  <AppShell.SidebarTrigger />
                  <h1 className="text-lg font-semibold">Layout Composer</h1>
                </AppShell.HeaderStart>
                <AppShell.HeaderEnd>
                  <AppShell.Search />
                </AppShell.HeaderEnd>
              </AppShell.HeaderInner>
            </AppShell.Header>

            <AppShell.Content>
              <div className="rounded-lg border border-border bg-card p-6">
                <h2 className="text-base font-semibold">Editing Surface</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  This story documents the secondary region as a generic page tool area rather than a filter-only panel.
                </p>
              </div>
            </AppShell.Content>
          </AppShell.Main>

          <AppShell.Secondary side="right">
            <DemoLayoutEditorContent />
          </AppShell.Secondary>
        </AppShell.Body>
      </AppShell.Root>
    </CommandSearchProvider>
  ),
}

// ─── Playground ──────────────────────────────────────────────────────

export const Playground: StoryObj<{
  overlay: boolean
  color: string
  variant: string
  collapsible: string
}> = {
  argTypes: {
    overlay: {
      control: 'boolean',
      description: 'Force overlay mode (drawer instead of inline panels).',
    },
    color: {
      control: 'select',
      options: getPropDefValues(colorPropDef.color),
      description: 'Shell color — flows to sidebar, secondary, and search.',
    },
    variant: {
      control: 'select',
      options: getPropDefValues(sidebarRootPropDefs.variant),
      description: 'Sidebar variant.',
    },
    collapsible: {
      control: 'select',
      options: getPropDefValues(sidebarRootPropDefs.collapsible),
      description: 'Sidebar collapsible mode.',
    },
  },
  args: {
    overlay: false,
    color: 'neutral',
    variant: 'surface',
    collapsible: 'offcanvas',
  },
  render: ({ overlay, color, variant, collapsible }) => (
    <CommandSearchProvider items={searchItems}>
      <AppShell.Root overlay={overlay} color={color as never}>
        <AppShell.Body className="grid-cols-[auto_minmax(0,1fr)_auto]">
          <AppShell.Sidebar variant={variant as never} collapsible={collapsible as never}>
            <DemoSidebarContent />
          </AppShell.Sidebar>

          <AppShell.Main>
            <AppShell.Header>
              <AppShell.HeaderInner>
                <AppShell.HeaderStart>
                  <AppShell.SidebarTrigger />
                  <h1 className="text-lg font-semibold">Dashboard</h1>
                </AppShell.HeaderStart>
                <AppShell.HeaderEnd>
                  <AppShell.Search />
                </AppShell.HeaderEnd>
              </AppShell.HeaderInner>
            </AppShell.Header>

            <AppShell.Content>
              <DemoContent />
            </AppShell.Content>
          </AppShell.Main>

          <AppShell.Secondary side="right">
            <DemoSecondaryContent />
          </AppShell.Secondary>
        </AppShell.Body>
      </AppShell.Root>
    </CommandSearchProvider>
  ),
}
