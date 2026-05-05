import { style } from '@vanilla-extract/css'
import { containerBreakpoints } from '@/theme/tokens'

export const fieldGroupSideLabelsBase = style({
  containerType: 'inline-size',
})

export const fieldGroupRowBase = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr)',
  alignItems: 'start',
  rowGap: 'var(--theme-rhythm-field-group-row-gap, var(--field-group-row-root-gap))',
})

export const fieldGroupRowResponsive = style({
  '@container': {
    [`(min-width: ${containerBreakpoints.md})`]: {
      gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 2fr)',
      columnGap: 'var(--theme-rhythm-field-group-column-gap, var(--field-group-row-column-gap))',
    },
  },
})
