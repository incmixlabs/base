import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Button, Tabs } from '@/elements'
import { Label, Switch, TextField } from '@/form'
import { SemanticColor, semanticColorKeys } from '@/theme/props/color.prop'
import { getPropDefValues } from '@/theme/props/prop-def'
import { tabsPropDefs } from './tabs.props'

const meta = {
  title: 'Elements/Tabs',
  component: Tabs.Root,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Tabs.Root>

export default meta

type Story = StoryObj<typeof Tabs.Root>

export const Playground: Story = {
  argTypes: {
    size: {
      control: { type: 'select' },
      options: getPropDefValues(tabsPropDefs.Root.size),
    },
    variant: {
      control: { type: 'select' },
      options: getPropDefValues(tabsPropDefs.Root.variant),
    },
    color: {
      control: { type: 'select' },
      options: semanticColorKeys,
    },
    highContrast: {
      control: { type: 'boolean' },
    },
    hover: {
      control: { type: 'boolean' },
    },
  },
  args: {
    size: 'md',
    variant: 'line',
    color: SemanticColor.slate,
    highContrast: false,
    hover: true,
  },
  render: args => (
    <Tabs.Root
      size={args.size}
      variant={args.variant}
      color={args.color}
      highContrast={args.highContrast}
      hover={args.hover}
      defaultValue="tab1"
      className="w-[400px]"
    >
      <Tabs.List>
        <Tabs.Trigger value="tab1">Overview</Tabs.Trigger>
        <Tabs.Trigger value="tab2">Analytics</Tabs.Trigger>
        <Tabs.Trigger value="tab3">Reports</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="tab1">Overview content</Tabs.Content>
      <Tabs.Content value="tab2">Analytics content</Tabs.Content>
      <Tabs.Content value="tab3">Reports content</Tabs.Content>
    </Tabs.Root>
  ),
}

export const Default: Story = {
  render: () => (
    <Tabs.Root defaultValue="account" className="w-[400px]">
      <Tabs.List>
        <Tabs.Trigger value="account">Account</Tabs.Trigger>
        <Tabs.Trigger value="password">Password</Tabs.Trigger>
        <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="account">
        <div className="space-y-4">
          <h3 className="font-medium">Account Settings</h3>
          <p className="text-sm text-muted-foreground">Manage your account settings and preferences.</p>
        </div>
      </Tabs.Content>
      <Tabs.Content value="password">
        <div className="space-y-4">
          <h3 className="font-medium">Password</h3>
          <p className="text-sm text-muted-foreground">Change your password here.</p>
        </div>
      </Tabs.Content>
      <Tabs.Content value="settings">
        <div className="space-y-4">
          <h3 className="font-medium">Settings</h3>
          <p className="text-sm text-muted-foreground">Configure your application settings.</p>
        </div>
      </Tabs.Content>
    </Tabs.Root>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      {tabsPropDefs.Root.size.values.map(size => (
        <div key={size}>
          <p className="text-sm text-muted-foreground mb-2">Size {size}</p>
          <Tabs.Root size={size} defaultValue="tab1" className="w-[400px]">
            <Tabs.List>
              <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
              <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
              <Tabs.Trigger value="tab3">Tab 3</Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="tab1">Content for Tab 1</Tabs.Content>
            <Tabs.Content value="tab2">Content for Tab 2</Tabs.Content>
            <Tabs.Content value="tab3">Content for Tab 3</Tabs.Content>
          </Tabs.Root>
        </div>
      ))}
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-sm text-muted-foreground mb-2">Line (underline style - default)</p>
        <Tabs.Root variant="line" defaultValue="tab1" className="w-[400px]">
          <Tabs.List>
            <Tabs.Trigger value="tab1">Overview</Tabs.Trigger>
            <Tabs.Trigger value="tab2">Analytics</Tabs.Trigger>
            <Tabs.Trigger value="tab3">Reports</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tab1">Overview content</Tabs.Content>
          <Tabs.Content value="tab2">Analytics content</Tabs.Content>
          <Tabs.Content value="tab3">Reports content</Tabs.Content>
        </Tabs.Root>
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Surface (segmented control style)</p>
        <Tabs.Root variant="surface" defaultValue="tab1" className="w-[400px]">
          <Tabs.List>
            <Tabs.Trigger value="tab1">Overview</Tabs.Trigger>
            <Tabs.Trigger value="tab2">Analytics</Tabs.Trigger>
            <Tabs.Trigger value="tab3">Reports</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tab1">Overview content</Tabs.Content>
          <Tabs.Content value="tab2">Analytics content</Tabs.Content>
          <Tabs.Content value="tab3">Reports content</Tabs.Content>
        </Tabs.Root>
      </div>
    </div>
  ),
}

export const Colors: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <p className="text-sm font-medium">Line variant with colors:</p>
      {semanticColorKeys.map(color => (
        <div key={color}>
          <p className="text-sm text-muted-foreground mb-2 capitalize">{color}</p>
          <Tabs.Root variant="line" color={color} defaultValue="tab1" className="w-[400px]">
            <Tabs.List>
              <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
              <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
              <Tabs.Trigger value="tab3">Tab 3</Tabs.Trigger>
            </Tabs.List>
          </Tabs.Root>
        </div>
      ))}
    </div>
  ),
}

export const ColorsWithSurface: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <p className="text-sm font-medium">Surface variant with colors:</p>
      {semanticColorKeys.map(color => (
        <div key={color}>
          <p className="text-sm text-muted-foreground mb-2 capitalize">{color}</p>
          <Tabs.Root variant="surface" color={color} defaultValue="tab1" className="w-[400px]">
            <Tabs.List>
              <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
              <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
              <Tabs.Trigger value="tab3">Tab 3</Tabs.Trigger>
            </Tabs.List>
          </Tabs.Root>
        </div>
      ))}
    </div>
  ),
}

export const HighContrast: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-sm text-muted-foreground mb-2">Normal contrast</p>
        <Tabs.Root variant="line" color="primary" defaultValue="tab1" className="w-[400px]">
          <Tabs.List>
            <Tabs.Trigger value="tab1">Overview</Tabs.Trigger>
            <Tabs.Trigger value="tab2">Analytics</Tabs.Trigger>
            <Tabs.Trigger value="tab3">Reports</Tabs.Trigger>
          </Tabs.List>
        </Tabs.Root>
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">High contrast</p>
        <Tabs.Root variant="line" color="primary" highContrast defaultValue="tab1" className="w-[400px]">
          <Tabs.List>
            <Tabs.Trigger value="tab1">Overview</Tabs.Trigger>
            <Tabs.Trigger value="tab2">Analytics</Tabs.Trigger>
            <Tabs.Trigger value="tab3">Reports</Tabs.Trigger>
          </Tabs.List>
        </Tabs.Root>
      </div>
    </div>
  ),
}

export const Justify: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      {(['start', 'center', 'end'] as const).map(justify => (
        <div key={justify}>
          <p className="text-sm text-muted-foreground mb-2 capitalize">justify="{justify}"</p>
          <Tabs.Root variant="line" defaultValue="tab1" className="w-[400px]">
            <Tabs.List justify={justify} className="w-full">
              <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
              <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
            </Tabs.List>
          </Tabs.Root>
        </div>
      ))}
    </div>
  ),
}

export const Animated: Story = {
  render: () => (
    <Tabs.Root animated defaultValue="account" className="w-[400px]">
      <Tabs.List>
        <Tabs.Trigger value="account">Account</Tabs.Trigger>
        <Tabs.Trigger value="password">Password</Tabs.Trigger>
        <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="account">
        <div className="space-y-4">
          <h3 className="font-medium">Account Settings</h3>
          <p className="text-sm text-muted-foreground">Manage your account settings and preferences.</p>
        </div>
      </Tabs.Content>
      <Tabs.Content value="password">
        <div className="space-y-4">
          <h3 className="font-medium">Password</h3>
          <p className="text-sm text-muted-foreground">Change your password here.</p>
        </div>
      </Tabs.Content>
      <Tabs.Content value="settings">
        <div className="space-y-4">
          <h3 className="font-medium">Settings</h3>
          <p className="text-sm text-muted-foreground">Configure your application settings.</p>
        </div>
      </Tabs.Content>
    </Tabs.Root>
  ),
}

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState('overview')

    return (
      <div className="w-[400px]">
        <Tabs.Root value={value} onValueChange={setValue}>
          <Tabs.List>
            <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
            <Tabs.Trigger value="analytics">Analytics</Tabs.Trigger>
            <Tabs.Trigger value="reports">Reports</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="overview">
            <p>Overview content here.</p>
          </Tabs.Content>
          <Tabs.Content value="analytics">
            <p>Analytics content here.</p>
          </Tabs.Content>
          <Tabs.Content value="reports">
            <p>Reports content here.</p>
          </Tabs.Content>
        </Tabs.Root>
        <p className="mt-4 text-sm text-muted-foreground">
          Current tab: <span className="font-medium">{value}</span>
        </p>
      </div>
    )
  },
}

export const DisabledTab: Story = {
  render: () => (
    <Tabs.Root defaultValue="tab1" className="w-[400px]">
      <Tabs.List>
        <Tabs.Trigger value="tab1">Active</Tabs.Trigger>
        <Tabs.Trigger value="tab2" disabled>
          Disabled
        </Tabs.Trigger>
        <Tabs.Trigger value="tab3">Another</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="tab1">Active tab content</Tabs.Content>
      <Tabs.Content value="tab2">Disabled tab content</Tabs.Content>
      <Tabs.Content value="tab3">Another tab content</Tabs.Content>
    </Tabs.Root>
  ),
}

export const AccountSettings: Story = {
  render: () => (
    <div className="w-[500px] border rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
      <Tabs.Root defaultValue="profile">
        <Tabs.List>
          <Tabs.Trigger value="profile">Profile</Tabs.Trigger>
          <Tabs.Trigger value="security">Security</Tabs.Trigger>
          <Tabs.Trigger value="notifications">Notifications</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="profile">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Display Name</Label>
              <TextField placeholder="Enter your name" defaultValue="John Doe" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <TextField type="email" placeholder="Enter your email" defaultValue="john@example.com" />
            </div>
            <div className="space-y-2">
              <Label>Bio</Label>
              <TextField placeholder="Tell us about yourself" />
            </div>
            <Button>Save Changes</Button>
          </div>
        </Tabs.Content>
        <Tabs.Content value="security">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Current Password</Label>
              <TextField type="password" placeholder="Enter current password" />
            </div>
            <div className="space-y-2">
              <Label>New Password</Label>
              <TextField type="password" placeholder="Enter new password" />
            </div>
            <div className="space-y-2">
              <Label>Confirm Password</Label>
              <TextField type="password" placeholder="Confirm new password" />
            </div>
            <Button>Update Password</Button>
          </div>
        </Tabs.Content>
        <Tabs.Content value="notifications">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Configure how you receive notifications.</p>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium text-sm">Email Notifications</p>
                  <p className="text-xs text-muted-foreground">Receive updates via email</p>
                </div>
                <Switch defaultChecked aria-label="Email notifications" />
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium text-sm">Push Notifications</p>
                  <p className="text-xs text-muted-foreground">Receive push notifications</p>
                </div>
                <Switch aria-label="Push notifications" />
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium text-sm">SMS Notifications</p>
                  <p className="text-xs text-muted-foreground">Receive SMS updates</p>
                </div>
                <Switch aria-label="SMS notifications" />
              </div>
            </div>
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  ),
}
