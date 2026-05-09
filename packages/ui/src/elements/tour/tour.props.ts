import type { PropDef } from '@/theme/props/prop-def'

export const tourSides = ['top', 'right', 'bottom', 'left'] as const
export const tourAlignments = ['start', 'center', 'end'] as const
export const tourStickyValues = ['partial', 'always'] as const
export const tourDirections = ['ltr', 'rtl'] as const
export const tourScrollBehaviors = ['auto', 'smooth', 'instant'] as const

export type TourSide = (typeof tourSides)[number]
export type TourAlign = (typeof tourAlignments)[number]
export type TourSticky = (typeof tourStickyValues)[number]
export type TourDirection = (typeof tourDirections)[number]
export type TourScrollBehavior = (typeof tourScrollBehaviors)[number]

export const tourPropDefs = {
  open: { type: 'boolean' },
  defaultOpen: { type: 'boolean', default: false },
  value: { type: 'number' },
  defaultValue: { type: 'number', default: 0 },
  dir: { type: 'enum', values: tourDirections, default: tourDirections[0] },
  alignOffset: { type: 'number', default: 0 },
  sideOffset: { type: 'number', default: 16 },
  spotlightPadding: { type: 'number', default: 4 },
  autoScroll: { type: 'boolean', default: true },
  scrollBehavior: { type: 'enum', values: tourScrollBehaviors, default: tourScrollBehaviors[1] },
  dismissible: { type: 'boolean', default: true },
  modal: { type: 'boolean', default: true },
  stepFooter: { type: 'ReactNode' },
  asChild: { type: 'boolean', default: false },
  onOpenChange: { type: 'callback', typeFullName: '(open: boolean) => void' },
  onValueChange: { type: 'callback', typeFullName: '(step: number) => void' },
  onComplete: { type: 'callback', typeFullName: '() => void' },
  onSkip: { type: 'callback', typeFullName: '() => void' },
  children: { type: 'ReactNode' },
} satisfies Record<string, PropDef>

export const tourStepPropDefs = {
  target: { type: 'object', typeFullName: 'string | RefObject<HTMLElement | null> | HTMLElement', required: true },
  side: { type: 'enum', values: tourSides, default: tourSides[2] },
  sideOffset: { type: 'number', default: tourPropDefs.sideOffset.default },
  align: { type: 'enum', values: tourAlignments, default: tourAlignments[1] },
  alignOffset: { type: 'number', default: tourPropDefs.alignOffset.default },
  collisionPadding: { type: 'object', typeFullName: 'number | Partial<Record<TourSide, number>>', default: 0 },
  arrowPadding: { type: 'number', default: 0 },
  sticky: { type: 'enum', values: tourStickyValues, default: tourStickyValues[0] },
  hideWhenDetached: { type: 'boolean', default: false },
  avoidCollisions: { type: 'boolean', default: true },
  required: { type: 'boolean', default: false },
  forceMount: { type: 'boolean', default: false },
  asChild: { type: 'boolean', default: false },
  onStepEnter: { type: 'callback', typeFullName: '() => void' },
  onStepLeave: { type: 'callback', typeFullName: '() => void' },
  children: { type: 'ReactNode' },
} satisfies Record<string, PropDef>
