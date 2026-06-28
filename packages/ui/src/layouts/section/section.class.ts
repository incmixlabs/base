import type { Breakpoint } from '@/theme/tokens'
import type { SectionDisplay, SectionSize } from './section.props'

export const sectionBaseCls = 'box-border'
export const sectionBase = 'shrink-0'

export const sectionBySize = {
  '1': 'py-[var(--theme-rhythm-section-space-1,1.5rem)]',
  '2': 'py-[var(--theme-rhythm-section-space-2,2.5rem)]',
  '3': 'py-[var(--theme-rhythm-section-space-3,4rem)]',
  '4': 'py-[var(--theme-rhythm-section-space-4,6rem)]',
} as const satisfies Record<SectionSize, string>

export const sectionByDisplay = {
  none: 'hidden',
  initial: '[display:initial]',
} as const satisfies Record<SectionDisplay, string>

const breakpointKeys = ['xs', 'sm', 'md', 'lg', 'xl'] as const

export const sectionDisplayResponsive = Object.fromEntries(
  breakpointKeys.map(bp => [
    bp,
    {
      none: `${bp}:hidden`,
      initial: `${bp}:[display:initial]`,
    },
  ]),
) as Record<Breakpoint, Record<SectionDisplay, string>>

export const sectionSizeResponsive = Object.fromEntries(
  breakpointKeys.map(bp => [
    bp,
    {
      '1': `${bp}:${sectionBySize['1']}`,
      '2': `${bp}:${sectionBySize['2']}`,
      '3': `${bp}:${sectionBySize['3']}`,
      '4': `${bp}:${sectionBySize['4']}`,
    },
  ]),
) as Record<Breakpoint, Record<SectionSize, string>>
