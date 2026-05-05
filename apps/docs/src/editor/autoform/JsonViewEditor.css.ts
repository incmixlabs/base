import { globalStyle, style } from '@vanilla-extract/css'
import { treeViewRootBase } from '@/elements/tree-view/TreeView.css'
import { semanticColorVar } from '@/theme/props/color.prop'

const editorMutedTextColor = `color-mix(in oklch, ${semanticColorVar('neutral', 'text')} 68%, transparent)`
const editorErrorTint = `color-mix(in oklch, ${semanticColorVar('error', 'primary')} 7%, transparent)`

const compactTextFieldVars = {
  '--tf-height': '1.5rem',
  '--tf-padding-x': '0.375rem',
  '--tf-padding-y': '0.125rem',
  '--tf-font-size': '0.6875rem',
  '--tf-line-height': '1rem',
  '--tf-icon-size': '0.75rem',
} as const

export const jsonViewEditorRoot = style({
  border: `1px solid ${semanticColorVar('neutral', 'border')}`,
  borderRadius: 'var(--radius-md)',
  background: semanticColorVar('neutral', 'surface'),
  padding: '0.25rem',
  minWidth: 0,
})

export const jsonViewEditorToolbar = style({
  padding: '0.25rem',
  paddingBottom: '0.5rem',
})

export const jsonViewEditorEmptyState = style({
  color: editorMutedTextColor,
  fontSize: '0.75rem',
  padding: '0.5rem',
})

export const jsonViewEditorRow = style({
  display: 'grid',
  gridTemplateColumns: 'fit-content(180px) minmax(0, 1fr)',
  alignItems: 'center',
  gap: '0.375rem',
  minWidth: 0,
})

export const jsonViewEditorRowStacked = style({
  gridTemplateColumns: 'minmax(0, 1fr)',
  alignItems: 'start',
})

export const jsonViewEditorValueStacked = style({
  paddingInlineStart: '1.25rem',
})

export const jsonViewEditorManagedHint = style({
  color: editorMutedTextColor,
  fontSize: '0.6875rem',
  lineHeight: '1rem',
})

export const jsonViewEditorRecentAction = style({
  color: semanticColorVar('success', 'text'),
  fontSize: '0.6875rem',
  lineHeight: '1rem',
  fontWeight: 500,
})

export const jsonViewEditorRowError = style({
  alignItems: 'start',
  borderRadius: 'var(--radius-sm)',
  background: editorErrorTint,
})

export const jsonViewEditorKeyText = style({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  fontFamily: 'var(--font-mono, monospace)',
  fontSize: '0.75rem',
})

export const jsonViewEditorValue = style({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '0.375rem',
  minWidth: 0,
})

export const jsonViewEditorValueStack = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  gap: '0.25rem',
  minWidth: 0,
})

export const jsonViewEditorActions = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.25rem',
  marginInlineStart: 'auto',
})

export const jsonViewEditorSummary = style({
  color: editorMutedTextColor,
  fontSize: '0.75rem',
  minWidth: 0,
  overflowWrap: 'anywhere',
  whiteSpace: 'normal',
})

export const jsonViewEditorRefSummary = style({
  color: editorMutedTextColor,
  fontSize: '0.6875rem',
  minWidth: 0,
  overflowWrap: 'anywhere',
  whiteSpace: 'normal',
})

export const jsonViewEditorIssueText = style({
  color: semanticColorVar('error', 'text'),
  fontSize: '0.6875rem',
  lineHeight: '1rem',
  minWidth: 0,
})

export const jsonViewEditorTextField = style({
  width: '100%',
  minWidth: 0,
  vars: compactTextFieldVars,
})

export const jsonViewEditorKeyField = style({
  minWidth: 0,
  width: '100%',
  maxWidth: '100%',
  vars: compactTextFieldVars,
})

export const jsonViewEditorCheckboxWrap = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.375rem',
})

globalStyle(`${jsonViewEditorRoot} .${treeViewRootBase}`, {
  overflow: 'visible',
})

globalStyle(`${jsonViewEditorTextField} textarea`, {
  minHeight: 'var(--tf-height)',
})
