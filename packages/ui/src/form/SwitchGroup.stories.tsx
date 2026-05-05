import type { Meta, StoryObj } from '@storybook/react-vite'
import * as React from 'react'
import { Box } from '@/layouts/box/Box'
import { SemanticColor } from '@/theme/props/color.prop'
import { getPropDefValues } from '@/theme/props/prop-def'
import { selectArgType } from '@/theme/props/storybook'
import { SwitchGroup } from './SwitchGroup'
import { switchGroupRootPropDefs } from './switch-group.props'

const meta: Meta<typeof SwitchGroup.Root> = {
  title: 'Form/SwitchGroup',
  component: SwitchGroup.Root,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: selectArgType(switchGroupRootPropDefs.size),
    variant: selectArgType(switchGroupRootPropDefs.variant),
    color: selectArgType(switchGroupRootPropDefs.color),
    radius: selectArgType(switchGroupRootPropDefs.radius),
    orientation: selectArgType(switchGroupRootPropDefs.orientation),
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
    color: SemanticColor.primary,
    orientation: 'vertical',
  },
  render: args => (
    <SwitchGroup.Root
      defaultValue={['notifications']}
      size={args.size}
      variant={args.variant}
      color={args.color}
      orientation={args.orientation}
    >
      <SwitchGroup.Item name="notifications" label="Push notifications" />
      <SwitchGroup.Item name="emails" label="Email updates" />
      <SwitchGroup.Item name="sms" label="SMS alerts" />
    </SwitchGroup.Root>
  ),
}

export const WithDescriptions: Story = {
  render: () => (
    <SwitchGroup.Root defaultValue={['marketing']}>
      <SwitchGroup.Item
        name="marketing"
        label="Marketing emails"
        description="Receive emails about new products and features"
      />
      <SwitchGroup.Item
        name="security"
        label="Security alerts"
        description="Get notified about account security events"
      />
      <SwitchGroup.Item
        name="updates"
        label="Product updates"
        description="Learn about new features and improvements"
      />
    </SwitchGroup.Root>
  ),
}

// ============================================================================
// Sizes
// ============================================================================

export const AllSizes: Story = {
  render: () => (
    <Box display="flex" className="flex-col gap-8">
      {/* TODO: Consolidate remaining story size showcases around shared size token fixtures. */}
      {getPropDefValues(switchGroupRootPropDefs.size).map(size => (
        <div key={size}>
          <h3 className="text-sm font-medium mb-3">Size {size}</h3>
          <SwitchGroup.Root size={size} defaultValue={['a']}>
            <SwitchGroup.Item name="a" label="Option A" />
            <SwitchGroup.Item name="b" label="Option B" />
            <SwitchGroup.Item name="c" label="Option C" />
          </SwitchGroup.Root>
        </div>
      ))}
    </Box>
  ),
}

// ============================================================================
// Variants
// ============================================================================

export const AllVariants: Story = {
  render: () => (
    <Box display="flex" className="flex-col gap-8">
      {getPropDefValues(switchGroupRootPropDefs.variant).map(variant => (
        <div key={variant}>
          <h3 className="text-sm font-medium mb-3 capitalize">{variant}</h3>
          <SwitchGroup.Root variant={variant} defaultValue={['active']}>
            <SwitchGroup.Item name="active" label="Active switch" />
            <SwitchGroup.Item name="inactive" label="Inactive switch" />
          </SwitchGroup.Root>
        </div>
      ))}
    </Box>
  ),
}

// ============================================================================
// Colors
// ============================================================================

export const AllColors: Story = {
  render: () => (
    <Box display="flex" className="flex-col gap-6">
      {getPropDefValues(switchGroupRootPropDefs.color).map(color => (
        <div key={color} className="flex items-center gap-4">
          <span className="text-sm font-medium w-20 capitalize">{color}</span>
          <SwitchGroup.Root color={color} defaultValue={['on']} orientation="horizontal">
            <SwitchGroup.Item name="on" label="On" />
            <SwitchGroup.Item name="off" label="Off" />
          </SwitchGroup.Root>
        </div>
      ))}
    </Box>
  ),
}

// ============================================================================
// Orientation
// ============================================================================

export const Horizontal: Story = {
  render: () => (
    <SwitchGroup.Root orientation="horizontal" defaultValue={['wifi']}>
      <SwitchGroup.Item name="wifi" label="Wi-Fi" />
      <SwitchGroup.Item name="bluetooth" label="Bluetooth" />
      <SwitchGroup.Item name="airdrop" label="AirDrop" />
    </SwitchGroup.Root>
  ),
}

// ============================================================================
// Disabled States
// ============================================================================

export const Disabled: Story = {
  render: () => (
    <Box display="flex" className="flex-col gap-6">
      <div>
        <h3 className="text-sm font-medium mb-3">All Disabled</h3>
        <SwitchGroup.Root disabled defaultValue={['option1']}>
          <SwitchGroup.Item name="option1" label="Option 1" />
          <SwitchGroup.Item name="option2" label="Option 2" />
          <SwitchGroup.Item name="option3" label="Option 3" />
        </SwitchGroup.Root>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3">Single Item Disabled</h3>
        <SwitchGroup.Root defaultValue={['enabled1']}>
          <SwitchGroup.Item name="enabled1" label="Enabled" />
          <SwitchGroup.Item name="disabled" label="Disabled" disabled />
          <SwitchGroup.Item name="enabled2" label="Enabled" />
        </SwitchGroup.Root>
      </div>
    </Box>
  ),
}

// ============================================================================
// Controlled Example
// ============================================================================

export const Controlled: Story = {
  render: () => {
    const [values, setValues] = React.useState<string[]>(['darkMode'])

    return (
      <Box display="flex" className="flex-col gap-4">
        <SwitchGroup.Root value={values} onValueChange={setValues} color="primary">
          <SwitchGroup.Item name="darkMode" label="Dark mode" description="Use dark theme across the app" />
          <SwitchGroup.Item name="reducedMotion" label="Reduced motion" description="Minimize animations" />
          <SwitchGroup.Item name="highContrast" label="High contrast" description="Increase visual contrast" />
        </SwitchGroup.Root>

        <div className="p-4 bg-muted rounded-md">
          <p className="text-sm font-medium">Active settings:</p>
          <code className="text-sm">{values.length > 0 ? values.join(', ') : 'none'}</code>
        </div>
      </Box>
    )
  },
}

// ============================================================================
// Real-world Example: Notification Settings
// ============================================================================

export const NotificationSettings: Story = {
  render: () => {
    const [settings, setSettings] = React.useState<string[]>(['push', 'email'])

    return (
      <div className="w-96 p-6 border rounded-lg space-y-6">
        <div>
          <h3 className="text-lg font-semibold">Notification Preferences</h3>
          <p className="text-sm text-muted-foreground">Choose how you want to be notified.</p>
        </div>

        <SwitchGroup.Root value={settings} onValueChange={setSettings} color="success" size="sm">
          <SwitchGroup.Item name="push" label="Push notifications" description="Get real-time alerts on your device" />
          <SwitchGroup.Item name="email" label="Email notifications" description="Receive updates in your inbox" />
          <SwitchGroup.Item name="sms" label="SMS notifications" description="Get text messages for urgent alerts" />
          <SwitchGroup.Item
            name="slack"
            label="Slack notifications"
            description="Post updates to your Slack workspace"
          />
        </SwitchGroup.Root>

        <div className="pt-4 border-t">
          <p className="text-sm">
            <span className="font-medium">{settings.length}</span> notification channels enabled
          </p>
        </div>
      </div>
    )
  },
}

// ============================================================================
// Real-world Example: Privacy Settings
// ============================================================================

export const PrivacySettings: Story = {
  render: () => {
    const [privacy, setPrivacy] = React.useState<string[]>(['analytics'])

    return (
      <div className="w-96 p-6 border rounded-lg space-y-6">
        <div>
          <h3 className="text-lg font-semibold">Privacy Settings</h3>
          <p className="text-sm text-muted-foreground">Control how your data is used.</p>
        </div>

        <SwitchGroup.Root value={privacy} onValueChange={setPrivacy} color="primary" size="md">
          <SwitchGroup.Item
            name="analytics"
            label="Usage analytics"
            description="Help us improve by sharing anonymous usage data"
          />
          <SwitchGroup.Item
            name="personalization"
            label="Personalized experience"
            description="Allow us to customize content based on your activity"
          />
          <SwitchGroup.Item
            name="marketing"
            label="Marketing communications"
            description="Receive promotional offers and updates"
          />
          <SwitchGroup.Item
            name="thirdParty"
            label="Third-party sharing"
            description="Share data with trusted partners"
          />
        </SwitchGroup.Root>

        <button
          type="button"
          className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90"
        >
          Save preferences
        </button>
      </div>
    )
  },
}
