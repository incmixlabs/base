import { style } from '@vanilla-extract/css'

export const tableHeaderMetaBarClass = style({
  paddingInline: '0.75rem',
})

export const tableHeaderMetaContentClass = style({
  minWidth: 0,
  flex: 1,
})

export const tableHeaderToolbarClass = style({
  paddingInline: '0.75rem',
  paddingBlock: '0.5rem',
})

export const tableHeaderToolbarLeftClass = style({
  minWidth: 0,
  flex: 1,
})

export const tableHeaderToolbarRightClass = style({
  flexShrink: 0,
})
