import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card, Divider } from '@/elements'
import { semanticColors } from '@/theme/props/color.prop'
import { getPropDefValues } from '@/theme/props/prop-def'
import { Text } from '@/typography'
import { dividerPropDefs } from './divider.props'

const blockClassName = 'flex min-h-36 items-center justify-center text-xl font-medium'
const compactBlockClassName = 'flex min-h-24 flex-1 items-center justify-center text-xl font-medium'
const captionClassName = 'font-mono text-neutral opacity-70'

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

export const StructuralHorizontal: Story = {
  render: () => (
    <div className="flex w-full max-w-xl flex-col gap-4">
      <div className="rounded-md bg-neutral-soft p-4 text-sm text-neutral">Account</div>
      <Divider size="xs" />
      <div className="rounded-md bg-neutral-soft p-4 text-sm text-neutral">Security</div>
    </div>
  ),
}

export const StructuralVertical: Story = {
  args: {
    orientation: 'vertical',
  },
  render: () => (
    <div className="flex h-36 max-w-xl items-stretch gap-4">
      <div className="flex flex-1 items-center justify-center rounded-md bg-neutral-soft text-sm text-neutral">
        Left
      </div>
      <Divider orientation="vertical" size="xs" />
      <div className="flex flex-1 items-center justify-center rounded-md bg-neutral-soft text-sm text-neutral">
        Right
      </div>
    </div>
  ),
}

export const Alignment: Story = {
  render: () => (
    <div className="flex w-full max-w-xl flex-col gap-6">
      {getPropDefValues(dividerPropDefs.align).map(align => (
        <div key={align} className="rounded-md bg-neutral-soft p-4">
          <Text as="div" size="xs" className={captionClassName}>
            {align}
          </Text>
          <Divider align={align} color="primary">
            {align}
          </Divider>
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
          <Text as="div" size="xs" className={captionClassName}>
            {size}
          </Text>
          <Divider size={size}>Section</Divider>
        </div>
      ))}
    </div>
  ),
}

export const StructuralSizes: Story = {
  render: () => (
    <div className="grid w-full max-w-3xl grid-cols-4 gap-4">
      {getPropDefValues(dividerPropDefs.size).map(size => (
        <div key={size} className="rounded-md bg-neutral-soft p-4">
          <Text as="div" size="xs" className={captionClassName}>
            {size}
          </Text>
          <Divider size={size} color="primary" />
        </div>
      ))}
    </div>
  ),
}

export const Colors: Story = {
  render: () => (
    <div className="flex w-full flex-col gap-4">
      {semanticColors.map(color => (
        <Divider key={color} color={color}>
          {color}
        </Divider>
      ))}
    </div>
  ),
}

export const StructuralColors: Story = {
  render: () => (
    <div className="grid w-full max-w-xl gap-4">
      {semanticColors.map(color => (
        <div key={color} className="space-y-2">
          <Text as="div" size="xs" className={captionClassName}>
            {color}
          </Text>
          <Divider color={color} size="sm" />
        </div>
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
        <button
          type="button"
          className="w-full rounded-md border border-neutral px-4 py-2 text-sm hover:bg-neutral-soft"
        >
          Continue with Google
        </button>
        <button
          type="button"
          className="w-full rounded-md border border-neutral px-4 py-2 text-sm hover:bg-neutral-soft"
        >
          Continue with GitHub
        </button>
      </div>
      <Divider>or continue with</Divider>
      <div className="space-y-2">
        <input className="w-full rounded-md border border-neutral px-3 py-2 text-sm" placeholder="Email" />
        <input
          className="w-full rounded-md border border-neutral px-3 py-2 text-sm"
          placeholder="Password"
          type="password"
        />
        <button type="button" className="w-full rounded-md bg-primary-solid px-4 py-2 text-primary-contrast text-sm">
          Sign in
        </button>
      </div>
    </Card.Root>
  ),
}
