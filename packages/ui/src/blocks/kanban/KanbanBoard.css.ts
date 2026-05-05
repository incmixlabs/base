import { createVar, style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'

export const kanbanColumnAccentVar = createVar()

export const kanbanRoot = recipe({
  base: {
    vars: {
      '--kanban-column-width': '20rem',
      '--kanban-board-gap': '1rem',
      '--kanban-board-padding': '1rem',
      '--kanban-card-gap': '0.75rem',
    },
    border: '1px solid var(--color-neutral-border-subtle)',
    color: 'var(--color-neutral-text)',
  },
  variants: {
    density: {
      compact: {
        vars: {
          '--kanban-column-width': '18rem',
          '--kanban-board-gap': '0.75rem',
          '--kanban-board-padding': '0.75rem',
          '--kanban-card-gap': '0.5rem',
        },
      },
      comfortable: {},
    },
    tone: {
      neutral: {
        background: 'var(--color-neutral-surface)',
      },
      workbench: {
        background: 'color-mix(in oklch, var(--color-neutral-surface) 78%, var(--color-primary-surface))',
      },
    },
  },
})

export const kanbanColumn = recipe({
  base: {
    width: 'var(--kanban-column-width)',
    border: '1px solid var(--color-neutral-border-subtle)',
    background: 'color-mix(in oklch, var(--color-neutral-surface) 92%, var(--kanban-column-accent, transparent))',
    boxShadow: '0 1px 2px rgb(0 0 0 / 0.04)',
    transition: 'border-color 160ms ease, box-shadow 160ms ease, opacity 160ms ease, transform 160ms ease',
  },
  variants: {
    state: {
      idle: {},
      overCard: {
        borderColor: 'var(--kanban-column-accent)',
        boxShadow: '0 0 0 2px color-mix(in oklch, var(--kanban-column-accent) 35%, transparent)',
      },
      overColumn: {
        transform: 'translateY(-2px)',
        borderColor: 'var(--color-primary-border)',
        boxShadow: '0 8px 24px rgb(0 0 0 / 0.1)',
      },
      dragging: {
        opacity: 0.55,
      },
    },
  },
})

export const kanbanCard = recipe({
  base: {
    border: '1px solid var(--color-neutral-border-subtle)',
    background: 'var(--color-neutral-background)',
    boxShadow: '0 1px 2px rgb(0 0 0 / 0.05)',
    transition: 'border-color 160ms ease, box-shadow 160ms ease, opacity 160ms ease, transform 160ms ease',
  },
  variants: {
    state: {
      idle: {},
      dragging: {
        opacity: 0.45,
        transform: 'scale(0.985)',
      },
      preview: {
        borderColor: 'var(--color-primary-border)',
        boxShadow: '0 16px 36px rgb(0 0 0 / 0.18)',
      },
    },
    completed: {
      true: {
        opacity: 0.72,
      },
      false: {},
    },
  },
})

export const kanbanDropIndicator = style({
  height: '0.35rem',
  borderRadius: '999px',
  background: 'var(--color-primary-primary)',
  boxShadow: '0 0 0 3px var(--color-primary-primary-alpha)',
})

export const kanbanColumnAccent = style({
  background: kanbanColumnAccentVar,
})

export const kanbanPriority = recipe({
  base: {
    border: '1px solid currentColor',
  },
  variants: {
    priority: {
      none: {
        color: 'var(--color-slate-text)',
      },
      low: {
        color: 'var(--color-success-text)',
      },
      medium: {
        color: 'var(--color-secondary-text)',
      },
      high: {
        color: 'var(--color-warning-text)',
      },
      urgent: {
        color: 'var(--color-error-text)',
      },
      critical: {
        color: 'var(--color-error-contrast)',
        background: 'var(--color-error-primary)',
      },
    },
  },
})
