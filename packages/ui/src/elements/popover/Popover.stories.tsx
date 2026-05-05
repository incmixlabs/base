import type { Meta, StoryObj } from '@storybook/react-vite'
import { Bell, Settings } from 'lucide-react'
import { useState } from 'react'
import { Button, IconButton, Popover } from '@/elements'
import { Label, Switch, TextField } from '@/form'
import { Flex } from '@/layouts'
import { Grid } from '@/layouts/grid/Grid'
import { selectArgType } from '@/theme/props/storybook'
import type { Color } from '@/theme/tokens'
import { Text } from '@/typography'

import type { PopoverContentMaxWidth, PopoverContentSize, PopoverContentVariant } from './popover.props'
import { popoverContentPropDefs, popoverContentVariants } from './popover.props'

type PopoverStoryArgs = {
  variant: PopoverContentVariant
  color: Color
  size: PopoverContentSize
  maxWidth: PopoverContentMaxWidth
  highContrast: boolean
  side: 'top' | 'right' | 'bottom' | 'left'
  align: 'start' | 'center' | 'end'
}

const meta: Meta<PopoverStoryArgs> = {
  title: 'Elements/Popover',
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      ...selectArgType(popoverContentPropDefs.variant),
      description: 'Surface visual variant',
    },
    color: {
      ...selectArgType(popoverContentPropDefs.color),
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
    variant: 'surface',
    color: 'slate',
    size: 'sm',
    maxWidth: 'sm',
    highContrast: false,
    side: 'bottom',
    align: 'center',
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: args => (
    <Popover.Root>
      <Popover.Trigger render={<Button variant="outline" />}>Open Popover</Popover.Trigger>
      <Popover.Content
        variant={args.variant}
        color={args.color}
        size={args.size}
        maxWidth={args.maxWidth}
        highContrast={args.highContrast}
        side={args.side}
        align={args.align}
      >
        <Popover.Arrow />
        <Popover.Close />
        <Flex direction="column" gap="2">
          <Text size="sm" weight="medium">
            Popover Title
          </Text>
          <Text size="xs" color="neutral">
            This is the popover content. You can put any content here.
          </Text>
        </Flex>
      </Popover.Content>
    </Popover.Root>
  ),
}

export const Positions: Story = {
  render: () => (
    <Flex gap="4">
      {(['top', 'right', 'bottom', 'left'] as const).map(side => (
        <Popover.Root key={side}>
          <Popover.Trigger render={<Button variant="outline" className="capitalize" />}>{side}</Popover.Trigger>
          <Popover.Content side={side}>
            <Popover.Arrow />
            <Text size="sm">Popover on {side}</Text>
          </Popover.Content>
        </Popover.Root>
      ))}
    </Flex>
  ),
}

export const Alignments: Story = {
  render: () => (
    <Flex gap="4">
      {(['start', 'center', 'end'] as const).map(align => (
        <Popover.Root key={align}>
          <Popover.Trigger render={<Button variant="outline" className="capitalize" />}>{align}</Popover.Trigger>
          <Popover.Content align={align}>
            <Popover.Arrow />
            <Text size="sm">Aligned to {align}</Text>
          </Popover.Content>
        </Popover.Root>
      ))}
    </Flex>
  ),
}

export const Sizes: Story = {
  render: () => (
    <Flex gap="4">
      {(['xs', 'sm', 'md', 'lg'] as const).map(size => (
        <Popover.Root key={size}>
          <Popover.Trigger render={<Button variant="outline" />}>{size.toUpperCase()}</Popover.Trigger>
          <Popover.Content maxWidth={size}>
            <Popover.Arrow />
            <Text size="sm">
              This popover has max-width set to {size}. Lorem ipsum dolor sit amet, consectetur adipiscing.
            </Text>
          </Popover.Content>
        </Popover.Root>
      ))}
    </Flex>
  ),
}

export const Variants: Story = {
  render: () => (
    <Flex gap="4">
      {popoverContentVariants.map(variant => (
        <Popover.Root key={variant}>
          <Popover.Trigger render={<Button variant="outline" className="capitalize" />}>{variant}</Popover.Trigger>
          <Popover.Content variant={variant}>
            <Popover.Arrow />
            <Text size="sm" className="capitalize">
              {variant} Popover
            </Text>
          </Popover.Content>
        </Popover.Root>
      ))}
    </Flex>
  ),
}

export const Colors: Story = {
  render: () => (
    <Flex wrap="wrap" gap="4">
      {(['slate', 'primary', 'info', 'success', 'warning', 'error'] as const).map(color => (
        <Popover.Root key={color}>
          <Popover.Trigger render={<Button variant="outline" className="capitalize" />}>{color}</Popover.Trigger>
          <Popover.Content color={color} variant="surface">
            <Popover.Arrow />
            <Text size="sm" className="capitalize">
              {color} surface popover
            </Text>
          </Popover.Content>
        </Popover.Root>
      ))}
    </Flex>
  ),
}

export const WithForm: Story = {
  render: () => (
    <Popover.Root>
      <Popover.Trigger render={<Button />}>Edit Dimensions</Popover.Trigger>
      <Popover.Content maxWidth="xs">
        <Popover.Arrow />
        <Flex direction="column" gap="4">
          <Text size="xs" weight="medium">
            Dimensions
          </Text>
          <Grid columns="2" gap="4">
            <Flex direction="column" gap="2">
              <Label size="xs" htmlFor="width-input">
                Width
              </Label>
              <TextField size="xs" id="width-input" placeholder="100%" />
            </Flex>
            <Flex direction="column" gap="2">
              <Label size="xs" htmlFor="height-input">
                Height
              </Label>
              <TextField size="xs" id="height-input" placeholder="auto" />
            </Flex>
          </Grid>
          <Flex justify="end">
            <Button size="xs" color="primary">
              Apply
            </Button>
          </Flex>
        </Flex>
      </Popover.Content>
    </Popover.Root>
  ),
}

export const NotificationSettings: Story = {
  render: () => {
    const [settings, setSettings] = useState({
      email: true,
      push: false,
      sms: false,
    })

    return (
      <Popover.Root>
        <Popover.Trigger render={<IconButton variant="ghost" size="md" aria-label="Notifications" />}>
          <Bell className="h-5 w-5" />
        </Popover.Trigger>
        <Popover.Content align="end" maxWidth="xs">
          <Popover.Arrow />
          <Flex direction="column" gap="3">
            <Text size="sm" weight="medium">
              Notifications
            </Text>
            {Object.entries(settings).map(([key, value]) => (
              <Flex key={key} align="center" justify="between">
                <Label htmlFor={`notification-${key}`} className="capitalize">
                  {key}
                </Label>
                <Switch
                  id={`notification-${key}`}
                  size="sm"
                  checked={value}
                  onCheckedChange={checked => setSettings(s => ({ ...s, [key]: checked }))}
                />
              </Flex>
            ))}
          </Flex>
        </Popover.Content>
      </Popover.Root>
    )
  },
}

export const SettingsPopover: Story = {
  render: () => (
    <Popover.Root>
      <Popover.Trigger render={<IconButton variant="ghost" size="md" aria-label="Settings" />}>
        <Settings className="h-5 w-5" />
      </Popover.Trigger>
      <Popover.Content align="end" maxWidth="xs">
        <Popover.Arrow />
        <Popover.Close />
        <Flex direction="column" gap="2">
          <Text size="sm" weight="medium">
            Quick Settings
          </Text>
          <Flex direction="column" gap="1">
            <Button variant="ghost" size="sm" className="justify-start">
              Account
            </Button>
            <Button variant="ghost" size="sm" className="justify-start">
              Preferences
            </Button>
            <Button variant="ghost" size="sm" className="justify-start">
              Help & Support
            </Button>
            <hr className="my-1 border-border" />
            <Button variant="ghost" size="sm" color="error" className="justify-start">
              Sign Out
            </Button>
          </Flex>
        </Flex>
      </Popover.Content>
    </Popover.Root>
  ),
}
