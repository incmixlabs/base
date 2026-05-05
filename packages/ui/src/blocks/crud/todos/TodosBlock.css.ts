import { style } from '@vanilla-extract/css'
import { semanticColorVar } from '@/theme/props/color.prop'

export const todosBlockRoot = style({
  border: `1px solid ${semanticColorVar('neutral', 'border')}`,
  borderRadius: '0.875rem',
  overflow: 'hidden',
  width: '100%',
})

export const todosBlockComposer = style({
  alignItems: 'center',
  backgroundColor: semanticColorVar('neutral', 'soft'),
  borderBottom: `1px solid ${semanticColorVar('neutral', 'border')}`,
  display: 'grid',
  gap: '0.625rem',
  gridTemplateColumns: 'auto minmax(0, 1fr)',
  padding: '0.5rem 0.75rem',
})

export const todosBlockComposerInput = style({
  minWidth: 0,
})

export const todosBlockList = style({
  display: 'grid',
})

export const todosBlockItemNode = style({
  display: 'grid',
})

export const todosBlockItem = style({
  alignItems: 'center',
  borderBottom: `1px solid ${semanticColorVar('neutral', 'border')}`,
  display: 'grid',
  gap: '0.75rem',
  gridTemplateColumns: 'auto minmax(0, 1fr) auto',
  minHeight: '3rem',
  padding: '0.625rem 0.75rem',
  selectors: {
    '&:last-child': {
      borderBottom: 0,
    },
  },
})

export const todosBlockSubtasks = style({
  display: 'grid',
  marginLeft: '1.75rem',
})

export const todosBlockItemMain = style({
  display: 'grid',
  gap: '0.375rem',
  minWidth: 0,
})

export const todosBlockItemText = style({
  color: semanticColorVar('slate', 'text'),
  display: 'block',
  minWidth: 0,
  overflowWrap: 'anywhere',
})

export const todosBlockItemTextCompleted = style({
  color: semanticColorVar('neutral', 'text'),
  opacity: 0.65,
  textDecoration: 'line-through',
})

export const todosBlockPriorityText = style({
  minWidth: 0,
})

export const todosBlockMenuSubContent = style({
  paddingBottom: '0.25rem',
  paddingTop: '0.25rem',
  width: 'auto',
})

export const todosBlockMenuPicker = style({
  minWidth: 0,
  border: 0,
  boxShadow: 'none',
  background: 'transparent',
})

export const todosBlockMenuLabel = style({
  padding: '0.25rem 0.75rem 0.5rem',
})

export const todosBlockItemActions = style({
  alignItems: 'center',
  display: 'inline-flex',
  gap: '0.25rem',
})

export const todosBlockAssigneeGroup = style({
  alignItems: 'center',
  display: 'inline-flex',
  flexShrink: 0,
})

export const todosBlockDueDate = style({
  alignItems: 'center',
  display: 'inline-flex',
  gap: '0.5rem',
  minWidth: 0,
})

export const todosBlockDueDateTrigger = style({
  alignItems: 'center',
  background: 'transparent',
  border: 0,
  color: semanticColorVar('error', 'text'),
  cursor: 'pointer',
  display: 'inline-flex',
  gap: '0.375rem',
  fontSize: '0.8125rem',
  minWidth: 0,
  padding: 0,
  selectors: {
    '&:focus-visible': {
      outline: `2px solid ${semanticColorVar('info', 'primary')}`,
      outlineOffset: '2px',
      borderRadius: '0.25rem',
    },
  },
})

export const todosBlockDueDateText = style({
  whiteSpace: 'nowrap',
})

export const todosBlockEmpty = style({
  color: semanticColorVar('neutral', 'text'),
  padding: '1rem 0.875rem',
})
