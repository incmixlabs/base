import type { Meta, StoryObj } from '@storybook/react-vite'
import { Copy, HelpCircle, Info, Settings, Trash2 } from 'lucide-react'
import { Button, IconButton, SimpleTooltip, Tooltip } from '@/elements'
import type {
  PopoverContentMaxWidth,
  PopoverContentSize,
  PopoverContentVariant,
} from '@/elements/popover/popover.props'
import { popoverContentPropDefs } from '@/elements/popover/popover.props'
import { Label } from '@/form'
import { Flex } from '@/layouts'
import { colorPropDef } from '@/theme/props/color.prop'
import { selectArgType } from '@/theme/props/storybook'
import type { Color } from '@/theme/tokens'
import { Text } from '@/typography'

type TooltipStoryArgs = {
  variant: PopoverContentVariant
  color: Color
  size: PopoverContentSize
  maxWidth: PopoverContentMaxWidth
  highContrast: boolean
  side: 'top' | 'right' | 'bottom' | 'left'
  align: 'start' | 'center' | 'end'
}

const meta: Meta<TooltipStoryArgs> = {
  title: 'Elements/Tooltip',
  parameters: {
    layout: 'centered',
  },
  decorators: [
    Story => (
      <Tooltip.Provider>
        <Story />
      </Tooltip.Provider>
    ),
  ],
  argTypes: {
    variant: {
      ...selectArgType(popoverContentPropDefs.variant),
      description: 'Surface visual variant',
    },
    color: {
      ...selectArgType(colorPropDef.color),
      description: 'Semantic color lane',
    },
    size: {
      ...selectArgType(popoverContentPropDefs.size),
      description: 'Content padding size',
    },
    maxWidth: {
      ...selectArgType(popoverContentPropDefs.maxWidthToken),
      description: 'Maximum width token',
    },
    highContrast: {
      control: 'boolean',
      description: 'High contrast treatment',
    },
    side: {
      control: { type: 'select' },
      options: ['top', 'right', 'bottom', 'left'],
      description: 'Placement side relative to trigger',
    },
    align: {
      control: { type: 'select' },
      options: ['start', 'center', 'end'],
      description: 'Alignment along the side',
    },
  },
  args: {
    variant: 'solid',
    color: 'inverse',
    size: 'sm',
    maxWidth: 'sm',
    highContrast: false,
    side: 'top',
    align: 'center',
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: args => (
    <Tooltip.Root>
      <Tooltip.Trigger render={<Button variant="outline" size="sm" />}>Hover me</Tooltip.Trigger>
      <Tooltip.Content
        variant={args.variant}
        color={args.color}
        size={args.size}
        maxWidth={args.maxWidth}
        highContrast={args.highContrast}
        side={args.side}
        align={args.align}
      >
        <Tooltip.Arrow />
        This is a tooltip
      </Tooltip.Content>
    </Tooltip.Root>
  ),
}

export const Simple: Story = {
  args: {
    variant: 'solid',
    color: 'inverse',
    size: 'lg',
    maxWidth: 'md',
    highContrast: false,
  },
  render: args => (
    <SimpleTooltip
      content="This is a simple tooltip"
      variant={args.variant}
      color={args.color}
      highContrast={args.highContrast}
      size={args.size}
      maxWidth={args.maxWidth}
      side={args.side}
      align={args.align}
    >
      <Button variant="outline" size="sm">
        Hover me
      </Button>
    </SimpleTooltip>
  ),
}

export const Positions: Story = {
  render: () => (
    <Flex gap="4">
      {(['top', 'right', 'bottom', 'left'] as const).map(side => (
        <Tooltip.Root key={side}>
          <Tooltip.Trigger render={<Button variant="outline" className="capitalize" />}>{side}</Tooltip.Trigger>
          <Tooltip.Content side={side}>
            <Tooltip.Arrow />
            Tooltip on {side}
          </Tooltip.Content>
        </Tooltip.Root>
      ))}
    </Flex>
  ),
}

export const Variants: Story = {
  render: () => (
    <Flex gap="4">
      {(['solid', 'soft', 'surface', 'outline'] as const).map(variant => (
        <Tooltip.Root key={variant}>
          <Tooltip.Trigger render={<Button variant="outline" className="capitalize" />}>{variant}</Tooltip.Trigger>
          <Tooltip.Content variant={variant} color={variant === 'solid' ? 'inverse' : 'slate'}>
            <Tooltip.Arrow />
            {variant} tooltip
          </Tooltip.Content>
        </Tooltip.Root>
      ))}
    </Flex>
  ),
}

export const Colors: Story = {
  render: () => (
    <Flex wrap="wrap" gap="4">
      {(['slate', 'primary', 'info', 'success', 'warning', 'error', 'inverse'] as const).map(color => (
        <Tooltip.Root key={color}>
          <Tooltip.Trigger render={<Button variant="outline" className="capitalize" />}>{color}</Tooltip.Trigger>
          <Tooltip.Content variant="solid" color={color}>
            <Tooltip.Arrow />
            {color} tooltip
          </Tooltip.Content>
        </Tooltip.Root>
      ))}
    </Flex>
  ),
}

export const Sizes: Story = {
  render: () => (
    <Flex gap="4">
      {(['xs', 'sm', 'md', 'lg'] as const).map(size => (
        <Tooltip.Root key={size}>
          <Tooltip.Trigger render={<Button variant="outline" />}>{size.toUpperCase()}</Tooltip.Trigger>
          <Tooltip.Content size={size}>
            <Tooltip.Arrow />
            Size {size}
          </Tooltip.Content>
        </Tooltip.Root>
      ))}
    </Flex>
  ),
}

export const MaxWidths: Story = {
  render: () => (
    <Flex gap="4">
      {(['xs', 'sm', 'md', 'lg'] as const).map(maxWidth => (
        <Tooltip.Root key={maxWidth}>
          <Tooltip.Trigger render={<Button variant="outline" />}>{maxWidth.toUpperCase()}</Tooltip.Trigger>
          <Tooltip.Content maxWidth={maxWidth}>
            <Tooltip.Arrow />
            This is a longer tooltip text that demonstrates the different max-width options available for wrapping.
          </Tooltip.Content>
        </Tooltip.Root>
      ))}
    </Flex>
  ),
}

export const IconButtonsToolbar: Story = {
  render: () => (
    <Flex align="center" gap="1" className="p-2 border rounded-lg bg-muted/30">
      <SimpleTooltip content="Copy">
        <IconButton variant="ghost" size="md" aria-label="Copy">
          <Copy className="h-4 w-4" />
        </IconButton>
      </SimpleTooltip>
      <SimpleTooltip content="Delete">
        <IconButton variant="ghost" size="md" aria-label="Delete">
          <Trash2 className="h-4 w-4" />
        </IconButton>
      </SimpleTooltip>
      <SimpleTooltip content="Settings">
        <IconButton variant="ghost" size="md" aria-label="Settings">
          <Settings className="h-4 w-4" />
        </IconButton>
      </SimpleTooltip>
    </Flex>
  ),
}

export const RichContent: Story = {
  render: () => (
    <Tooltip.Root>
      <Tooltip.Trigger render={<Button variant="outline" />}>Keyboard shortcut</Tooltip.Trigger>
      <Tooltip.Content maxWidth="md" size="md">
        <Tooltip.Arrow />
        <Flex direction="column" gap="1">
          <Text size="sm" weight="medium">
            Keyboard Shortcut
          </Text>
          <Text size="xs" className="opacity-70">
            Press <kbd className="px-1 py-0.5 bg-white/20 rounded text-[10px]">Ctrl</kbd> +{' '}
            <kbd className="px-1 py-0.5 bg-white/20 rounded text-[10px]">S</kbd> to save
          </Text>
        </Flex>
      </Tooltip.Content>
    </Tooltip.Root>
  ),
}

export const SurfaceTooltip: Story = {
  name: 'Surface (Card-like)',
  render: () => (
    <Tooltip.Root>
      <Tooltip.Trigger render={<Button variant="outline" />}>Hover for details</Tooltip.Trigger>
      <Tooltip.Content variant="surface" color="slate" size="md" maxWidth="md">
        <Tooltip.Arrow />
        <Flex direction="column" gap="2">
          <Text size="sm" weight="medium">
            Project Status
          </Text>
          <Text size="xs" color="neutral">
            Last updated 2 hours ago. 3 tasks remaining before the deadline.
          </Text>
        </Flex>
      </Tooltip.Content>
    </Tooltip.Root>
  ),
}

export const HoverCardTasks: Story = {
  name: 'Hover Card — Tasks (Moved)',
  render: () => (
    <Flex direction="column" gap="2" className="max-w-sm">
      <Text size="sm" weight="medium">
        This example moved to `Elements/HoverCard`.
      </Text>
      <Text size="xs" color="neutral">
        Use the `Tasks` story under HoverCard for the structured team progress example.
      </Text>
    </Flex>
  ),
}

export const FormFieldHelp: Story = {
  render: () => (
    <Flex direction="column" gap="2" className="w-72">
      <Flex align="center" gap="2">
        <Label>API Key</Label>
        <Tooltip.Root>
          <Tooltip.Trigger render={<IconButton variant="ghost" size="xs" aria-label="Help" />}>
            <HelpCircle className="h-3.5 w-3.5" />
          </Tooltip.Trigger>
          <Tooltip.Content side="right" maxWidth="md">
            <Tooltip.Arrow />
            Your API key can be found in the dashboard under Settings &gt; API Keys.
          </Tooltip.Content>
        </Tooltip.Root>
      </Flex>
      <input type="text" placeholder="Enter your API key" className="w-full px-3 py-2 text-sm border rounded-md" />
    </Flex>
  ),
}

export const WithIcons: Story = {
  render: () => (
    <Flex gap="4">
      {[
        { icon: Info, label: 'More information' },
        { icon: HelpCircle, label: 'Help' },
        { icon: Settings, label: 'Settings' },
      ].map(({ icon: Icon, label }) => (
        <Tooltip.Root key={label}>
          <Tooltip.Trigger render={<IconButton variant="ghost" size="md" aria-label={label} />}>
            <Icon className="h-4 w-4" />
          </Tooltip.Trigger>
          <Tooltip.Content>
            <Tooltip.Arrow />
            {label}
          </Tooltip.Content>
        </Tooltip.Root>
      ))}
    </Flex>
  ),
}
