import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@/elements'
import { Textarea, TextField } from '@/form'
import { Text } from '@/typography'
import { Sheet } from './Sheet'
import { sheetSides, type SheetSide } from './sheet.props'

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
          <Text as="p" size="sm" color="neutral" muted>
            This sheet slides in from the right with a spring animation.
          </Text>
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
          <Text as="p" size="sm" color="neutral" muted>
            This sheet slides in from the left with a spring animation.
          </Text>
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
          <Text as="p" size="sm" color="neutral" muted>
            This sheet slides up from the bottom with a spring animation.
          </Text>
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
          <Text as="p" size="sm" color="neutral" muted>
            This sheet slides down from the top with a spring animation.
          </Text>
        </Sheet.Body>
      </Sheet.Content>
    </Sheet.Root>
  ),
}

export const Sides: StoryObj = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      {sheetSides.map(side => (
        <Sheet.Root key={side}>
          <Sheet.Trigger>
            <Button variant="outline">{sideLabel(side)}</Button>
          </Sheet.Trigger>
          <Sheet.Content side={side}>
            <Sheet.Header>
              <Sheet.Title>{sideLabel(side)}</Sheet.Title>
              <Sheet.Close />
            </Sheet.Header>
            <Sheet.Body>
              <Text as="p" size="sm" color="neutral" muted>
                This sheet renders from the {side} side.
              </Text>
            </Sheet.Body>
          </Sheet.Content>
        </Sheet.Root>
      ))}
    </div>
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
            <TextField id="sheet-name" label="Name" defaultValue="John Doe" />
            <TextField id="sheet-email" label="Email" type="email" defaultValue="john@example.com" />
            <Textarea id="sheet-bio" label="Bio" rows={4} defaultValue="Software developer" />
          </div>
        </Sheet.Body>
      </Sheet.Content>
    </Sheet.Root>
  ),
}

function sideLabel(side: SheetSide) {
  return `${side.charAt(0).toUpperCase()}${side.slice(1)} sheet`
}
