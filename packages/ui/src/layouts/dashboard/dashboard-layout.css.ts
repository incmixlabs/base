import { globalStyle, style, styleVariants } from '@vanilla-extract/css'

const dashboardMoveBlockedHoverSelector = [
  '&:has(a:hover)',
  '&:has(input:hover)',
  '&:has(select:hover)',
  '&:has(textarea:hover)',
  '&:has([contenteditable]:hover)',
  '&:has([data-dashboard-resize-handle="true"]:hover)',
  '&:has([data-dashboard-ignore-drag="true"]:hover)',
  '&:has(button:not([data-dashboard-move-handle="true"]):hover)',
].join(', ')

export const dashboardItemDragging = style({
  opacity: 0.92,
})

export const dashboardItemEditable = style({
  cursor: 'grab',
  selectors: {
    '&:active': {
      cursor: 'grabbing',
    },
    [dashboardMoveBlockedHoverSelector]: {
      cursor: 'auto',
    },
  },
})

export const dashboardItemFallback = style({
  display: 'flex',
  minHeight: '5rem',
  height: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '1rem',
  color: 'color-mix(in oklch, var(--color-neutral-text) 68%, transparent)',
  fontSize: '0.875rem',
  fontWeight: 500,
  textAlign: 'center',
})

export const moveHandle = style({
  position: 'absolute',
  top: '0.375rem',
  left: '0.375rem',
  zIndex: 20,
  cursor: 'grab',
  opacity: 0,
  outline: 'none',
  touchAction: 'none',
  userSelect: 'none',
  transition: 'color 120ms ease, opacity 120ms ease',
  selectors: {
    '&:active': {
      cursor: 'grabbing',
    },
    '[data-slot="dashboard-layout-item"]:hover &': {
      opacity: 1,
    },
    '&:hover': {
      color: 'var(--foreground)',
    },
    '&:focus-visible': {
      opacity: 1,
    },
  },
})

export const resizeHandle = style({
  position: 'absolute',
  zIndex: 20,
  border: 0,
  backgroundColor: 'transparent',
  color: 'color-mix(in oklch, var(--color-neutral-text) 68%, transparent)',
  opacity: 0,
  outline: 'none',
  touchAction: 'none',
  userSelect: 'none',
  transition: 'color 120ms ease, opacity 120ms ease',
  selectors: {
    '&::before': {
      position: 'absolute',
      top: '50%',
      left: '50%',
      content: '""',
      border: '1px solid var(--border)',
      borderRadius: '999px',
      backgroundColor: 'color-mix(in oklch, var(--background) 92%, transparent)',
      boxShadow: 'var(--shadow-sm)',
      transform: 'translate(-50%, -50%)',
      backdropFilter: 'blur(8px)',
      transition: 'border-color 120ms ease, box-shadow 120ms ease, background-color 120ms ease',
    },
    '[data-slot="dashboard-layout-item"]:hover &': {
      opacity: 1,
    },
    '&:hover': {
      color: 'var(--foreground)',
    },
    '&:hover::before': {
      borderColor: 'var(--ring)',
    },
    '&:focus-visible': {
      opacity: 1,
    },
    '&:focus-visible::before': {
      boxShadow: 'var(--shadow-sm), 0 0 0 2px var(--ring)',
    },
  },
})

export const resizeHandleCornerGrip = style({
  position: 'absolute',
  bottom: '0.5rem',
  width: '0.875rem',
  height: '0.875rem',
  opacity: 0.78,
})

export const resizeHandleCornerGripByDirection = styleVariants({
  se: {
    right: '0.5rem',
    borderRight: '2px solid currentColor',
    borderBottom: '2px solid currentColor',
    borderBottomRightRadius: '0.1875rem',
  },
  sw: {
    left: '0.5rem',
    borderBottom: '2px solid currentColor',
    borderLeft: '2px solid currentColor',
    borderBottomLeftRadius: '0.1875rem',
  },
})

const cornerResizeHandle = {
  bottom: '-0.25rem',
  width: '2.75rem',
  height: '2.75rem',
  selectors: {
    '&::before': {
      display: 'none',
    },
    '&:focus-visible': {
      borderRadius: '0.375rem',
      boxShadow: '0 0 0 2px var(--ring)',
    },
  },
} as const

export const resizeHandleByDirection = styleVariants({
  n: {
    top: '-0.25rem',
    right: '1.5rem',
    left: '1.5rem',
    height: '1rem',
    cursor: 'ns-resize',
    selectors: {
      '&::before': {
        width: '2.75rem',
        height: '0.375rem',
      },
    },
  },
  e: {
    top: '1.5rem',
    right: '-0.25rem',
    bottom: '1.5rem',
    width: '1rem',
    cursor: 'ew-resize',
    selectors: {
      '&::before': {
        width: '0.375rem',
        height: '2.75rem',
      },
    },
  },
  s: {
    right: '1.5rem',
    bottom: '-0.25rem',
    left: '1.5rem',
    height: '1rem',
    cursor: 'ns-resize',
    selectors: {
      '&::before': {
        width: '2.75rem',
        height: '0.375rem',
      },
    },
  },
  w: {
    top: '1.5rem',
    bottom: '1.5rem',
    left: '-0.25rem',
    width: '1rem',
    cursor: 'ew-resize',
    selectors: {
      '&::before': {
        width: '0.375rem',
        height: '2.75rem',
      },
    },
  },
  se: {
    ...cornerResizeHandle,
    right: '-0.25rem',
    cursor: 'nwse-resize',
  },
  sw: {
    ...cornerResizeHandle,
    left: '-0.25rem',
    cursor: 'nesw-resize',
  },
})

export const presetPicker = style({
  display: 'grid',
  gap: '0.75rem',
  '@media': {
    '(min-width: 640px)': {
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    },
    '(min-width: 1024px)': {
      gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
    },
  },
})

export const presetButton = style({
  display: 'grid',
  minWidth: 0,
  gap: '0.5rem',
  padding: '0.5rem',
  border: '1px solid var(--border)',
  borderRadius: '0.375rem',
  backgroundColor: 'var(--card)',
  color: 'var(--foreground)',
  textAlign: 'left',
  outline: 'none',
  transition: 'background-color 150ms ease, border-color 150ms ease, box-shadow 150ms ease',
  selectors: {
    '&:hover': {
      borderColor: 'var(--ring)',
    },
    '&:focus-visible': {
      boxShadow: '0 0 0 2px var(--ring)',
    },
  },
})

export const presetButtonSelected = style({
  borderColor: 'var(--ring)',
  backgroundColor: 'color-mix(in oklch, var(--color-accent-soft) 40%, transparent)',
})

export const presetName = style({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  fontSize: '0.875rem',
  fontWeight: 500,
})

export const presetPreview = style({
  display: 'grid',
  overflow: 'hidden',
  padding: '0.25rem',
  borderRadius: '0.25rem',
  backgroundColor: 'color-mix(in oklch, var(--color-neutral-soft) 50%, transparent)',
})

export const presetPreviewCell = style({
  borderRadius: '0.125rem',
  backgroundColor: 'color-mix(in oklch, var(--color-neutral-text) 13.6%, transparent)',
  boxShadow: '0 0 0 1px var(--background)',
})

export const modeControl = style({
  display: 'inline-grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: '0.25rem',
  padding: '0.25rem',
  border: '1px solid var(--border)',
  borderRadius: '0.375rem',
  backgroundColor: 'var(--color-neutral-soft)',
})

export const modeButton = style({
  padding: '0.375rem 0.75rem',
  border: 0,
  borderRadius: '0.25rem',
  backgroundColor: 'transparent',
  color: 'color-mix(in oklch, var(--color-neutral-text) 68%, transparent)',
  fontSize: '0.875rem',
  fontWeight: 500,
  textTransform: 'capitalize',
  outline: 'none',
  transition: 'background-color 150ms ease, color 150ms ease, box-shadow 150ms ease',
  selectors: {
    '&:hover': {
      color: 'var(--foreground)',
    },
    '&:focus-visible': {
      boxShadow: '0 0 0 2px var(--ring)',
    },
  },
})

export const modeButtonSelected = style({
  backgroundColor: 'var(--background)',
  color: 'var(--foreground)',
  boxShadow: 'var(--shadow-sm)',
})

export const editableDashboardLayoutPanel = style({
  display: 'grid',
  gap: '0.75rem',
  minWidth: 0,
})

export const editableDashboardLayoutPanelSection = style({
  minWidth: 0,
})

export const editableDashboardPresetPicker = style({
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  '@media': {
    '(min-width: 640px)': {
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    },
    '(min-width: 1024px)': {
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    },
  },
})

globalStyle(`${editableDashboardPresetPicker} .${presetButton}`, {
  gap: '0.375rem',
  padding: '0.375rem',
})

globalStyle(`${editableDashboardPresetPicker} .${presetName}`, {
  fontSize: '0.75rem',
})

export const editableDashboardPanelToggleGroup = style({
  display: 'flex',
  maxWidth: '100%',
  minWidth: 0,
  flexWrap: 'wrap',
})

export const editableDashboardSecondaryPanel = style({
  display: 'flex',
  minHeight: 0,
  flex: '1 1 0',
  flexDirection: 'column',
})

export const editableDashboardSecondaryTabContent = style({
  minHeight: 0,
  flex: '1 1 0',
  overflowX: 'hidden',
  overflowY: 'auto',
  paddingTop: '0.75rem',
})

export const editableDashboardTemplateInput = style({
  width: '100%',
  minWidth: 0,
  border: '1px solid var(--border)',
  borderRadius: '0.375rem',
  padding: '0.375rem 0.5rem',
  backgroundColor: 'var(--background)',
  color: 'var(--foreground)',
  fontSize: '0.8125rem',
  lineHeight: 1.5,
  outline: 'none',
  selectors: {
    '&:focus-visible': {
      boxShadow: '0 0 0 2px var(--ring)',
    },
  },
})
