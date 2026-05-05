import type { Meta, StoryObj } from '@storybook/react-vite'
import { Theme } from '@/theme/ThemeProvider'
import { ThemeToggle } from './ThemeToggle'

const meta: Meta<typeof ThemeToggle> = {
  title: 'Theme/ThemeToggle',
  component: ThemeToggle,
  parameters: {
    layout: 'centered',
    disableGlobalTheme: true,
  },
  tags: ['autodocs'],
  decorators: [
    Story => (
      <Theme className="min-h-screen w-full flex items-center justify-center">
        <Story />
      </Theme>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithSystem: Story = {
  args: {
    modes: ['light', 'dark', 'inherit'],
  },
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <ThemeToggle size="sm" />
      <ThemeToggle size="md" />
      <ThemeToggle size="lg" />
      <ThemeToggle size="xl" />
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <ThemeToggle variant="ghost" />
      <ThemeToggle variant="soft" />
      <ThemeToggle variant="outline" />
      <ThemeToggle variant="solid" />
    </div>
  ),
}

export const DirectionLTR: Story = {
  args: { direction: 'ltr' },
}

export const DirectionRTL: Story = {
  args: { direction: 'rtl' },
}

export const DirectionTTB: Story = {
  args: { direction: 'ttb' },
}

export const DirectionBTT: Story = {
  args: { direction: 'btt' },
}
