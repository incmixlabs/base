import {
  AlertDialog,
  Avatar,
  Badge,
  Box,
  Button,
  Callout,
  Card,
  Progress,
  Skeleton,
  SkeletonAvatar,
  SkeletonText,
  Spinner,
  Tabs,
} from '@/elements'
import { CheckboxWithLabel, Select, SelectItem, SwitchWithLabel, TextField } from '@/form'
import type { Meta, StoryObj } from '@storybook/react-vite'
import * as React from 'react'
import { SemanticColor } from '@/theme/props/color.prop'

const meta: Meta = {
  title: 'Recipes',
  parameters: {
    layout: 'centered',
  },
}

export default meta

// ============================================================================
// Login Form
// ============================================================================

export const LoginForm: StoryObj = {
  render: () => (
    <Card.Root className="w-full max-w-md">
      <Card.Header>
        <Card.Title>Sign In</Card.Title>
        <Card.Description>Enter your credentials to continue</Card.Description>
      </Card.Header>
      <Card.Content>
        <form className="space-y-4" onSubmit={e => e.preventDefault()}>
          <TextField label="Email" type="email" placeholder="you@example.com" required />
          <TextField label="Password" type="password" placeholder="Enter password" required />
          <div className="flex items-center justify-between">
            <CheckboxWithLabel id="remember" label="Remember me" />
            <a href="#" className="text-sm text-primary hover:underline">
              Forgot password?
            </a>
          </div>
          <Button type="submit" className="w-full">
            Sign In
          </Button>
        </form>
      </Card.Content>
      <Card.Footer className="justify-center">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{' '}
          <a href="#" className="text-primary hover:underline">
            Sign up
          </a>
        </p>
      </Card.Footer>
    </Card.Root>
  ),
}

// ============================================================================
// Settings Form
// ============================================================================

export const SettingsForm: StoryObj = {
  render: () => (
    <Card.Root className="w-full max-w-lg">
      <Card.Header>
        <Card.Title>Account Settings</Card.Title>
        <Card.Description>Manage your account preferences</Card.Description>
      </Card.Header>
      <Card.Content className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-medium">Profile</h3>
          <TextField label="Display Name" defaultValue="John Doe" />
          <TextField label="Email" type="email" defaultValue="john@example.com" />
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Preferences</h3>
          <Select label="Language" defaultValue="en">
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="es">Spanish</SelectItem>
            <SelectItem value="fr">French</SelectItem>
          </Select>
          <Select label="Timezone" defaultValue="utc">
            <SelectItem value="utc">UTC</SelectItem>
            <SelectItem value="pst">Pacific Time</SelectItem>
            <SelectItem value="est">Eastern Time</SelectItem>
          </Select>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Notifications</h3>
          <div className="space-y-3">
            <SwitchWithLabel label="Email notifications" defaultChecked />
            <SwitchWithLabel label="Push notifications" />
            <SwitchWithLabel label="Marketing emails" />
          </div>
        </div>
      </Card.Content>
      <Card.Footer>
        <Button variant="outline">Cancel</Button>
        <Button>Save Changes</Button>
      </Card.Footer>
    </Card.Root>
  ),
}

// ============================================================================
// Profile Card
// ============================================================================

export const ProfileCard: StoryObj = {
  render: () => (
    <Card.Root className="w-full max-w-sm">
      <Card.Content className="pt-6">
        <div className="flex items-center gap-4">
          <Avatar size="xl" name="John Doe" />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">John Doe</h3>
              <Badge color="success" size="sm">
                Verified
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">john@example.com</p>
            <p className="text-sm text-muted-foreground">Software Engineer</p>
          </div>
        </div>
      </Card.Content>
      <Card.Footer>
        <Button variant="outline" size="md">
          Message
        </Button>
        <Button size="md">View Profile</Button>
      </Card.Footer>
    </Card.Root>
  ),
}

// ============================================================================
// Stats Dashboard
// ============================================================================

const StatCard: React.FC<{
  title: string
  value: string
  change: number
  progress: number
}> = ({ title, value, change, progress }) => {
  const isPositive = change > 0

  return (
    <Card.Root>
      <Card.Content className="pt-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <Badge color={isPositive ? SemanticColor.success : SemanticColor.error} variant="soft" size="sm">
            {isPositive ? '+' : ''}
            {change}%
          </Badge>
        </div>
        <p className="text-2xl font-bold mt-2">{value}</p>
        <Progress value={progress} className="mt-4" size="sm" />
      </Card.Content>
    </Card.Root>
  )
}

export const StatsDashboard: StoryObj = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 w-full max-w-2xl">
      <StatCard title="Total Users" value="12,345" change={12} progress={75} />
      <StatCard title="Revenue" value="$45,678" change={8} progress={60} />
      <StatCard title="Orders" value="1,234" change={-3} progress={45} />
      <StatCard title="Conversion" value="3.2%" change={5} progress={32} />
    </div>
  ),
}

// ============================================================================
// Delete Confirmation
// ============================================================================

export const DeleteConfirmation: StoryObj = {
  render: () => (
    <AlertDialog.Root>
      <AlertDialog.Trigger>
        <Button variant="outline" color="error">
          Delete Account
        </Button>
      </AlertDialog.Trigger>
      <AlertDialog.Content>
        <AlertDialog.Title>Delete Account</AlertDialog.Title>
        <AlertDialog.Description>
          Are you sure you want to delete your account? This action cannot be undone and all your data will be
          permanently removed.
        </AlertDialog.Description>
        <div className="mt-6 flex justify-end gap-3">
          <AlertDialog.Cancel asChild>
            <Button variant="outline">Cancel</Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action asChild>
            <Button color="error">Delete Account</Button>
          </AlertDialog.Action>
        </div>
      </AlertDialog.Content>
    </AlertDialog.Root>
  ),
}

// ============================================================================
// Tab Navigation
// ============================================================================

export const TabNavigation: StoryObj = {
  render: () => (
    <Box className="w-full max-w-2xl">
      <Tabs.Root defaultValue="overview">
        <Tabs.List>
          <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
          <Tabs.Trigger value="tasks">
            Tasks{' '}
            <Badge size="sm" className="ml-2">
              12
            </Badge>
          </Tabs.Trigger>
          <Tabs.Trigger value="files">Files</Tabs.Trigger>
          <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="overview" className="mt-4">
          <Card.Root>
            <Card.Content className="pt-6">Project overview content goes here...</Card.Content>
          </Card.Root>
        </Tabs.Content>

        <Tabs.Content value="tasks" className="mt-4">
          <Card.Root>
            <Card.Content className="pt-6">Task list content goes here...</Card.Content>
          </Card.Root>
        </Tabs.Content>

        <Tabs.Content value="files" className="mt-4">
          <Card.Root>
            <Card.Content className="pt-6">File browser content goes here...</Card.Content>
          </Card.Root>
        </Tabs.Content>

        <Tabs.Content value="settings" className="mt-4">
          <Card.Root>
            <Card.Content className="pt-6">Settings content goes here...</Card.Content>
          </Card.Root>
        </Tabs.Content>
      </Tabs.Root>
    </Box>
  ),
}

// ============================================================================
// Skeleton Loading
// ============================================================================

export const SkeletonLoading: StoryObj = {
  render: () => (
    <Card.Root className="w-full max-w-sm">
      <Card.Content className="pt-6">
        <div className="flex items-center gap-4">
          <SkeletonAvatar size="xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-32" />
            <SkeletonText lines={2} />
          </div>
        </div>
      </Card.Content>
      <Card.Footer>
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-24" />
      </Card.Footer>
    </Card.Root>
  ),
}

// ============================================================================
// Button Loading
// ============================================================================

export const ButtonLoading: StoryObj = {
  render: () => {
    const [loading, setLoading] = React.useState(false)

    const handleClick = () => {
      setLoading(true)
      setTimeout(() => setLoading(false), 2000)
    }

    return (
      <div className="space-x-4">
        <Button disabled={loading} onClick={handleClick}>
          {loading && <Spinner size="sm" className="mr-2" />}
          {loading ? 'Submitting...' : 'Submit'}
        </Button>
        <Button variant="outline" disabled={loading}>
          Cancel
        </Button>
      </div>
    )
  },
}

// ============================================================================
// Status Callouts
// ============================================================================

export const StatusCallouts: StoryObj = {
  render: () => (
    <div className="space-y-4 w-full max-w-lg">
      <Callout.Root color="info">
        <Callout.Icon>i</Callout.Icon>
        <Callout.Text>This is an informational message.</Callout.Text>
      </Callout.Root>
      <Callout.Root color="success">
        <Callout.Icon>✓</Callout.Icon>
        <Callout.Text>Your changes have been saved successfully.</Callout.Text>
      </Callout.Root>
      <Callout.Root color="warning">
        <Callout.Icon>!</Callout.Icon>
        <Callout.Text>Please review your input before continuing.</Callout.Text>
      </Callout.Root>
      <Callout.Root color="error">
        <Callout.Icon>✕</Callout.Icon>
        <Callout.Text>An error occurred. Please try again.</Callout.Text>
      </Callout.Root>
    </div>
  ),
}
