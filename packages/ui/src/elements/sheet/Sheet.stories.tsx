import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@/elements'
import { Label } from '@/form/Label'
import { Sheet } from './Sheet'

const meta: Meta = {
  title: 'Elements/Sheet',
  parameters: {
    layout: 'centered',
  },
}

export default meta

export const Right: StoryObj = {
  render: () => (
    <Sheet.Root>
      <Sheet.Trigger>
        <Button variant="solid">Open Sheet (Right)</Button>
      </Sheet.Trigger>
      <Sheet.Content side="right">
        <Sheet.Header>
          <Sheet.Title>Sheet Title</Sheet.Title>
          <Sheet.Close />
        </Sheet.Header>
        <Sheet.Body>
          <p className="text-sm text-muted-foreground">This sheet slides in from the right with a spring animation.</p>
        </Sheet.Body>
      </Sheet.Content>
    </Sheet.Root>
  ),
}

export const Left: StoryObj = {
  render: () => (
    <Sheet.Root>
      <Sheet.Trigger>
        <Button variant="solid">Open Sheet (Left)</Button>
      </Sheet.Trigger>
      <Sheet.Content side="left">
        <Sheet.Header>
          <Sheet.Title>Sheet Title</Sheet.Title>
          <Sheet.Close />
        </Sheet.Header>
        <Sheet.Body>
          <p className="text-sm text-muted-foreground">This sheet slides in from the left with a spring animation.</p>
        </Sheet.Body>
      </Sheet.Content>
    </Sheet.Root>
  ),
}

export const Bottom: StoryObj = {
  render: () => (
    <Sheet.Root>
      <Sheet.Trigger>
        <Button variant="solid">Open Sheet (Bottom)</Button>
      </Sheet.Trigger>
      <Sheet.Content side="bottom">
        <Sheet.Header>
          <Sheet.Title>Sheet Title</Sheet.Title>
          <Sheet.Close />
        </Sheet.Header>
        <Sheet.Body>
          <p className="text-sm text-muted-foreground">This sheet slides up from the bottom with a spring animation.</p>
        </Sheet.Body>
      </Sheet.Content>
    </Sheet.Root>
  ),
}

export const Top: StoryObj = {
  render: () => (
    <Sheet.Root>
      <Sheet.Trigger>
        <Button variant="solid">Open Sheet (Top)</Button>
      </Sheet.Trigger>
      <Sheet.Content side="top">
        <Sheet.Header>
          <Sheet.Title>Sheet Title</Sheet.Title>
          <Sheet.Close />
        </Sheet.Header>
        <Sheet.Body>
          <p className="text-sm text-muted-foreground">This sheet slides down from the top with a spring animation.</p>
        </Sheet.Body>
      </Sheet.Content>
    </Sheet.Root>
  ),
}

export const WithContent: StoryObj = {
  render: () => (
    <Sheet.Root>
      <Sheet.Trigger>
        <Button variant="outline">Edit Profile</Button>
      </Sheet.Trigger>
      <Sheet.Content side="right">
        <Sheet.Header>
          <Sheet.Title>Edit Profile</Sheet.Title>
          <Sheet.Close />
        </Sheet.Header>
        <Sheet.Body>
          <div className="flex flex-col gap-4">
            <div>
              <Label htmlFor="sheet-name">Name</Label>
              <input
                id="sheet-name"
                className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                defaultValue="John Doe"
              />
            </div>
            <div>
              <Label htmlFor="sheet-email">Email</Label>
              <input
                id="sheet-email"
                type="email"
                className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                defaultValue="john@example.com"
              />
            </div>
            <div>
              <Label htmlFor="sheet-bio">Bio</Label>
              <textarea
                id="sheet-bio"
                className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                rows={4}
                defaultValue="Software developer"
              />
            </div>
          </div>
        </Sheet.Body>
      </Sheet.Content>
    </Sheet.Root>
  ),
}
