import { style } from '@vanilla-extract/css'
import { semanticColorVar } from '@/theme/props/color.prop'

export const dbTableDefinitionEditorRootClass = style({
  minHeight: 0,
  backgroundColor: semanticColorVar('neutral', 'surface'),
})

export const dbTableDefinitionEditorAccordionClass = style({
  minHeight: 0,
  padding: 'var(--space-2, 8px)',
})

export const dbTableDefinitionEditorHeaderClass = style({
  borderBottom: `1px solid ${semanticColorVar('neutral', 'border')}`,
})

export const dbTableDefinitionEditorSectionHeaderClass = style({
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--space-1, 4px)',
  minWidth: 0,
  paddingRight: 'var(--space-2, 8px)',
})

export const dbTableDefinitionEditorSectionTriggerWrapClass = style({
  flex: '1 1 0',
  minWidth: 0,
})

export const dbTableDefinitionEditorSectionTriggerClass = style({
  minWidth: 0,
})

export const dbTableDefinitionEditorSectionClass = style({
  minHeight: 0,
  minWidth: 0,
  overflow: 'hidden',
  border: `1px solid ${semanticColorVar('neutral', 'border')}`,
  borderRadius: 'var(--radius-md)',
})

export const dbTableDefinitionEditorTableListClass = style({
  minHeight: 0,
  borderRight: `1px solid ${semanticColorVar('neutral', 'border')}`,
})

export const dbTableDefinitionEditorTreeShellClass = style({
  minHeight: 0,
})

export const dbTableDefinitionEditorEmptyClass = style({
  minHeight: 220,
  color: semanticColorVar('neutral', 'text'),
})

export const dbTableDefinitionEditorRelationshipListClass = style({
  minHeight: 0,
  overflow: 'auto',
})

export const dbTableDefinitionEditorRelationshipItemClass = style({
  border: `1px solid ${semanticColorVar('neutral', 'border')}`,
  backgroundColor: semanticColorVar('neutral', 'surface'),
})
