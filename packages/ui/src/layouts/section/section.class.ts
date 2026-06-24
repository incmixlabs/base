import type { Breakpoint } from '@/theme/tokens'
import type { SectionDisplay, SectionSize } from './section.props'

export const sectionBaseCls = 'box-border'
export const sectionBase = 'shrink-0'

export const sectionBySize = {
  '1': 'af-section-size-1',
  '2': 'af-section-size-2',
  '3': 'af-section-size-3',
  '4': 'af-section-size-4',
} as const satisfies Record<SectionSize, string>

export const sectionByDisplay = {
  none: 'af-section-display-none',
  initial: 'af-section-display-initial',
} as const satisfies Record<SectionDisplay, string>

const breakpointKeys = ['xs', 'sm', 'md', 'lg', 'xl'] as const

export const sectionDisplayResponsive = Object.fromEntries(
  breakpointKeys.map(bp => [
    bp,
    {
      none: `af-section-${bp}-display-none`,
      initial: `af-section-${bp}-display-initial`,
    },
  ]),
) as Record<Breakpoint, Record<SectionDisplay, string>>

export const sectionSizeResponsive = Object.fromEntries(
  breakpointKeys.map(bp => [
    bp,
    {
      '1': `af-section-${bp}-size-1`,
      '2': `af-section-${bp}-size-2`,
      '3': `af-section-${bp}-size-3`,
      '4': `af-section-${bp}-size-4`,
    },
  ]),
) as Record<Breakpoint, Record<SectionSize, string>>
