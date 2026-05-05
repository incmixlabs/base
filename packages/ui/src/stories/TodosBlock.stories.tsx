import type { Meta, StoryObj } from '@storybook/react-vite'
import { TodosBlock } from '@/blocks'

const meta = {
  title: 'Blocks/Crud/TodosBlock',
  component: TodosBlock,
  parameters: {
    layout: 'padded',
  },
  args: {
    defaultItems: [
      { id: 'todo-1', text: 'Learn about AutoForm', completed: true, dueDate: new Date(2026, 1, 16) },
      { id: 'todo-2', text: 'Ship JSON diff review surface', completed: false, dueDate: new Date(2026, 2, 11) },
      { id: 'todo-3', text: 'Tighten schema editor affordances', completed: false },
    ],
  },
} satisfies Meta<typeof TodosBlock>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Empty: Story = {
  args: {
    defaultItems: [],
  },
}

export const PriorityStates: Story = {
  args: {
    defaultItems: [
      { id: 'todo-none', text: 'Inbox triage', priority: 'none' },
      { id: 'todo-low', text: 'Refresh placeholder copy', priority: 'low' },
      { id: 'todo-medium', text: 'Review onboarding checkpoints', priority: 'medium' },
      { id: 'todo-high', text: 'Resolve schema validation drift', priority: 'high' },
      { id: 'todo-critical', text: 'Restore failed production sync', priority: 'critical' },
      { id: 'todo-blocker', text: 'Unblock payment provider cutover', priority: 'blocker' },
      {
        id: 'todo-nested',
        text: 'Release readiness sweep',
        priority: 'high',
        subtasks: [
          { id: 'todo-nested-1', text: 'Final QA pass', priority: 'medium' },
          { id: 'todo-nested-2', text: 'Escalate critical regression', priority: 'blocker' },
        ],
      },
    ],
  },
}
