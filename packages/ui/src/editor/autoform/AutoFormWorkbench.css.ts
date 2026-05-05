import { style, styleVariants } from '@vanilla-extract/css'

export const workbenchRoot = style({
  overflow: 'hidden',
  borderRadius: '1.5rem',
  border: '1px solid var(--color-border)',
  background: 'var(--color-background)',
  boxShadow: 'var(--shadow-sm)',
})

export const rootBody = style({
  display: 'flex',
  minHeight: 0,
  height: '52rem',
  background: 'var(--color-background)',
})

export const secondaryColumn = style({
  display: 'flex',
  minWidth: 0,
  width: '24rem',
  flexShrink: 0,
  borderRight: '1px solid color-mix(in srgb, var(--color-border) 70%, transparent)',
  overflow: 'hidden',
})

export const mainColumn = style({
  display: 'flex',
  minWidth: 0,
  minHeight: 0,
  flex: 1,
  flexDirection: 'column',
})

export const secondaryPanel = style({
  display: 'flex',
  minHeight: 0,
  flex: 1,
  flexDirection: 'column',
})

export const sectionHeader = style({
  borderBottom: '1px solid color-mix(in srgb, var(--color-border) 70%, transparent)',
  padding: '1rem',
})

export const sectionBody = style({
  minHeight: 0,
  flex: 1,
  overflow: 'auto',
  padding: '0.75rem',
})

export const sectionTitle = style({
  fontWeight: 600,
  color: 'var(--color-foreground)',
})

export const headerBlur = style({
  borderBottom: '1px solid color-mix(in srgb, var(--color-border) 70%, transparent)',
  background: 'color-mix(in srgb, var(--color-background) 95%, transparent)',
  backdropFilter: 'blur(12px)',
})

export const titleWrap = style({
  minWidth: 0,
})

export const contentStack = style({
  display: 'flex',
  minHeight: 0,
  flex: 1,
  flexDirection: 'column',
  gap: '1rem',
  overflow: 'auto',
  padding: '1rem',
  '@media': {
    'screen and (min-width: 768px)': {
      padding: '1.5rem',
    },
  },
})

export const viewportShell = style({
  overflowX: 'auto',
  overflowY: 'hidden',
  borderRadius: '2rem',
  border: '1px dashed color-mix(in srgb, var(--color-border) 70%, transparent)',
  background: 'color-mix(in srgb, var(--color-muted) 20%, transparent)',
  padding: '0.75rem',
  '@media': {
    'screen and (min-width: 768px)': {
      padding: '1.25rem',
    },
  },
})

export const viewportSurface = style({
  margin: '0 auto',
  overflow: 'hidden',
  borderRadius: '1.75rem',
  border: '1px solid var(--color-border)',
  background: 'var(--color-background)',
  boxShadow: 'var(--shadow-sm)',
  transition: 'width 200ms',
})

export const viewportHeight = styleVariants({
  default: {
    minHeight: '36rem',
  },
  phone: {
    minHeight: '42rem',
  },
})

export const previewHeader = style({
  borderBottom: '1px solid color-mix(in srgb, var(--color-border) 70%, transparent)',
  padding: '0.75rem 1rem',
})

export const previewBody = style({
  padding: '1rem',
  '@media': {
    'screen and (min-width: 768px)': {
      padding: '1.5rem',
    },
  },
})
