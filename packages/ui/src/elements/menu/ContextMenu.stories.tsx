import type { Meta, StoryObj } from '@storybook/react-vite'
import { FileText, FolderOpen, Image, Music, Video } from 'lucide-react'
import * as React from 'react'
import { Box } from '@/layouts/box/Box'
import { colorPropDef, SemanticColor } from '@/theme/props/color.prop'
import { getPropDefValues } from '@/theme/props/prop-def'
import { ContextMenu } from './ContextMenu'
import { contextMenuContentPropDefs } from './context-menu.props'

const colors = getPropDefValues(colorPropDef.color)
const contentSizes = getPropDefValues(contextMenuContentPropDefs.size)
const menuVariants = getPropDefValues(contextMenuContentPropDefs.variant)

const meta: Meta<typeof ContextMenu.Content> = {
  title: 'Elements/ContextMenu',
  component: ContextMenu.Content,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>
type PlaygroundStory = StoryObj<typeof meta>

// ============================================================================
// Playground
// ============================================================================

export const Playground: PlaygroundStory = {
  argTypes: {
    size: {
      control: 'select',
      options: [...contentSizes],
      description: 'Size of the menu content',
      table: { category: 'Menu' },
    },
    variant: {
      control: 'select',
      options: [...menuVariants],
      description: 'Visual variant of the menu',
      table: { category: 'Menu' },
    },
    color: {
      control: 'select',
      options: colors,
      description: 'Accent color applied to all menu items (individual items can override)',
      table: { category: 'Menu' },
    },
  },
  args: {
    size: 'md',
    variant: 'solid',
    color: SemanticColor.slate,
  },
  render: args => {
    const { size, variant, color } = args

    return (
      <ContextMenu.Root>
        <ContextMenu.Trigger>
          <div className="flex h-40 w-80 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50">
            <span className="text-sm text-muted-foreground">Right-click here</span>
          </div>
        </ContextMenu.Trigger>
        <ContextMenu.Content size={size} variant={variant} color={color}>
          <ContextMenu.Item>Back</ContextMenu.Item>
          <ContextMenu.Item>Forward</ContextMenu.Item>
          <ContextMenu.Item shortcut="⌘R">Reload</ContextMenu.Item>
          <ContextMenu.Separator />
          <ContextMenu.Item>Save As...</ContextMenu.Item>
          <ContextMenu.Item color="success">Publish</ContextMenu.Item>
          <ContextMenu.Separator />
          <ContextMenu.Item color="error">Delete</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Root>
    )
  },
}

// ============================================================================
// Basic Examples
// ============================================================================

export const Default: Story = {
  render: () => (
    <ContextMenu.Root>
      <ContextMenu.Trigger>
        <div className="flex h-40 w-80 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50">
          <span className="text-sm text-muted-foreground">Right-click here</span>
        </div>
      </ContextMenu.Trigger>
      <ContextMenu.Content>
        <ContextMenu.Item>Back</ContextMenu.Item>
        <ContextMenu.Item>Forward</ContextMenu.Item>
        <ContextMenu.Item>Reload</ContextMenu.Item>
        <ContextMenu.Separator />
        <ContextMenu.Item>Save As...</ContextMenu.Item>
        <ContextMenu.Item>Print...</ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  ),
}

export const WithShortcuts: Story = {
  render: () => (
    <ContextMenu.Root>
      <ContextMenu.Trigger>
        <div className="flex h-40 w-80 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50">
          <span className="text-sm text-muted-foreground">Right-click here</span>
        </div>
      </ContextMenu.Trigger>
      <ContextMenu.Content>
        <ContextMenu.Item shortcut="⌘Z">Undo</ContextMenu.Item>
        <ContextMenu.Item shortcut="⌘⇧Z">Redo</ContextMenu.Item>
        <ContextMenu.Separator />
        <ContextMenu.Item shortcut="⌘X">Cut</ContextMenu.Item>
        <ContextMenu.Item shortcut="⌘C">Copy</ContextMenu.Item>
        <ContextMenu.Item shortcut="⌘V">Paste</ContextMenu.Item>
        <ContextMenu.Separator />
        <ContextMenu.Item shortcut="⌘A">Select All</ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  ),
}

// ============================================================================
// Sizes
// ============================================================================

export const AllSizes: Story = {
  render: () => (
    <Box display="flex" className="gap-6 flex-wrap">
      {contentSizes.map(size => (
        <div key={size}>
          <h3 className="text-sm font-medium mb-3">size="{size}"</h3>
          <ContextMenu.Root>
            <ContextMenu.Trigger>
              <div className="flex h-28 w-40 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50">
                <span className="text-xs text-muted-foreground">Right-click</span>
              </div>
            </ContextMenu.Trigger>
            <ContextMenu.Content size={size}>
              <ContextMenu.Item>Edit</ContextMenu.Item>
              <ContextMenu.Item>Duplicate</ContextMenu.Item>
              <ContextMenu.Separator />
              <ContextMenu.Item color="error">Delete</ContextMenu.Item>
            </ContextMenu.Content>
          </ContextMenu.Root>
        </div>
      ))}
    </Box>
  ),
}

// ============================================================================
// Variants
// ============================================================================

export const VariantSolid: Story = {
  args: {
    size: 'md',
    variant: 'solid',
    color: SemanticColor.slate,
  },
  render: args => (
    <ContextMenu.Root>
      <ContextMenu.Trigger>
        <div className="flex h-40 w-80 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50">
          <span className="text-sm text-muted-foreground">Solid variant</span>
        </div>
      </ContextMenu.Trigger>
      <ContextMenu.Content size={args.size} variant={args.variant} color={args.color}>
        <ContextMenu.Item>Option 1</ContextMenu.Item>
        <ContextMenu.Item>Option 2</ContextMenu.Item>
        <ContextMenu.Item>Option 3</ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  ),
}

export const VariantSoft: Story = {
  args: {
    size: 'md',
    variant: 'soft',
    color: SemanticColor.slate,
  },
  render: args => (
    <ContextMenu.Root>
      <ContextMenu.Trigger>
        <div className="flex h-40 w-80 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50">
          <span className="text-sm text-muted-foreground">Soft variant</span>
        </div>
      </ContextMenu.Trigger>
      <ContextMenu.Content size={args.size} variant={args.variant} color={args.color}>
        <ContextMenu.Item>Option 1</ContextMenu.Item>
        <ContextMenu.Item>Option 2</ContextMenu.Item>
        <ContextMenu.Item>Option 3</ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  ),
}

// ============================================================================
// Colors
// ============================================================================

export const ItemColors: Story = {
  render: () => (
    <ContextMenu.Root>
      <ContextMenu.Trigger>
        <div className="flex h-40 w-80 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50">
          <span className="text-sm text-muted-foreground">Items with colors</span>
        </div>
      </ContextMenu.Trigger>
      <ContextMenu.Content>
        <ContextMenu.Item>Default Color</ContextMenu.Item>
        <ContextMenu.Item color="primary">Primary Color</ContextMenu.Item>
        <ContextMenu.Item color="info">Info Color</ContextMenu.Item>
        <ContextMenu.Item color="success">Success Color</ContextMenu.Item>
        <ContextMenu.Item color="warning">Warning Color</ContextMenu.Item>
        <ContextMenu.Separator />
        <ContextMenu.Item color="error">Delete Item</ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  ),
}

// ============================================================================
// With Labels and Groups
// ============================================================================

export const WithLabelsAndGroups: Story = {
  render: () => (
    <ContextMenu.Root>
      <ContextMenu.Trigger>
        <div className="flex h-40 w-80 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50">
          <span className="text-sm text-muted-foreground">Labels and groups</span>
        </div>
      </ContextMenu.Trigger>
      <ContextMenu.Content>
        <ContextMenu.Label>Edit</ContextMenu.Label>
        <ContextMenu.Group>
          <ContextMenu.Item shortcut="⌘X">Cut</ContextMenu.Item>
          <ContextMenu.Item shortcut="⌘C">Copy</ContextMenu.Item>
          <ContextMenu.Item shortcut="⌘V">Paste</ContextMenu.Item>
        </ContextMenu.Group>
        <ContextMenu.Separator />
        <ContextMenu.Label>Share</ContextMenu.Label>
        <ContextMenu.Group>
          <ContextMenu.Item>Email Link</ContextMenu.Item>
          <ContextMenu.Item>Copy Link</ContextMenu.Item>
        </ContextMenu.Group>
      </ContextMenu.Content>
    </ContextMenu.Root>
  ),
}

// ============================================================================
// Checkbox Items
// ============================================================================

export const CheckboxItems: Story = {
  render: () => {
    const [showToolbar, setShowToolbar] = React.useState(true)
    const [showSidebar, setShowSidebar] = React.useState(false)
    const [showStatusbar, setShowStatusbar] = React.useState(true)

    return (
      <ContextMenu.Root>
        <ContextMenu.Trigger>
          <div className="flex h-40 w-80 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50">
            <span className="text-sm text-muted-foreground">Checkbox items</span>
          </div>
        </ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Label>View</ContextMenu.Label>
          <ContextMenu.CheckboxItem checked={showToolbar} onCheckedChange={setShowToolbar} shortcut="⌘T">
            Show Toolbar
          </ContextMenu.CheckboxItem>
          <ContextMenu.CheckboxItem checked={showSidebar} onCheckedChange={setShowSidebar} shortcut="⌘S">
            Show Sidebar
          </ContextMenu.CheckboxItem>
          <ContextMenu.CheckboxItem checked={showStatusbar} onCheckedChange={setShowStatusbar}>
            Show Status Bar
          </ContextMenu.CheckboxItem>
        </ContextMenu.Content>
      </ContextMenu.Root>
    )
  },
}

// ============================================================================
// Radio Items
// ============================================================================

export const RadioItems: Story = {
  render: () => {
    const [sortBy, setSortBy] = React.useState('name')

    return (
      <ContextMenu.Root>
        <ContextMenu.Trigger>
          <div className="flex h-40 w-80 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50">
            <span className="text-sm text-muted-foreground">Radio items</span>
          </div>
        </ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Label>Sort By</ContextMenu.Label>
          <ContextMenu.RadioGroup value={sortBy} onValueChange={setSortBy}>
            <ContextMenu.RadioItem value="name">Name</ContextMenu.RadioItem>
            <ContextMenu.RadioItem value="date">Date Modified</ContextMenu.RadioItem>
            <ContextMenu.RadioItem value="size">Size</ContextMenu.RadioItem>
            <ContextMenu.RadioItem value="type">Type</ContextMenu.RadioItem>
          </ContextMenu.RadioGroup>
        </ContextMenu.Content>
      </ContextMenu.Root>
    )
  },
}

// ============================================================================
// Submenus
// ============================================================================

export const WithSubmenus: Story = {
  render: () => (
    <ContextMenu.Root>
      <ContextMenu.Trigger>
        <div className="flex h-40 w-80 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50">
          <span className="text-sm text-muted-foreground">With submenus</span>
        </div>
      </ContextMenu.Trigger>
      <ContextMenu.Content>
        <ContextMenu.Item>New Tab</ContextMenu.Item>
        <ContextMenu.Item>New Window</ContextMenu.Item>
        <ContextMenu.Separator />
        <ContextMenu.Sub>
          <ContextMenu.SubTrigger>Share</ContextMenu.SubTrigger>
          <ContextMenu.SubContent>
            <ContextMenu.Item>Email</ContextMenu.Item>
            <ContextMenu.Item>Messages</ContextMenu.Item>
            <ContextMenu.Item>AirDrop</ContextMenu.Item>
            <ContextMenu.Separator />
            <ContextMenu.Item>More Options...</ContextMenu.Item>
          </ContextMenu.SubContent>
        </ContextMenu.Sub>
        <ContextMenu.Sub>
          <ContextMenu.SubTrigger>Export As</ContextMenu.SubTrigger>
          <ContextMenu.SubContent>
            <ContextMenu.Item>PDF</ContextMenu.Item>
            <ContextMenu.Item>PNG</ContextMenu.Item>
            <ContextMenu.Item>JPEG</ContextMenu.Item>
            <ContextMenu.Item>SVG</ContextMenu.Item>
          </ContextMenu.SubContent>
        </ContextMenu.Sub>
        <ContextMenu.Separator />
        <ContextMenu.Item>Print...</ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  ),
}

// ============================================================================
// Disabled States
// ============================================================================

export const DisabledItems: Story = {
  render: () => (
    <ContextMenu.Root>
      <ContextMenu.Trigger>
        <div className="flex h-40 w-80 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50">
          <span className="text-sm text-muted-foreground">Disabled items</span>
        </div>
      </ContextMenu.Trigger>
      <ContextMenu.Content>
        <ContextMenu.Item>Active Item</ContextMenu.Item>
        <ContextMenu.Item disabled>Disabled Item</ContextMenu.Item>
        <ContextMenu.Separator />
        <ContextMenu.Item shortcut="⌘C">Copy</ContextMenu.Item>
        <ContextMenu.Item shortcut="⌘V" disabled>
          Paste (Nothing to paste)
        </ContextMenu.Item>
        <ContextMenu.Separator />
        <ContextMenu.Sub>
          <ContextMenu.SubTrigger disabled>Share (Disabled)</ContextMenu.SubTrigger>
          <ContextMenu.SubContent>
            <ContextMenu.Item>Email</ContextMenu.Item>
          </ContextMenu.SubContent>
        </ContextMenu.Sub>
      </ContextMenu.Content>
    </ContextMenu.Root>
  ),
}

// ============================================================================
// Real-world Example: File Browser
// ============================================================================

export const FileBrowserContext: Story = {
  render: () => {
    const [viewType, setViewType] = React.useState('grid')
    const [showHidden, setShowHidden] = React.useState(false)

    return (
      <ContextMenu.Root>
        <ContextMenu.Trigger>
          <div className="p-4 rounded-lg border bg-card">
            <div className="grid grid-cols-4 gap-4">
              {[
                { name: 'Documents', icon: FolderOpen },
                { name: 'report.pdf', icon: FileText },
                { name: 'photo.jpg', icon: Image },
                { name: 'song.mp3', icon: Music },
                { name: 'video.mp4', icon: Video },
                { name: 'Projects', icon: FolderOpen },
              ].map(item => (
                <div
                  key={item.name}
                  className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-accent cursor-pointer"
                >
                  <item.icon className="h-10 w-10 text-muted-foreground" />
                  <span className="text-xs truncate max-w-full">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Label>View</ContextMenu.Label>
          <ContextMenu.RadioGroup value={viewType} onValueChange={setViewType}>
            <ContextMenu.RadioItem value="grid">Grid View</ContextMenu.RadioItem>
            <ContextMenu.RadioItem value="list">List View</ContextMenu.RadioItem>
            <ContextMenu.RadioItem value="columns">Column View</ContextMenu.RadioItem>
          </ContextMenu.RadioGroup>
          <ContextMenu.Separator />
          <ContextMenu.CheckboxItem checked={showHidden} onCheckedChange={setShowHidden}>
            Show Hidden Files
          </ContextMenu.CheckboxItem>
          <ContextMenu.Separator />
          <ContextMenu.Sub>
            <ContextMenu.SubTrigger>Sort By</ContextMenu.SubTrigger>
            <ContextMenu.SubContent>
              <ContextMenu.Item>Name</ContextMenu.Item>
              <ContextMenu.Item>Date Modified</ContextMenu.Item>
              <ContextMenu.Item>Size</ContextMenu.Item>
              <ContextMenu.Item>Kind</ContextMenu.Item>
            </ContextMenu.SubContent>
          </ContextMenu.Sub>
          <ContextMenu.Sub>
            <ContextMenu.SubTrigger>New</ContextMenu.SubTrigger>
            <ContextMenu.SubContent>
              <ContextMenu.Item>Folder</ContextMenu.Item>
              <ContextMenu.Item>Document</ContextMenu.Item>
              <ContextMenu.Item>Spreadsheet</ContextMenu.Item>
            </ContextMenu.SubContent>
          </ContextMenu.Sub>
          <ContextMenu.Separator />
          <ContextMenu.Item>Get Info</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Root>
    )
  },
}

// ============================================================================
// Animated
// ============================================================================

export const Animated: Story = {
  render: () => (
    <ContextMenu.Root open>
      <ContextMenu.Trigger>
        <div className="flex h-40 w-80 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50">
          <span className="text-sm text-muted-foreground">Right-click here</span>
        </div>
      </ContextMenu.Trigger>
      <ContextMenu.Content animated>
        <ContextMenu.Item shortcut="⌘Z">Undo</ContextMenu.Item>
        <ContextMenu.Item shortcut="⌘⇧Z">Redo</ContextMenu.Item>
        <ContextMenu.Separator />
        <ContextMenu.Item shortcut="⌘X">Cut</ContextMenu.Item>
        <ContextMenu.Item shortcut="⌘C">Copy</ContextMenu.Item>
        <ContextMenu.Item shortcut="⌘V">Paste</ContextMenu.Item>
        <ContextMenu.Separator />
        <ContextMenu.Item color="error">Delete</ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  ),
}

export const AnimatedSoft: Story = {
  render: () => (
    <ContextMenu.Root open>
      <ContextMenu.Trigger>
        <div className="flex h-40 w-80 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50">
          <span className="text-sm text-muted-foreground">Right-click here</span>
        </div>
      </ContextMenu.Trigger>
      <ContextMenu.Content animated variant="soft">
        <ContextMenu.Item shortcut="⌘Z">Undo</ContextMenu.Item>
        <ContextMenu.Item shortcut="⌘⇧Z">Redo</ContextMenu.Item>
        <ContextMenu.Separator />
        <ContextMenu.Item shortcut="⌘X">Cut</ContextMenu.Item>
        <ContextMenu.Item shortcut="⌘C">Copy</ContextMenu.Item>
        <ContextMenu.Item shortcut="⌘V">Paste</ContextMenu.Item>
        <ContextMenu.Separator />
        <ContextMenu.Item color="error">Delete</ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  ),
}

// ============================================================================
// Real-world Example: Text Editor
// ============================================================================

export const TextEditorContext: Story = {
  render: () => {
    const [wordWrap, setWordWrap] = React.useState(true)
    const [lineNumbers, setLineNumbers] = React.useState(true)
    const [minimap, setMinimap] = React.useState(false)

    return (
      <ContextMenu.Root>
        <ContextMenu.Trigger>
          <div className="w-96 h-48 rounded-lg border bg-card font-mono text-sm p-4 overflow-hidden">
            <div className="text-muted-foreground">
              {`function greet(name) {
  console.log("Hello, " + name);
}

greet("World");`}
            </div>
          </div>
        </ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Item shortcut="⌘X">Cut</ContextMenu.Item>
          <ContextMenu.Item shortcut="⌘C">Copy</ContextMenu.Item>
          <ContextMenu.Item shortcut="⌘V">Paste</ContextMenu.Item>
          <ContextMenu.Separator />
          <ContextMenu.Item shortcut="⌘D">Select Word</ContextMenu.Item>
          <ContextMenu.Item shortcut="⌘L">Select Line</ContextMenu.Item>
          <ContextMenu.Item shortcut="⌘A">Select All</ContextMenu.Item>
          <ContextMenu.Separator />
          <ContextMenu.Label>Editor Settings</ContextMenu.Label>
          <ContextMenu.CheckboxItem checked={wordWrap} onCheckedChange={setWordWrap}>
            Word Wrap
          </ContextMenu.CheckboxItem>
          <ContextMenu.CheckboxItem checked={lineNumbers} onCheckedChange={setLineNumbers}>
            Line Numbers
          </ContextMenu.CheckboxItem>
          <ContextMenu.CheckboxItem checked={minimap} onCheckedChange={setMinimap}>
            Minimap
          </ContextMenu.CheckboxItem>
          <ContextMenu.Separator />
          <ContextMenu.Sub>
            <ContextMenu.SubTrigger>Go to</ContextMenu.SubTrigger>
            <ContextMenu.SubContent>
              <ContextMenu.Item shortcut="⌘G">Go to Line...</ContextMenu.Item>
              <ContextMenu.Item shortcut="⌘⇧O">Go to Symbol...</ContextMenu.Item>
              <ContextMenu.Item shortcut="⌘P">Go to File...</ContextMenu.Item>
            </ContextMenu.SubContent>
          </ContextMenu.Sub>
          <ContextMenu.Sub>
            <ContextMenu.SubTrigger>Refactor</ContextMenu.SubTrigger>
            <ContextMenu.SubContent>
              <ContextMenu.Item>Rename Symbol</ContextMenu.Item>
              <ContextMenu.Item>Extract Function</ContextMenu.Item>
              <ContextMenu.Item>Extract Variable</ContextMenu.Item>
            </ContextMenu.SubContent>
          </ContextMenu.Sub>
        </ContextMenu.Content>
      </ContextMenu.Root>
    )
  },
}
