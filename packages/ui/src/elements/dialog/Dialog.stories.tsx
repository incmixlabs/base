import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button, Dialog } from '@/elements'
import { Label, TextField } from '@/form'
import { getPropDefValues } from '@/theme/props/prop-def'
import { dialogContentPropDefs } from './dialog.props'

const dialogSizes = getPropDefValues(dialogContentPropDefs.size)

const meta: Meta = {
  title: 'Elements/Dialog',
  parameters: {
    layout: 'centered',
  },
}

export default meta

export const Default: StoryObj = {
  render: () => (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button>Open Dialog</Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Close />
        <Dialog.Header>
          <Dialog.Title>Edit Profile</Dialog.Title>
          <Dialog.Description>Make changes to your profile here. Click save when you're done.</Dialog.Description>
        </Dialog.Header>
        <Dialog.Body>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <TextField id="name" placeholder="Enter your name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <TextField id="email" type="email" placeholder="Enter your email" />
            </div>
          </div>
        </Dialog.Body>
        <Dialog.Footer>
          <Dialog.Close asChild>
            <Button variant="outline">Cancel</Button>
          </Dialog.Close>
          <Button>Save changes</Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  ),
}

export const Sizes: StoryObj = {
  render: () => (
    <div className="flex gap-4">
      {dialogSizes.map(size => (
        <Dialog.Root key={size}>
          <Dialog.Trigger>
            <Button variant="outline">{size.toUpperCase()}</Button>
          </Dialog.Trigger>
          <Dialog.Content size={size}>
            <Dialog.Close />
            <Dialog.Header>
              <Dialog.Title>Dialog - {size.toUpperCase()}</Dialog.Title>
              <Dialog.Description>This dialog uses size {size}.</Dialog.Description>
            </Dialog.Header>
            <Dialog.Body>
              <p className="text-muted-foreground">Content goes here. The dialog uses the {size} width preset.</p>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.Close>
                <Button variant="outline">Close</Button>
              </Dialog.Close>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Root>
      ))}
    </div>
  ),
}

export const WithForm: StoryObj = {
  render: () => (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button>Create Account</Button>
      </Dialog.Trigger>
      <Dialog.Content size="sm">
        <Dialog.Close />
        <Dialog.Header>
          <Dialog.Title>Create Account</Dialog.Title>
          <Dialog.Description>Fill in the details below to create your account.</Dialog.Description>
        </Dialog.Header>
        <Dialog.Body>
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first-name">First Name</Label>
                <TextField id="first-name" placeholder="John" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last-name">Last Name</Label>
                <TextField id="last-name" placeholder="Doe" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-email">Email</Label>
              <TextField id="create-email" type="email" placeholder="john@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <TextField id="password" type="password" placeholder="Create a password" />
            </div>
          </form>
        </Dialog.Body>
        <Dialog.Footer>
          <Dialog.Close>
            <Button variant="outline">Cancel</Button>
          </Dialog.Close>
          <Button>Create Account</Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  ),
}

export const ScrollableContent: StoryObj = {
  render: () => (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button>View Terms</Button>
      </Dialog.Trigger>
      <Dialog.Content size="lg">
        <Dialog.Close />
        <Dialog.Header>
          <Dialog.Title>Terms of Service</Dialog.Title>
          <Dialog.Description>Please read and accept our terms of service.</Dialog.Description>
        </Dialog.Header>
        <Dialog.Body className="max-h-[60vh] overflow-y-auto">
          <div className="space-y-4 text-sm text-muted-foreground">
            {Array.from({ length: 10 }).map((_, i) => (
              <p key={i}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
                ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                fugiat nulla pariatur.
              </p>
            ))}
          </div>
        </Dialog.Body>
        <Dialog.Footer>
          <Dialog.Close>
            <Button variant="outline">Decline</Button>
          </Dialog.Close>
          <Button>Accept</Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  ),
}
