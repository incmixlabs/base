import type { Meta, StoryObj } from '@storybook/react-vite'
import { Header } from './Header'

const meta = {
  title: 'Layouts/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  args: {
    sticky: true,
  },
  argTypes: {
    sticky: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Header>

export default meta
type Story = StoryObj<typeof meta>

const navButtonClassName = 'appearance-none border-0 bg-transparent p-0 font-[inherit] leading-[inherit] text-inherit'

function HeaderContent({ title = 'Workspace' }: { title?: string }) {
  return (
    <div className="flex h-14 min-w-0 items-center justify-between gap-4 px-4">
      <div className="min-w-0">
        <div className="truncate font-medium text-base text-neutral">{title}</div>
        <div className="truncate text-slate text-xs">Design system migration</div>
      </div>
      <nav className="flex shrink-0 items-center gap-3 text-sm text-slate">
        <button type="button" className={`${navButtonClassName} font-medium text-primary`}>
          Overview
        </button>
        <button type="button" className={navButtonClassName}>
          Activity
        </button>
        <button type="button" className={navButtonClassName}>
          Settings
        </button>
      </nav>
    </div>
  )
}

const pageRows = Array.from({ length: 10 }, (_, index) => `Activity ${index + 1}`)

export const Default: Story = {
  render: args => (
    <div className="min-h-40 bg-light-surface">
      <Header {...args}>
        <HeaderContent />
      </Header>
      <main className="p-4 text-sm text-slate">
        <div className="rounded-md border border-light bg-light-surface p-4">Content begins below the header.</div>
      </main>
    </div>
  ),
}

export const Static: Story = {
  args: {
    sticky: false,
  },
  render: args => (
    <div className="min-h-40 bg-light-surface">
      <Header {...args}>
        <HeaderContent title="Static header" />
      </Header>
      <main className="p-4 text-sm text-slate">
        <div className="rounded-md border border-light bg-light-surface p-4">
          This header does not use sticky positioning.
        </div>
      </main>
    </div>
  ),
}

export const StickyInScroll: Story = {
  render: args => (
    <div className="h-[360px] overflow-y-auto bg-light-surface">
      <Header {...args}>
        <HeaderContent title="Project Alpha" />
      </Header>
      <main className="grid gap-3 p-4">
        {pageRows.map(row => (
          <section key={row} className="rounded-md border border-light bg-light-surface p-4">
            <div className="font-medium text-neutral">{row}</div>
            <div className="mt-1 text-sm text-slate">Release readiness review</div>
          </section>
        ))}
      </main>
    </div>
  ),
}
