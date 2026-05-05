import type { Meta, StoryObj } from '@storybook/react-vite'
import { Cloud, CreditCard, Github, Keyboard, LifeBuoy, LogOut, Plus, Settings, User, UserPlus } from 'lucide-react'
import { useState } from 'react'
import { Button, DropdownMenu } from '@/elements'
import { SemanticColor } from '@/theme/props/color.prop'
import { getPropDefValues } from '@/theme/props/prop-def'
import { dropdownMenuPropDefs } from './dropdown-menu.props'

const buttonColors = getPropDefValues(dropdownMenuPropDefs.TriggerButton.color)
const menuColors = getPropDefValues(dropdownMenuPropDefs.Content.color)
const buttonSizes = getPropDefValues(dropdownMenuPropDefs.TriggerButton.size)
const buttonVariants = getPropDefValues(dropdownMenuPropDefs.TriggerButton.variant)
const showTriggerIcons = [false, true] as const
const arrowOptions = getPropDefValues(dropdownMenuPropDefs.TriggerButton.arrow)
const menuSizes = getPropDefValues(dropdownMenuPropDefs.Content.size)
const menuVariants = getPropDefValues(dropdownMenuPropDefs.Content.variant)

type PlaygroundArgs = {
  buttonSize: (typeof buttonSizes)[number]
  buttonVariant: (typeof buttonVariants)[number]
  buttonColor: (typeof buttonColors)[number]
  showTriggerIcon: (typeof showTriggerIcons)[number]
  arrow: (typeof arrowOptions)[number]
  menuSize: (typeof menuSizes)[number]
  menuVariant: (typeof menuVariants)[number]
  menuColor: (typeof menuColors)[number]
  side: 'top' | 'right' | 'bottom' | 'left'
  align: 'start' | 'center' | 'end'
  sideOffset: number
}

const meta: Meta<typeof DropdownMenu.Content> = {
  title: 'Elements/DropdownMenu',
  parameters: {
    layout: 'centered',
  },
}

export default meta
type PlaygroundStory = StoryObj<PlaygroundArgs>

export const Playground: PlaygroundStory = {
  parameters: {
    controls: {
      include: [
        'buttonSize',
        'buttonVariant',
        'buttonColor',
        'showTriggerIcon',
        'arrow',
        'menuSize',
        'menuVariant',
        'menuColor',
        'side',
        'align',
        'sideOffset',
      ],
    },
  },
  argTypes: {
    buttonSize: {
      control: 'select',
      options: buttonSizes,
      description: 'Size of the trigger button',
      table: { category: 'Button' },
    },
    buttonVariant: {
      control: 'select',
      options: buttonVariants,
      description: 'Variant of the trigger button',
      table: { category: 'Button' },
    },
    buttonColor: {
      control: 'select',
      options: buttonColors,
      description: 'Color of the trigger button',
      table: { category: 'Button' },
    },
    showTriggerIcon: {
      control: 'boolean',
      description: 'Show chevron icon in trigger',
      table: { category: 'Button' },
    },
    arrow: {
      control: 'select',
      options: arrowOptions,
      description: 'Arrow icon style: down (chevron) or updown (up-down arrows)',
      table: { category: 'Button' },
    },
    menuSize: {
      control: 'select',
      options: menuSizes,
      description: 'Size of the menu content',
      table: { category: 'Menu' },
    },
    menuVariant: {
      control: 'select',
      options: menuVariants,
      description: 'Visual variant of the menu',
      table: { category: 'Menu' },
    },
    menuColor: {
      control: 'select',
      options: menuColors,
      description: 'Accent color applied to all menu items (individual items can override)',
      table: { category: 'Menu' },
    },
    side: {
      control: 'select',
      options: ['top', 'right', 'bottom', 'left'],
      description: 'Side of trigger to open',
      table: { category: 'Menu' },
    },
    align: {
      control: 'select',
      options: ['start', 'center', 'end'],
      description: 'Alignment relative to trigger',
      table: { category: 'Menu' },
    },
    sideOffset: {
      control: { type: 'number', min: 0, max: 24, step: 1 },
      description: 'Offset from trigger',
      table: { category: 'Menu' },
    },
  },
  args: {
    buttonSize: 'md',
    buttonVariant: 'solid',
    buttonColor: SemanticColor.slate,
    showTriggerIcon: true,
    arrow: 'down',
    menuSize: 'md',
    menuVariant: 'solid',
    menuColor: SemanticColor.slate,
    side: 'bottom',
    align: 'start',
    sideOffset: 8,
  },
  render: args => {
    const [open, setOpen] = useState(false)
    const {
      buttonSize,
      buttonVariant,
      buttonColor,
      showTriggerIcon,
      arrow,
      menuSize,
      menuVariant,
      menuColor,
      ...contentArgs
    } = args

    return (
      <DropdownMenu.Root open={open} onOpenChange={setOpen}>
        <DropdownMenu.Trigger showTriggerIcon={showTriggerIcon} arrow={arrow}>
          <Button variant={buttonVariant} color={buttonColor} size={buttonSize}>
            Open Menu
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content size={menuSize} variant={menuVariant} color={menuColor} {...contentArgs}>
          <DropdownMenu.Item>Profile</DropdownMenu.Item>
          <DropdownMenu.Item>Settings</DropdownMenu.Item>
          <DropdownMenu.Item shortcut="⌘K">Shortcuts</DropdownMenu.Item>
          <DropdownMenu.Separator />
          <DropdownMenu.Item color="success">Save Draft</DropdownMenu.Item>
          <DropdownMenu.Item color="error">Delete</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    )
  },
}

export const Default: StoryObj = {
  render: () => (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button variant="outline">Open Menu</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item>Profile</DropdownMenu.Item>
        <DropdownMenu.Item>Settings</DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item>Logout</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  ),
}

export const WithShortcuts: StoryObj = {
  render: () => (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button variant="outline">File</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item shortcut="Cmd+N">New File</DropdownMenu.Item>
        <DropdownMenu.Item shortcut="Cmd+O">Open</DropdownMenu.Item>
        <DropdownMenu.Item shortcut="Cmd+S">Save</DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item shortcut="Cmd+P">Print</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  ),
}

export const WithCheckboxItems: StoryObj = {
  render: () => {
    const [showStatus, setShowStatus] = useState(true)
    const [showActivity, setShowActivity] = useState(false)
    const [showPanel, setShowPanel] = useState(false)

    return (
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <Button variant="outline">View</Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Label>Toggle View</DropdownMenu.Label>
          <DropdownMenu.Separator />
          <DropdownMenu.CheckboxItem checked={showStatus} onCheckedChange={setShowStatus}>
            Status Bar
          </DropdownMenu.CheckboxItem>
          <DropdownMenu.CheckboxItem checked={showActivity} onCheckedChange={setShowActivity}>
            Activity Panel
          </DropdownMenu.CheckboxItem>
          <DropdownMenu.CheckboxItem checked={showPanel} onCheckedChange={setShowPanel}>
            Side Panel
          </DropdownMenu.CheckboxItem>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    )
  },
}

export const WithRadioItems: StoryObj = {
  render: () => {
    const [theme, setTheme] = useState('system')

    return (
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <Button variant="outline">Theme</Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Label>Appearance</DropdownMenu.Label>
          <DropdownMenu.Separator />
          <DropdownMenu.RadioGroup value={theme} onValueChange={setTheme}>
            <DropdownMenu.RadioItem value="light">Light</DropdownMenu.RadioItem>
            <DropdownMenu.RadioItem value="dark">Dark</DropdownMenu.RadioItem>
            <DropdownMenu.RadioItem value="system">System</DropdownMenu.RadioItem>
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    )
  },
}

export const WithSubmenu: StoryObj = {
  render: () => (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button variant="outline">Options</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item>New Tab</DropdownMenu.Item>
        <DropdownMenu.Item>New Window</DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Sub>
          <DropdownMenu.SubTrigger>Share</DropdownMenu.SubTrigger>
          <DropdownMenu.SubContent>
            <DropdownMenu.Item>Email</DropdownMenu.Item>
            <DropdownMenu.Item>Message</DropdownMenu.Item>
            <DropdownMenu.Separator />
            <DropdownMenu.Item>Copy Link</DropdownMenu.Item>
          </DropdownMenu.SubContent>
        </DropdownMenu.Sub>
        <DropdownMenu.Separator />
        <DropdownMenu.Item>Settings</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  ),
}

export const UserMenu: StoryObj = {
  render: () => (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button variant="ghost" className="h-10 w-10 rounded-full p-0">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-4 w-4" />
          </div>
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end">
        <DropdownMenu.Label>
          <div>
            <p className="font-medium">John Doe</p>
            <p className="text-xs text-muted-foreground">john@example.com</p>
          </div>
        </DropdownMenu.Label>
        <DropdownMenu.Separator />
        <DropdownMenu.Group>
          <DropdownMenu.Item>
            <User className="mr-2 h-4 w-4" />
            Profile
          </DropdownMenu.Item>
          <DropdownMenu.Item>
            <CreditCard className="mr-2 h-4 w-4" />
            Billing
          </DropdownMenu.Item>
          <DropdownMenu.Item>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </DropdownMenu.Item>
          <DropdownMenu.Item>
            <Keyboard className="mr-2 h-4 w-4" />
            Shortcuts
          </DropdownMenu.Item>
        </DropdownMenu.Group>
        <DropdownMenu.Separator />
        <DropdownMenu.Group>
          <DropdownMenu.Item>
            <UserPlus className="mr-2 h-4 w-4" />
            Invite Team
          </DropdownMenu.Item>
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>
              <Plus className="mr-2 h-4 w-4" />
              New
            </DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent>
              <DropdownMenu.Item>Project</DropdownMenu.Item>
              <DropdownMenu.Item>Team</DropdownMenu.Item>
              <DropdownMenu.Item>Organization</DropdownMenu.Item>
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>
        </DropdownMenu.Group>
        <DropdownMenu.Separator />
        <DropdownMenu.Item>
          <Github className="mr-2 h-4 w-4" />
          GitHub
        </DropdownMenu.Item>
        <DropdownMenu.Item>
          <LifeBuoy className="mr-2 h-4 w-4" />
          Support
        </DropdownMenu.Item>
        <DropdownMenu.Item>
          <Cloud className="mr-2 h-4 w-4" />
          API
        </DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item color="error">
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  ),
}

export const Sizes: StoryObj = {
  render: () => {
    const [openSize, setOpenSize] = useState<(typeof menuSizes)[number] | null>(null)

    return (
      <div className="grid grid-cols-2 gap-5 min-w-[520px]">
        {menuSizes.map(size => (
          <div key={size} className="rounded-md border border-dashed border-muted-foreground/30 p-4 text-center">
            <div className="mb-3 text-xs text-muted-foreground">Menu size {size}</div>
            <DropdownMenu.Root open={openSize === size} onOpenChange={open => setOpenSize(open ? size : null)}>
              <DropdownMenu.Trigger>
                <Button variant="outline" className="min-w-20">
                  {size}
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content size={size} sideOffset={8}>
                <DropdownMenu.Item>Profile</DropdownMenu.Item>
                <DropdownMenu.Item>Settings</DropdownMenu.Item>
                <DropdownMenu.Separator />
                <DropdownMenu.Item>Logout</DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </div>
        ))}
      </div>
    )
  },
}

export const Variants: StoryObj = {
  render: () => (
    <div className="flex gap-4">
      {(['solid', 'soft'] as const).map(variant => (
        <DropdownMenu.Root key={variant}>
          <DropdownMenu.Trigger>
            <Button variant="outline" className="capitalize">
              {variant}
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content variant={variant}>
            <DropdownMenu.Item>Profile</DropdownMenu.Item>
            <DropdownMenu.Item>Settings</DropdownMenu.Item>
            <DropdownMenu.Separator />
            <DropdownMenu.Item>Logout</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      ))}
    </div>
  ),
}

export const DisabledItems: StoryObj = {
  render: () => (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button variant="outline">Actions</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item>Edit</DropdownMenu.Item>
        <DropdownMenu.Item>Duplicate</DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item disabled>Archive (Unavailable)</DropdownMenu.Item>
        <DropdownMenu.Item color="error">Delete</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  ),
}

export const Animated: StoryObj = {
  render: () => (
    <DropdownMenu.Root defaultOpen>
      <DropdownMenu.Trigger>
        <Button variant="outline">Animated Menu</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content animated sideOffset={8}>
        <DropdownMenu.Label>My Account</DropdownMenu.Label>
        <DropdownMenu.Separator />
        <DropdownMenu.Item>
          <User className="mr-2 h-4 w-4" />
          Profile
        </DropdownMenu.Item>
        <DropdownMenu.Item>
          <CreditCard className="mr-2 h-4 w-4" />
          Billing
        </DropdownMenu.Item>
        <DropdownMenu.Item>
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenu.Item>
        <DropdownMenu.Item shortcut="⌘K">
          <Keyboard className="mr-2 h-4 w-4" />
          Shortcuts
        </DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item>
          <LifeBuoy className="mr-2 h-4 w-4" />
          Support
        </DropdownMenu.Item>
        <DropdownMenu.Item color="error">
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  ),
}

export const AnimatedSoft: StoryObj = {
  render: () => (
    <DropdownMenu.Root defaultOpen>
      <DropdownMenu.Trigger>
        <Button variant="outline">Soft Animated</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content animated variant="soft" sideOffset={8}>
        <DropdownMenu.Item>
          <User className="mr-2 h-4 w-4" />
          Profile
        </DropdownMenu.Item>
        <DropdownMenu.Item>
          <CreditCard className="mr-2 h-4 w-4" />
          Billing
        </DropdownMenu.Item>
        <DropdownMenu.Item>
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item color="error">
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  ),
}
