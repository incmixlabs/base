import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { getPropDefValues } from '@/theme/props/prop-def'
import { selectArgType } from '@/theme/props/storybook'
import { Switch, SwitchWithLabel } from './Switch'
import { switchPropDefs } from './switch.props'

const meta: Meta<typeof Switch> = {
  title: 'Form/Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      ...selectArgType(switchPropDefs.size),
    },
    variant: {
      ...selectArgType(switchPropDefs.variant),
    },
    color: {
      ...selectArgType(switchPropDefs.color),
    },
    radius: {
      ...selectArgType(switchPropDefs.radius),
    },
    disabled: {
      control: 'boolean',
    },
    highContrast: {
      control: 'boolean',
    },
  },
}

export default meta
type Story = StoryObj<typeof Switch>

export const Default: Story = {
  render: args => {
    const [checked, setChecked] = useState(false)
    return <Switch {...args} checked={checked} onCheckedChange={setChecked} />
  },
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      {getPropDefValues(switchPropDefs.size).map(size => (
        <Switch key={size} size={size} defaultChecked />
      ))}
    </div>
  ),
}

export const Colors: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {getPropDefValues(switchPropDefs.color).map(color => (
        <div key={color} className="flex items-center gap-2">
          <Switch color={color} defaultChecked />
          <span className="text-sm capitalize">{color}</span>
        </div>
      ))}
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {getPropDefValues(switchPropDefs.variant).map(variant => (
        <div key={variant} className="flex items-center gap-4">
          <Switch variant={variant} />
          <Switch variant={variant} defaultChecked />
          <span className="text-sm capitalize">{variant}</span>
        </div>
      ))}
    </div>
  ),
}

export const WithLabel: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <SwitchWithLabel label="Enable notifications" />
      <SwitchWithLabel label="Dark mode" defaultChecked />
      <SwitchWithLabel label="Auto-save" labelPosition="left" />
      <SwitchWithLabel label="Public profile" disabled />
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Switch disabled />
      <Switch disabled defaultChecked />
    </div>
  ),
}

export const HighContrast: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Switch defaultChecked />
        <span className="text-sm">Default</span>
      </div>
      <div className="flex items-center gap-4">
        <Switch defaultChecked highContrast />
        <span className="text-sm">High Contrast</span>
      </div>
    </div>
  ),
}

export const SettingsExample: Story = {
  render: () => {
    const [settings, setSettings] = useState({
      notifications: true,
      marketing: false,
      darkMode: false,
      autoSave: true,
    })

    return (
      <div className="w-80 space-y-4 p-4 border rounded-lg">
        <h3 className="font-semibold">Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Push Notifications</p>
              <p className="text-xs text-muted-foreground">Receive push notifications</p>
            </div>
            <Switch
              checked={settings.notifications}
              onCheckedChange={checked => setSettings(s => ({ ...s, notifications: checked }))}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Marketing Emails</p>
              <p className="text-xs text-muted-foreground">Receive marketing emails</p>
            </div>
            <Switch
              checked={settings.marketing}
              onCheckedChange={checked => setSettings(s => ({ ...s, marketing: checked }))}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Dark Mode</p>
              <p className="text-xs text-muted-foreground">Enable dark theme</p>
            </div>
            <Switch
              checked={settings.darkMode}
              onCheckedChange={checked => setSettings(s => ({ ...s, darkMode: checked }))}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Auto-save</p>
              <p className="text-xs text-muted-foreground">Automatically save changes</p>
            </div>
            <Switch
              checked={settings.autoSave}
              onCheckedChange={checked => setSettings(s => ({ ...s, autoSave: checked }))}
              color="success"
            />
          </div>
        </div>
      </div>
    )
  },
}
