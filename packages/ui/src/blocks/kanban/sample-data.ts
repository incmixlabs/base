import type { KanbanColumn } from './types'

export const sampleKanbanColumns: KanbanColumn[] = [
  {
    id: 'backlog',
    title: 'Backlog',
    color: '#64748b',
    tasks: [
      {
        id: 'task-intake-flow',
        title: 'Tighten intake flow states',
        description: 'Align validation copy and empty states before the next review.',
        priority: 'medium',
        labels: [
          { label: 'UX', color: '#2563eb' },
          { label: 'Forms', color: '#7c3aed' },
        ],
        assignees: [
          { id: 'maya', name: 'Maya Chen' },
          { id: 'noah', name: 'Noah Patel' },
        ],
        subtasks: [
          { id: 'task-intake-flow-1', title: 'Audit required fields', completed: true },
          { id: 'task-intake-flow-2', title: 'Update review copy' },
        ],
        commentsCount: 3,
        schedule: {
          start: new Date(2026, 3, 20, 9, 0),
          end: new Date(2026, 3, 22, 17, 0),
          duration: { value: 2, unit: 'day' },
          lastChanged: 'duration',
        },
      },
      {
        id: 'task-schema-diff',
        title: 'Expose schema diff context',
        description: 'Show changed keys and affected renderers in a compact review row.',
        priority: 'high',
        labels: [{ label: 'Review', color: '#db2777' }],
        assignees: [{ id: 'olivia', name: 'Olivia Stone' }],
        attachmentsCount: 2,
        schedule: {
          start: new Date(2026, 3, 21, 10, 0),
          end: new Date(2026, 3, 24, 10, 0),
          duration: { value: 3, unit: 'day' },
          lastChanged: 'end',
        },
      },
    ],
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    color: '#2563eb',
    tasks: [
      {
        id: 'task-kanban-port',
        title: 'Port kanban block',
        description: 'Decouple the in-house board from app stores and ship it as an isolated package module.',
        priority: 'urgent',
        labels: [
          { label: 'Blocks', color: '#0891b2' },
          { label: 'DnD', color: '#ea580c' },
        ],
        assignees: [
          { id: 'nadia', name: 'Nadia Brooks' },
          { id: 'eli', name: 'Eli Morgan' },
        ],
        subtasks: [
          { id: 'task-kanban-port-1', title: 'Define data contract', completed: true },
          { id: 'task-kanban-port-2', title: 'Add pragmatic drag and drop' },
          { id: 'task-kanban-port-3', title: 'Wire schedule editor' },
        ],
        commentsCount: 8,
        schedule: {
          start: new Date(2026, 3, 23, 8, 30),
          end: new Date(2026, 3, 24, 16, 30),
          duration: { value: 32, unit: 'hour' },
          lastChanged: 'start',
        },
      },
    ],
  },
  {
    id: 'review',
    title: 'Review',
    color: '#7c3aed',
    tasks: [
      {
        id: 'task-token-cleanup',
        title: 'Review theme token cleanup',
        description: 'Confirm the static Tailwind classes and Vanilla Extract variants remain separated.',
        completed: true,
        priority: 'low',
        labels: [{ label: 'Theme', color: '#16a34a' }],
        assignees: [{ id: 'sara', name: 'Sara Kim' }],
        schedule: {
          start: new Date(2026, 3, 18, 13, 0),
          end: new Date(2026, 3, 19, 13, 0),
          duration: { value: 1, unit: 'day' },
          lastChanged: 'end',
        },
      },
    ],
  },
  {
    id: 'done',
    title: 'Done',
    color: '#16a34a',
    tasks: [],
  },
]
