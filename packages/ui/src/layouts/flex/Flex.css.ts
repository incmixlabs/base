import { style, styleVariants } from '@vanilla-extract/css'

export const flexBaseCls = 'box-border'

export const flexBase = style({
  display: 'flex',
  justifyContent: 'flex-start',
})

export const flexByDisplay = styleVariants({
  none: { display: 'none' },
  flex: { display: 'flex' },
  'inline-flex': { display: 'inline-flex' },
})

export const flexByDirection = styleVariants({
  row: { flexDirection: 'row' },
  'row-reverse': { flexDirection: 'row-reverse' },
  column: { flexDirection: 'column' },
  'column-reverse': { flexDirection: 'column-reverse' },
})

export const flexByAlign = styleVariants({
  start: { alignItems: 'flex-start' },
  center: { alignItems: 'center' },
  end: { alignItems: 'flex-end' },
  baseline: { alignItems: 'baseline' },
  stretch: { alignItems: 'stretch' },
})

export const flexByJustify = styleVariants({
  start: { justifyContent: 'flex-start' },
  center: { justifyContent: 'center' },
  end: { justifyContent: 'flex-end' },
  between: { justifyContent: 'space-between' },
})

export const flexByWrap = styleVariants({
  nowrap: { flexWrap: 'nowrap' },
  wrap: { flexWrap: 'wrap' },
  'wrap-reverse': { flexWrap: 'wrap-reverse' },
})
