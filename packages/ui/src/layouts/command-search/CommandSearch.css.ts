import { globalStyle, style } from '@vanilla-extract/css'
import { semanticColorVar } from '@/theme/props/color.prop'

export const commandDialogContent = style({
  top: '10vh',
  width: '92vw',
  maxWidth: '37.5rem',
  overflow: 'hidden',
  borderRadius: 'calc(var(--radius-factor) * 1rem)',
  backgroundColor: 'var(--background)',
  borderColor: semanticColorVar('neutral', 'border'),
  boxShadow: '0 24px 64px color-mix(in oklch, black 24%, transparent)',
})

export const commandSearchTrigger = style({
  color: semanticColorVar('neutral', 'text'),
  borderColor: semanticColorVar('neutral', 'border'),
  backgroundColor: semanticColorVar('neutral', 'surface'),
  selectors: {
    '&:hover': {
      backgroundColor: semanticColorVar('neutral', 'soft'),
    },
    '&:active': {
      backgroundColor: semanticColorVar('neutral', 'soft-hover'),
    },
  },
})

export const commandDialogRoot = style({
  display: 'flex',
  flexDirection: 'column',
  color: semanticColorVar('neutral', 'text'),
})

export const commandInputRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  paddingInline: '1rem',
  borderBottom: `1px solid ${semanticColorVar('neutral', 'border')}`,
})

export const commandSearchIcon = style({
  width: '1rem',
  height: '1rem',
  flexShrink: 0,
  color: semanticColorVar('neutral', 'text'),
  opacity: 0.55,
})

export const commandInput = style({
  width: '100%',
  height: '3.5rem',
  border: 'none',
  background: 'transparent',
  outline: 'none',
  padding: 0,
  fontSize: '1rem',
  color: semanticColorVar('neutral', 'text'),
  selectors: {
    '&::placeholder': {
      color: semanticColorVar('neutral', 'text'),
      opacity: 0.55,
    },
  },
})

export const commandList = style({
  maxHeight: '50vh',
  overflowY: 'auto',
  paddingBlock: '0.5rem',
  transition: 'height var(--af-motion-fast) var(--af-ease-standard)',
})

export const commandEmptyState = style({
  padding: '2rem 1rem',
  fontSize: '0.9375rem',
  color: semanticColorVar('neutral', 'text'),
  opacity: 0.65,
})

export const commandGroup = style({})

export const commandItem = style({
  position: 'relative',
  display: 'flex',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '0.75rem',
  padding: '0.75rem 1rem 0.75rem 1.25rem',
  cursor: 'pointer',
  color: semanticColorVar('neutral', 'text'),
  outline: 'none',
  transition:
    'background-color var(--af-motion-fast) var(--af-ease-standard), color var(--af-motion-fast) var(--af-ease-standard)',
  selectors: {
    '&[data-disabled="true"]': {
      cursor: 'not-allowed',
      opacity: 0.45,
    },
    '&[data-selected="true"]': {
      backgroundColor: semanticColorVar('slate', 'soft'),
    },
    '&[data-selected="true"]::before': {
      content: '',
      position: 'absolute',
      left: 0,
      top: '0.35rem',
      bottom: '0.35rem',
      width: '0.25rem',
      borderRadius: '0 999px 999px 0',
      backgroundColor: semanticColorVar('primary', 'primary'),
    },
  },
})

export const commandItemText = style({
  display: 'flex',
  minWidth: 0,
  flex: 1,
  flexDirection: 'column',
})

export const commandItemLabel = style({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  fontSize: '0.9375rem',
  fontWeight: 600,
})

export const commandItemDescription = style({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  fontSize: '0.875rem',
  color: semanticColorVar('neutral', 'text'),
  opacity: 0.7,
})

export const shortcutRow = style({
  display: 'flex',
  flexShrink: 0,
  alignItems: 'center',
  gap: '0.25rem',
})

export const shortcutKey = style({
  minWidth: '1.5rem',
  justifyContent: 'center',
})

globalStyle(`${commandList} [cmdk-list-sizer]`, {
  display: 'flex',
  flexDirection: 'column',
})

globalStyle(`${commandGroup} [cmdk-group-heading]`, {
  padding: '0.5rem 1rem',
  fontSize: '0.75rem',
  fontWeight: '600',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: semanticColorVar('neutral', 'text'),
  opacity: 0.5,
})
