export const flexBaseCls = 'box-border'

export const flexBase = 'min-w-0 justify-start'

export const flexByDisplay = {
  none: 'hidden',
  flex: 'flex',
  'inline-flex': 'inline-flex',
} as const

export const flexByDirection = {
  row: 'flex-row',
  'row-reverse': 'flex-row-reverse',
  column: 'flex-col',
  'column-reverse': 'flex-col-reverse',
} as const

export const flexByAlign = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  baseline: 'items-baseline',
  stretch: 'items-stretch',
} as const

export const flexByJustify = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
} as const

export const flexByWrap = {
  nowrap: 'flex-nowrap',
  wrap: 'flex-wrap',
  'wrap-reverse': 'flex-wrap-reverse',
} as const
