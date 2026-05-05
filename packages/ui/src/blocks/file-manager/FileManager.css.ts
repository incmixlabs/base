import { style } from '@vanilla-extract/css'
import {
  treeViewItemHoverBgVar,
  treeViewItemSelectedBgVar,
  treeViewItemSelectedColorVar,
} from '@/elements/tree-view/TreeView.css'
import { semanticColorVar } from '@/theme/props/color.prop'

export const fileManagerRoot = style({
  background: semanticColorVar('neutral', 'surface'),
  color: semanticColorVar('slate', 'text'),
  display: 'grid',
  gridTemplateColumns: '16.875rem minmax(0, 1fr)',
  height: '100%',
  minHeight: 0,
  overflow: 'hidden',
  width: '100%',
})

export const fileManagerSidebar = style({
  background: semanticColorVar('neutral', 'surface'),
  borderInlineEnd: `1px solid ${semanticColorVar('neutral', 'border')}`,
  color: semanticColorVar('slate', 'text'),
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  minHeight: 0,
  overflow: 'hidden',
  width: '100%',
})

export const fileManagerHeader = style({
  borderBottom: `1px solid ${semanticColorVar('neutral', 'border')}`,
  color: semanticColorVar('primary', 'text'),
  fontWeight: 600,
  height: '3.25rem',
  paddingInline: '0.5rem',
})

export const fileManagerIconButton = style({
  selectors: {
    '&&': {
      color: semanticColorVar('secondary', 'primary'),
    },
    '&&:hover': {
      color: semanticColorVar('secondary', 'text'),
    },
  },
})

export const fileManagerBody = style({
  flex: 1,
  gridTemplateRows: 'auto minmax(0, 1fr) auto',
  minHeight: 0,
  overflow: 'hidden',
})

export const fileManagerSectionLabel = style({
  color: semanticColorVar('neutral', 'text'),
  fontSize: '0.8125rem',
  fontWeight: 500,
  letterSpacing: '0.04em',
  paddingInline: '0.5rem',
  textTransform: 'uppercase',
})

export const fileManagerTree = style({
  minHeight: 0,
  position: 'relative',
  vars: {
    [treeViewItemHoverBgVar]: semanticColorVar('neutral', 'soft'),
    [treeViewItemSelectedBgVar]: semanticColorVar('neutral', 'soft'),
    [treeViewItemSelectedColorVar]: semanticColorVar('slate', 'text'),
  },
})

export const fileManagerUtility = style({
  borderTop: `1px solid ${semanticColorVar('neutral', 'border')}`,
  marginInline: '0.5rem',
  paddingTop: '1rem',
})

export const fileManagerUtilityRow = style({
  color: semanticColorVar('slate', 'text'),
  minHeight: '2rem',
})

export const fileManagerContent = style({
  display: 'grid',
  gridTemplateRows: 'auto minmax(0, 1fr)',
  minHeight: 0,
  overflow: 'hidden',
})

export const fileManagerContentHeader = style({
  borderBottom: `1px solid ${semanticColorVar('neutral', 'border')}`,
  padding: '1rem 1.5rem',
})

export const fileManagerBreadcrumb = style({
  color: semanticColorVar('slate', 'text'),
  minHeight: '2rem',
})

export const fileManagerBreadcrumbCurrent = style({
  color: semanticColorVar('secondary', 'text'),
})

export const fileManagerToolbar = style({
  alignItems: 'center',
  display: 'grid',
  gap: '0.75rem',
  gridTemplateColumns: 'minmax(12rem, 22rem) 1fr auto auto',
})

export const fileManagerSearchIcon = style({
  color: semanticColorVar('neutral', 'text'),
})

export const fileManagerMain = style({
  gridTemplateRows: 'auto minmax(0, 1fr)',
  minHeight: 0,
  overflow: 'hidden',
  paddingLeft: '1.5rem',
  paddingTop: '0.75rem',
})

export const fileManagerContents = style({
  minHeight: 0,
  overflow: 'auto',
})

export const fileManagerContentTitle = style({
  color: semanticColorVar('slate', 'text'),
  fontSize: '1.5rem',
  fontWeight: 600,
  lineHeight: 1.25,
})

export const fileManagerGrid = style({
  display: 'grid',
  gap: '1rem',
  gridTemplateColumns: 'repeat(auto-fill, 10rem)',
  justifyContent: 'start',
})

export const fileManagerCard = style({
  borderColor: semanticColorVar('neutral', 'border'),
  cursor: 'pointer',
  height: '9.5rem',
  transition: 'background-color 120ms ease, border-color 120ms ease, box-shadow 120ms ease',
  selectors: {
    '&&': {
      background: semanticColorVar('neutral', 'surface'),
      color: semanticColorVar('slate', 'text'),
    },
    '&&:hover': {
      background: semanticColorVar('neutral', 'surface'),
      borderColor: semanticColorVar('slate', 'border'),
      boxShadow: 'var(--shadow-2)',
    },
    '&[data-selected]': {
      background: semanticColorVar('neutral', 'soft'),
      borderColor: semanticColorVar('slate', 'border'),
    },
  },
})

export const fileManagerCardContent = style({
  height: '100%',
  minHeight: 0,
  paddingTop: 0,
})

export const fileManagerFileIcon = style({
  color: semanticColorVar('slate', 'text'),
})

export const fileManagerFolderIcon = style({
  color: semanticColorVar('secondary', 'primary'),
})

export const fileManagerCardAction = style({
  opacity: 0,
  pointerEvents: 'none',
  position: 'absolute',
  right: '0.75rem',
  top: '0.75rem',
  transition: 'opacity 120ms ease',
  selectors: {
    [`${fileManagerCard}:hover &`]: {
      opacity: 1,
      pointerEvents: 'auto',
    },
    [`${fileManagerCard}:focus-within &`]: {
      opacity: 1,
      pointerEvents: 'auto',
    },
  },
})

export const fileManagerListPlaceholder = style({
  border: `1px dashed ${semanticColorVar('neutral', 'border')}`,
  borderRadius: 'var(--radius-md)',
  color: semanticColorVar('neutral', 'text'),
  padding: '2rem',
  textAlign: 'center',
})
