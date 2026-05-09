import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card, Divider } from '@/elements'
import { SemanticColor, semanticColors } from '@/theme/props/color.prop'
import { getPropDefValues } from '@/theme/props/prop-def'
import { dividerPropDefs } from './divider.props'

const blockClassName = 'flex min-h-36 items-center justify-center text-xl font-medium'
const compactBlockClassName = 'flex min-h-24 flex-1 items-center justify-center text-xl font-medium'

function ContentCard({ compact = false }: { compact?: boolean }) {
  return (
    <Card.Root
      size="sm"
      variant="soft"
      color="neutral"
      radius="lg"
      className={compact ? compactBlockClassName : blockClassName}
    >
      content
    </Card.Root>
  )
}

const meta: Meta<typeof Divider> = {
  title: 'Elements/Divider',
  component: Divider,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    orientation: {
      control: 'select',
      options: getPropDefValues(dividerPropDefs.orientation),
    },
    size: {
      control: 'select',
      options: getPropDefValues(dividerPropDefs.size),
    },
    align: {
      control: 'select',
      options: getPropDefValues(dividerPropDefs.align),
    },
    color: {
      control: 'select',
      options: semanticColors,
    },
  },
  args: {
    children: 'OR',
    orientation: dividerPropDefs.orientation.default,
    size: dividerPropDefs.size.default,
    align: dividerPropDefs.align.default,
  },
}

export default meta
type Story = StoryObj<typeof Divider>

export const Playground: Story = {
  render: args =>
    args.orientation === 'vertical' ? (
      <div className="flex min-h-44 w-full items-stretch">
        <ContentCard compact />
        <Divider {...args} />
        <ContentCard compact />
      </div>
    ) : (
      <div className="flex w-full flex-col">
        <ContentCard />
        <Divider {...args} />
        <ContentCard />
      </div>
    ),
}

export const Default: Story = {
  render: () => (
    <div className="flex w-full flex-col">
      <ContentCard />
      <Divider />
      <ContentCard />
    </div>
  ),
}

export const WithText: Story = {
  render: () => (
    <div className="flex w-full flex-col">
      <ContentCard />
      <Divider>OR</Divider>
      <ContentCard />
    </div>
  ),
}

export const Horizontal: Story = {
  args: {
    orientation: 'horizontal',
  },
  render: () => (
    <div className="flex w-full flex-col">
      <ContentCard />
      <Divider orientation="horizontal">OR</Divider>
      <ContentCard />
    </div>
  ),
}

export const Vertical: Story = {
  args: {
    orientation: 'vertical',
  },
  render: () => (
    <div className="flex min-h-44 w-full items-stretch">
      <ContentCard compact />
      <Divider orientation="vertical">OR</Divider>
      <ContentCard compact />
    </div>
  ),
}

export const WithoutText: Story = {
  render: () => (
    <div className="flex w-full flex-col">
      <ContentCard />
      <Divider />
      <ContentCard />
    </div>
  ),
}

export const Alignment: Story = {
  render: () => (
    <div className="flex w-full flex-col gap-6">
      {getPropDefValues(dividerPropDefs.align).map(align => (
        <div key={align} className="space-y-1">
          <div className="font-mono text-muted-foreground text-xs">{align}</div>
          <Divider align={align}>Label</Divider>
        </div>
      ))}
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex w-full flex-col gap-6">
      {getPropDefValues(dividerPropDefs.size).map(size => (
        <div key={size} className="space-y-1">
          <div className="font-mono text-muted-foreground text-xs">{size}</div>
          <Divider size={size}>Section</Divider>
        </div>
      ))}
    </div>
  ),
}

export const Colors: Story = {
  render: () => (
    <div className="flex w-full flex-col gap-4">
      {[
        SemanticColor.neutral,
        SemanticColor.primary,
        SemanticColor.secondary,
        SemanticColor.accent,
        SemanticColor.info,
        SemanticColor.success,
        SemanticColor.warning,
        SemanticColor.error,
      ].map(color => (
        <Divider key={color} color={color}>
          {color}
        </Divider>
      ))}
    </div>
  ),
}

export const InContext: Story = {
  render: () => (
    <Card.Root size="md" variant="surface" color="neutral" radius="lg" className="mx-auto w-full max-w-md">
      <Card.Header>
        <Card.Title>Sign in</Card.Title>
        <Card.Description>Choose your preferred sign in method</Card.Description>
      </Card.Header>
      <div className="mt-4 space-y-2">
        <button type="button" className="w-full rounded-md border border-border px-4 py-2 text-sm hover:bg-muted">
          Continue with Google
        </button>
        <button type="button" className="w-full rounded-md border border-border px-4 py-2 text-sm hover:bg-muted">
          Continue with GitHub
        </button>
      </div>
      <Divider>or continue with</Divider>
      <div className="space-y-2">
        <input className="w-full rounded-md border border-border px-3 py-2 text-sm" placeholder="Email" />
        <input
          className="w-full rounded-md border border-border px-3 py-2 text-sm"
          placeholder="Password"
          type="password"
        />
        <button type="button" className="w-full rounded-md bg-primary px-4 py-2 text-primary-foreground text-sm">
          Sign in
        </button>
      </div>
    </Card.Root>
  ),
}
