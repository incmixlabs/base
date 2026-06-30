import { type SemanticColorKey, semanticColorKeys } from '../../theme/props/color.prop'
import type { timelinePropDefs } from './timeline.props'

export type TimelineOrientation = (typeof timelinePropDefs.orientation.values)[number]
export type TimelineSize = (typeof timelinePropDefs.size.values)[number]
export type TimelineVariant = (typeof timelinePropDefs.variant.values)[number]

const joinClass = (...parts: string[]) => parts.join('')

export const timelineRoot = {
  horizontal: 'flex w-full flex-row [&>*:last-child>[data-timeline-separator]]:hidden',
  vertical: 'flex flex-col [&>*:last-child>[data-timeline-separator]]:hidden',
} as const satisfies Record<TimelineOrientation, string>

export const timelineItemOrientation = {
  horizontal: 'flex-1',
  vertical: '',
} as const satisfies Record<TimelineOrientation, string>

export const timelineItemByOrientationAndSize = {
  horizontal: {
    xs: '[margin-block-start:1.75rem] [padding-inline-end:2rem] last:[padding-inline-end:0]',
    sm: '[margin-block-start:2rem] [padding-inline-end:2rem] last:[padding-inline-end:0]',
    md: '[margin-block-start:2.25rem] [padding-inline-end:2rem] last:[padding-inline-end:0]',
    lg: '[margin-block-start:2.5rem] [padding-inline-end:2rem] last:[padding-inline-end:0]',
  },
  vertical: {
    xs: '[margin-inline-start:1.75rem] [padding-block-end:1.5rem] last:[padding-block-end:0]',
    sm: '[margin-inline-start:2rem] [padding-block-end:1.5rem] last:[padding-block-end:0]',
    md: '[margin-inline-start:2.25rem] [padding-block-end:1.5rem] last:[padding-block-end:0]',
    lg: '[margin-inline-start:2.5rem] [padding-block-end:1.5rem] last:[padding-block-end:0]',
  },
} as const satisfies Record<TimelineOrientation, Record<TimelineSize, string>>

export const timelineItemGap = 'gap-1'

export const timelineIndicatorBase =
  'absolute inline-flex shrink-0 items-center justify-center box-border border-2 rounded-full transition-[border-color,background-color,color] duration-150 ease-in-out'

export const timelineIndicatorSize = {
  xs: 'h-3 w-3',
  sm: 'h-4 w-4',
  md: 'h-[1.125rem] w-[1.125rem]',
  lg: 'h-5 w-5',
} as const satisfies Record<TimelineSize, string>

export const timelineIndicatorPosition = {
  horizontal: {
    xs: 'left-0 top-[-1.75rem] translate-y-1/2',
    sm: 'left-0 top-[-2rem] translate-y-1/2',
    md: 'left-0 top-[-2.25rem] translate-y-1/2',
    lg: 'left-0 top-[-2.5rem] translate-y-1/2',
  },
  vertical: {
    xs: 'left-[-1.75rem] top-0.5 translate-x-1/2',
    sm: 'left-[-2rem] top-0.5 translate-x-1/2',
    md: 'left-[-2.25rem] top-0.5 translate-x-1/2',
    lg: 'left-[-2.5rem] top-0.5 translate-x-1/2',
  },
} as const satisfies Record<TimelineOrientation, Record<TimelineSize, string>>

export const timelineSeparatorBase =
  'absolute bg-[var(--color-neutral-border)] transition-[background-color] duration-150 ease-in-out'

export const timelineSeparatorPosition = {
  horizontal: {
    xs: 'h-0.5 left-4 right-0 top-[calc(-1.75rem_+_0.75rem_-_1px)]',
    sm: 'h-0.5 left-5 right-0 top-[calc(-2rem_+_1rem_-_1px)]',
    md: 'h-0.5 left-[1.375rem] right-0 top-[calc(-2.25rem_+_1.125rem_-_1px)]',
    lg: 'h-0.5 left-6 right-0 top-[calc(-2.5rem_+_1.25rem_-_1px)]',
  },
  vertical: {
    xs: 'bottom-0 left-[calc(-1.75rem_+_0.75rem_-_1px)] top-4 w-0.5',
    sm: 'bottom-0 left-[calc(-2rem_+_1rem_-_1px)] top-5 w-0.5',
    md: 'bottom-0 left-[calc(-2.25rem_+_1.125rem_-_1px)] top-[1.375rem] w-0.5',
    lg: 'bottom-0 left-[calc(-2.5rem_+_1.25rem_-_1px)] top-6 w-0.5',
  },
} as const satisfies Record<TimelineOrientation, Record<TimelineSize, string>>

export const timelineSeparatorCompleted = Object.fromEntries(
  semanticColorKeys.map(color => [color, joinClass('bg-', color, '-solid')]),
) as Record<SemanticColorKey, string>

export const timelineClassNames = [
  ...Object.values(timelineRoot),
  ...Object.values(timelineItemOrientation),
  ...Object.values(timelineItemByOrientationAndSize.horizontal),
  ...Object.values(timelineItemByOrientationAndSize.vertical),
  timelineItemGap,
  timelineIndicatorBase,
  ...Object.values(timelineIndicatorSize),
  ...Object.values(timelineIndicatorPosition.horizontal),
  ...Object.values(timelineIndicatorPosition.vertical),
  timelineSeparatorBase,
  ...Object.values(timelineSeparatorPosition.horizontal),
  ...Object.values(timelineSeparatorPosition.vertical),
  ...Object.values(timelineSeparatorCompleted),
]
