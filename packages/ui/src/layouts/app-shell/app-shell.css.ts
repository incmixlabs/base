import { globalStyle, style } from '@vanilla-extract/css'
import { appShellContentVar, appShellLayoutVar, contentBodyVar } from '@/theme/runtime/component-vars'

export const appShellBody = style({
  gridTemplateColumns: appShellLayoutVar('bodyGridTemplateColumns', 'auto minmax(0, 1fr)'),
})

export const appShellBodyWithSecondary = style({
  gridTemplateColumns: appShellLayoutVar('bodyWithSecondaryGridTemplateColumns', 'auto auto minmax(0, 1fr)'),
})

export const appShellBodyWithSecondaryRight = style({
  gridTemplateColumns: appShellLayoutVar('bodyWithSecondaryRightGridTemplateColumns', 'auto minmax(0, 1fr) auto'),
})

globalStyle(`${appShellBody} > [data-slot="app-shell-sidebar"]`, {
  gridColumn: '1',
  minWidth: 0,
})

globalStyle(`${appShellBody} > [data-slot="app-shell-main"]`, {
  gridColumn: '2',
  minWidth: 0,
})

globalStyle(`${appShellBody} > [data-slot="app-shell-secondary"]`, {
  gridColumn: '2',
  minWidth: 0,
})

globalStyle(`${appShellBodyWithSecondary} > [data-slot="app-shell-main"]`, {
  gridColumn: '3',
})

globalStyle(`${appShellBodyWithSecondaryRight} > [data-slot="app-shell-main"]`, {
  gridColumn: '2',
})

globalStyle(`${appShellBodyWithSecondaryRight} > [data-slot="app-shell-secondary"]`, {
  gridColumn: '3',
})

export const appShellContent = style({
  backgroundColor: contentBodyVar('background', 'var(--background)'),
  color: contentBodyVar('foreground', 'var(--foreground)'),
  borderColor: contentBodyVar('borderColor', 'transparent'),
  paddingInline: appShellContentVar('paddingInline', '1rem'),
  paddingBlock: appShellContentVar('paddingBlock', '1rem'),
  '@media': {
    'screen and (min-width: 48rem)': {
      paddingInline: appShellContentVar('paddingInlineDesktop', '1.5rem'),
      paddingBlock: appShellContentVar('paddingBlockDesktop', '1.5rem'),
    },
  },
})

export const appShellSecondaryLeft = style({})

export const appShellSecondaryRight = style({})

export const appShellSecondaryResizeHandle = style({
  position: 'absolute',
  top: 0,
  bottom: 0,
  zIndex: 30,
  width: '0.75rem',
  padding: 0,
  border: 0,
  background: 'transparent',
  cursor: 'col-resize',
  touchAction: 'none',
  selectors: {
    '&::after': {
      content: '""',
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: '0.25rem',
      height: '3rem',
      transform: 'translate(-50%, -50%)',
      borderRadius: '999px',
      backgroundColor: contentBodyVar('borderColor', 'var(--border)'),
    },
    '&:hover::after': {
      backgroundColor: 'var(--ring)',
    },
    '&:focus-visible': {
      outline: '2px solid var(--ring)',
      outlineOffset: '-2px',
    },
    '&:focus-visible::after': {
      backgroundColor: 'var(--ring)',
    },
    '&[data-resizing]::after': {
      backgroundColor: 'var(--ring)',
    },
  },
})

export const appShellSecondaryResizeHandleLeft = style({
  right: 0,
})

export const appShellSecondaryResizeHandleRight = style({
  left: 0,
})
