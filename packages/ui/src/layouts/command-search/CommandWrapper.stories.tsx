import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@/elements/button/Button'
import { CommandWrapper } from './CommandWrapper'
import type { CommandWrapperData, CommandWrapperProps } from './command-wrapper.types'

const data: CommandWrapperData = {
  sections: [
    {
      id: 'navigation',
      label: 'Navigation',
      items: [
        { id: 'docs-intro', label: 'Introduction', description: 'Open docs intro', keywords: ['docs', 'intro'] },
        { id: 'docs-tokens', label: 'Tokens', description: 'Open tokens reference', keywords: ['tokens'] },
      ],
    },
    {
      id: 'actions',
      label: 'Actions',
      items: [
        { id: 'new-project', label: 'Create project', shortcut: ['⌘', 'N'] },
        { id: 'invite', label: 'Invite teammate', shortcut: ['⌘', 'I'] },
      ],
    },
  ],
}

const longData: CommandWrapperData = {
  sections: [
    {
      id: 'navigation',
      label: 'Documentation',
      items: Array.from({ length: 24 }, (_, index) => ({
        id: `doc-${index + 1}`,
        label: `Guide ${index + 1}`,
        description: `Scrollable result ${index + 1}`,
        keywords: ['docs', 'guide', `item-${index + 1}`],
      })),
    },
    {
      id: 'actions',
      label: 'Actions',
      items: Array.from({ length: 12 }, (_, index) => ({
        id: `action-${index + 1}`,
        label: `Run action ${index + 1}`,
        description: `Command item ${index + 1}`,
        shortcut: ['⌘', `${index + 1}`],
      })),
    },
  ],
}

const meta = {
  title: 'Layouts/CommandWrapper',
  component: CommandWrapper,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<CommandWrapperProps>

export default meta

type Story = StoryObj<CommandWrapperProps>

export const DataDriven: Story = {
  args: {
    data,
    triggerLabel: 'Search docs...',
  },
}

export const WithRenderOverrides: Story = {
  render: () => (
    <CommandWrapper
      data={data}
      renderItem={(section, item, defaultItem) => {
        if (section.id === 'actions' && item.id === 'new-project') {
          return {
            ...defaultItem,
            label: 'Create new project',
            description: 'Overridden label from renderItem',
          }
        }
        return defaultItem
      }}
      renderTrigger={defaultTrigger => (
        <div className="flex items-center gap-2">
          {defaultTrigger}
          <Button variant="soft">Help</Button>
        </div>
      )}
    />
  ),
}

export const LongScrollableList: Story = {
  args: {
    data: longData,
    triggerLabel: 'Browse commands...',
  },
}
